import { ACHIEVEMENTS } from '../data/achievements.js';

export class AchievementSystem {

    constructor() {

        this.unlockedAchievements = new Set();

        this.onAchievementUnlocked = null;

        this.cleanMasterRequired = 180;
        this.waterWhispererRequired = 120;

        this.firstFeedDone = false;
    }

    check(fishManager, scoreSystem, waterSystem) {

        this.checkFirstFeed(scoreSystem);

        this.checkFishLover(scoreSystem);

        this.checkHappyFish(fishManager);

        this.checkFullTank(fishManager);

        this.checkCoins100(scoreSystem);

        this.checkCleanMaster(waterSystem);

        this.checkGourmet(scoreSystem);

        this.checkWaterWhisperer(waterSystem);
    }

    unlock(achievementId) {

        if (
            this.unlockedAchievements.has(achievementId)
        ) {
            return;
        }

        this.unlockedAchievements.add(achievementId);

        const achievement = ACHIEVEMENTS.find(
            a => a.id === achievementId
        );

        if (
            achievement &&
            this.onAchievementUnlocked
        ) {

            this.onAchievementUnlocked(achievement);
        }
    }

    checkFirstFeed(scoreSystem) {

        if (
            !this.firstFeedDone &&
            scoreSystem.totalFeeds > 0
        ) {

            this.firstFeedDone = true;
            this.unlock('first_feed');
        }
    }

    checkFishLover(scoreSystem) {

        if (scoreSystem.totalFeeds >= 10) {

            this.unlock('fish_lover');
        }
    }

    checkHappyFish(fishManager) {

        if (!fishManager.fish || fishManager.fish.length === 0) {
            return;
        }

        const allHappy = fishManager.fish.every(
            f => f.state === 'happy'
        );

        if (allHappy) {

            this.unlock('happy_fish');
        }
    }

    checkFullTank(fishManager) {

        if (fishManager.fish.length >= 5) {

            this.unlock('full_tank');
        }
    }

    checkCoins100(scoreSystem) {

        if (scoreSystem.coins >= 100) {

            this.unlock('coins_100');
        }
    }

    checkCleanMaster(waterSystem) {

        if (
            waterSystem.cleanMasterTime >=
            this.cleanMasterRequired
        ) {

            this.unlock('clean_master');
        }
    }

    checkGourmet(scoreSystem) {

        if (scoreSystem.hasUsedAllFoods()) {

            this.unlock('gourmet');
        }
    }

    checkWaterWhisperer(waterSystem) {

        if (
            waterSystem.waterWhispererTime >=
            this.waterWhispererRequired
        ) {

            this.unlock('water_whisperer');
        }
    }

    isUnlocked(achievementId) {

        return this.unlockedAchievements.has(
            achievementId
        );
    }

    getProgress() {

        return {
            total: ACHIEVEMENTS.length,
            unlocked: this.unlockedAchievements.size
        };
    }
}
