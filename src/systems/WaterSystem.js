export class WaterSystem {

    constructor() {

        this.ph = 7.0;
        this.temperature = 26;
        this.cleanliness = 100;

        this.phDegradationRate = 0.1;
        this.tempDegradationRate = 0.05;
        this.cleanlinessDegradationRate = 1;

        this.idealPhMin = 6.5;
        this.idealPhMax = 7.5;
        this.idealTempMin = 24;
        this.idealTempMax = 28;

        this.feedingDirtiesWater = 3;
        this.fishDirtiesWater = 0.5;

        this.cleanMasterTime = 0;
        this.waterWhispererTime = 0;
    }

    update(delta, fishCount, foodEatenCount) {

        this.ph -=
            this.phDegradationRate * delta * 0.1;

        this.ph = Math.max(5, Math.min(9, this.ph));

        this.temperature -=
            this.tempDegradationRate * delta * 0.1;

        this.temperature = Math.max(
            18,
            Math.min(35, this.temperature)
        );

        const dirtyFactor =
            this.fishDirtiesWater * fishCount * delta;

        this.cleanliness -= dirtyFactor;

        if (foodEatenCount > 0) {

            this.cleanliness -=
                this.feedingDirtiesWater * foodEatenCount;
        }

        this.cleanliness = Math.max(
            0,
            Math.min(100, this.cleanliness)
        );

        this.updateQualityTimers(delta);
    }

    updateQualityTimers(delta) {

        if (this.isClean()) {

            this.cleanMasterTime += delta;

        } else {

            this.cleanMasterTime = 0;
        }

        if (this.isPhPerfect()) {

            this.waterWhispererTime += delta;

        } else {

            this.waterWhispererTime = 0;
        }
    }

    feed() {

        this.cleanliness -= this.feedingDirtiesWater;

        this.cleanliness = Math.max(
            0,
            this.cleanliness
        );
    }

    clean() {

        this.cleanliness = 100;
    }

    adjustPh(amount) {

        this.ph += amount;

        this.ph = Math.max(5, Math.min(9, this.ph));
    }

    adjustTemperature(amount) {

        this.temperature += amount;

        this.temperature = Math.max(
            18,
            Math.min(35, this.temperature)
        );
    }

    isPhPerfect() {

        return (
            this.ph >= this.idealPhMin &&
            this.ph <= this.idealPhMax
        );
    }

    isTemperatureIdeal() {

        return (
            this.temperature >= this.idealTempMin &&
            this.temperature <= this.idealTempMax
        );
    }

    isClean() {

        return this.cleanliness >= 80;
    }

    getQualityScore() {

        let score = 0;

        if (this.isPhPerfect()) score += 33;
        else score += Math.max(
            0,
            33 - Math.abs(this.ph - 7) * 10
        );

        if (this.isTemperatureIdeal()) score += 33;
        else score += Math.max(
            0,
            33 - Math.abs(this.temperature - 26) * 3
        );

        score += (this.cleanliness / 100) * 34;

        return Math.round(score);
    }

    getStatus() {

        return {
            ph: this.ph.toFixed(1),
            temperature: this.temperature.toFixed(1),
            cleanliness: Math.round(this.cleanliness),
            qualityScore: this.getQualityScore(),
            phStatus: this.isPhPerfect() ? 'ideal' : 'warning',
            tempStatus: this.isTemperatureIdeal()
                ? 'ideal'
                : 'warning',
            cleanStatus: this.isClean()
                ? 'good'
                : this.cleanliness > 50
                ? 'fair'
                : 'poor'
        };
    }
}
