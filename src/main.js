import * as THREE from 'three';

import { createScene } from './core/Scene.js';
import { createCamera } from './core/Camera.js';
import { createRenderer } from './core/Renderer.js';
import { createLights } from './core/Lights.js';
import { InputHandler } from './core/InputHandler.js';
import { CameraController } from './core/CameraController.js';

import { Aquarium } from './aquarium/Aquarium.js';
import { FishManager } from './fish/FishManager.js';
import { Bubbles } from './aquarium/Bubbles.js';

import { Food } from './food/Food.js';
import { getFoodById } from './data/foods.js';

import { HungerSystem } from './systems/HungerSystem.js';
import { WaterSystem } from './systems/WaterSystem.js';
import { ScoreSystem } from './systems/ScoreSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';

import { HUD } from './ui/HUD.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

createLights(scene);

const cameraController = new CameraController(camera);

const inputHandler = new InputHandler();

const aquarium = new Aquarium(scene);
const fishManager = new FishManager(scene);
const bubbles = new Bubbles(scene);

const hungerSystem = new HungerSystem();
const waterSystem = new WaterSystem();
const scoreSystem = new ScoreSystem();
const achievementSystem = new AchievementSystem();

const hud = new HUD();

const foods = [];

const waterLevel = 1.0;

let feedModeActive = false;

inputHandler.onSpacePress = () => {

    if (feedModeActive) {

        dropFood();
    }
};

inputHandler.onToggleFeedMode = (active) => {

    feedModeActive = active;

    hud.setFeedMode(active);
};

inputHandler.onFoodChange = (foodId) => {

    console.log('Food selected:', foodId);
};

inputHandler.onClean = () => {

    waterSystem.clean();

    console.log('Aquarium cleaned!');
};

achievementSystem.onAchievementUnlocked =
    (achievement) => {

        scoreSystem.addCoins(achievement.reward);

        hud.showAchievement(achievement);
    };

function dropFood() {

    const foodData =
        getFoodById(inputHandler.selectedFoodId);

    if (!foodData) return;

    if (foodData.cost > 0) {

        if (!scoreSystem.canAfford(foodData.cost)) {

            console.log('Not enough coins!');
            return;
        }

        scoreSystem.spendCoins(foodData.cost);
    }

    const dropPosition = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        3,
        (Math.random() - 0.5) * 3
    );

    const food = new Food(
        scene,
        foodData,
        dropPosition
    );

    foods.push(food);

    waterSystem.feed();

    scoreSystem.addFeedScore(foodData);
}

function checkFoodFishCollision() {

    for (let i = foods.length - 1; i >= 0; i--) {

        const food = foods[i];

        if (food.isEaten) continue;

        if (!food.isFloating) continue;

        const { fish, distance } =
            fishManager.getNearestHungryFishToFood(
                food.getPosition()
            );

        if (fish && distance < 4) {

            fish.seekFood(food.getPosition());
        }

        if (fish && distance < 1.2) {

            const foodData = food.foodData;

            hungerSystem.feedFish(
                fish,
                foodData
            );

            food.eaten();

            foods.splice(i, 1);
        }
    }
}

function cleanupFoods() {

    for (
        let i = foods.length - 1;
        i >= 0;
        i--
    ) {

        const food = foods[i];

        if (food.isEaten) {

            foods.splice(i, 1);

        } else if (
            food.mesh.position.y < -5
        ) {

            food.eaten();

            foods.splice(i, 1);
        }
    }
}

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    const cameraInput =
        inputHandler.getCameraInput();

    cameraController.update(delta, cameraInput);

    aquarium.update(delta);

    fishManager.update(delta);

    bubbles.update(delta);

    hungerSystem.update(
        delta,
        fishManager.fish
    );

    waterSystem.update(
        delta,
        fishManager.fish.length,
        0
    );

    scoreSystem.update(delta, fishManager.fish);

    for (const food of foods) {

        food.update(delta, waterLevel);
    }

    checkFoodFishCollision();

    cleanupFoods();

    achievementSystem.check(
        fishManager,
        scoreSystem,
        waterSystem
    );

    hud.update(
        scoreSystem.getStats(),
        waterSystem.getStatus(),
        fishManager.fish,
        inputHandler.selectedFoodId
    );

    renderer.render(scene, camera);
}

animate();
