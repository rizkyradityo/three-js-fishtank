export class HungerSystem {

    constructor() {

        this.hungerRate = 2;
        this.minHunger = 0;
        this.maxHunger = 100;

        this.lowHungerThreshold = 20;
        this.criticalHungerThreshold = 10;
    }

    update(delta, fishes) {

        for (const fish of fishes) {

            fish.hunger -= this.hungerRate * delta;

            fish.hunger = Math.max(
                this.minHunger,
                Math.min(this.maxHunger, fish.hunger)
            );

            this.updateFishState(fish);
        }
    }

    feedFish(fish, foodData) {

        fish.hunger += foodData.hungerRelief;

        fish.hunger = Math.min(
            this.maxHunger,
            fish.hunger
        );

        fish.mood += foodData.moodBonus;

        fish.mood = Math.min(100, fish.mood);

        fish.lastFeedTime = Date.now();

        fish.feedCount = (fish.feedCount || 0) + 1;
    }

    updateFishState(fish) {

        if (fish.hunger <= this.criticalHungerThreshold) {

            fish.state = 'critical';

        } else if (fish.hunger <= this.lowHungerThreshold) {

            fish.state = 'hungry';

        } else if (fish.hunger >= 80) {

            fish.state = 'happy';

        } else {

            fish.state = 'normal';
        }

        if (fish.hunger <= 0) {

            fish.mood -= 1;

            fish.mood = Math.max(0, fish.mood);
        }
    }

    getHungerPercentage(fish) {

        return (
            (fish.hunger / this.maxHunger) * 100
        );
    }

    isFishHungry(fish) {

        return fish.hunger <= this.lowHungerThreshold;
    }

    isFishCritical(fish) {

        return fish.hunger <= this.criticalHungerThreshold;
    }
}
