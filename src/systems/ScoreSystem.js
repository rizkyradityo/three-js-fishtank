export class ScoreSystem {

    constructor() {

        this.coins = 0;
        this.score = 0;
        this.totalFeeds = 0;
        this.foodsUsed = new Set();

        this.coinEarnRate = 0.5;
        this.coinAccumulator = 0;
    }

    update(delta, fishes) {

        this.coinAccumulator += this.coinEarnRate * delta;

        if (this.coinAccumulator >= 1) {

            const happyFishCount = fishes.filter(
                f => f.state === 'happy'
            ).length;

            const coinsToEarn = Math.min(
                3,
                happyFishCount
            );

            if (coinsToEarn > 0) {

                this.coins += coinsToEarn;
                this.score += coinsToEarn * 10;
            }

            this.coinAccumulator = 0;
        }
    }

    addFeedScore(foodData) {

        this.totalFeeds++;

        this.foodsUsed.add(foodData.id);

        this.score += 5;

        if (foodData.cost > 0) {

            this.coins -= foodData.cost;
        }
    }

    spendCoins(amount) {

        if (this.coins >= amount) {

            this.coins -= amount;
            return true;
        }

        return false;
    }

    addCoins(amount) {

        this.coins += amount;
    }

    canAfford(cost) {

        return this.coins >= cost;
    }

    getStats() {

        return {
            coins: this.coins,
            score: this.score,
            totalFeeds: this.totalFeeds,
            foodsUsed: this.foodsUsed.size
        };
    }

    hasUsedAllFoods() {

        return this.foodsUsed.size >= 5;
    }
}
