import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { Fish } from './Fish.js';

export class FishManager {

    constructor(scene) {

        this.scene = scene;
        this.fish = [];

        this.loader = new GLTFLoader();

        this.models = {};

        this.loadAllModels();
    }

    loadAllModels() {

        const modelsToLoad = [
            { name: 'fish1', path: '/assets/models/fish.glb' },
            { name: 'fish2', path: '/assets/models/fish2.glb' }
        ];

        let loaded = 0;

        modelsToLoad.forEach(model => {

            this.loader.load(
                model.path,

                (gltf) => {

                    console.log(`${model.name} LOADED`);

                    this.models[model.name] = gltf;

                    loaded++;

                    if (loaded === modelsToLoad.length) {

                        this.createAllFish();
                    }
                },

                undefined,

                (error) => {
                    console.error(`${model.name} ERROR:`, error);
                }
            );
        });
    }

    createAllFish() {

        const modelNames = Object.keys(this.models);

        for (let i = 0; i < 5; i++) {

            const randomModel =
                modelNames[
                    Math.floor(Math.random() * modelNames.length)
                ];

            const gltf = this.models[randomModel];

            const fishModel = cloneSkeleton(gltf.scene);

            const scale = 0.3 + Math.random() * 0.2;

            fishModel.scale.set(scale, scale, scale);

            fishModel.position.set(
                -4 + i * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );

            this.scene.add(fishModel);

            const fish = new Fish(
                fishModel,
                gltf.animations,
                randomModel
            );

            this.fish.push(fish);
        }

        console.log(
            'Jumlah ikan:',
            this.fish.length
        );
    }

    getNearestHungryFishToFood(foodPosition) {

        let nearestFish = null;
        let minDistance = Infinity;

        for (const fish of this.fish) {

            if (fish.hunger >= 70) continue;

            const distance =
                fish.mesh.position.distanceTo(
                    foodPosition
                );

            if (distance < minDistance) {

                minDistance = distance;
                nearestFish = fish;
            }
        }

        return {
            fish: nearestFish,
            distance: minDistance
        };
    }

    update(delta) {

        for (const fish of this.fish) {

            fish.update(delta);

            fish.setMoodColor();
        }
    }
}
