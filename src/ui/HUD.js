import { FOODS } from '../data/foods.js';

export class HUD {

    constructor() {

        this.container = null;

        this.elements = {};

        this.selectedFoodId = 1;

        this.create();
    }

    create() {

        this.container =
            document.createElement('div');

        this.container.id = 'game-hud';

        this.container.innerHTML = `
            <style>
                #game-hud {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    pointer-events: none;
                    z-index: 100;
                    font-family: 'Segoe UI', sans-serif;
                }

                .hud-top {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 20px;
                }

                .hud-panel {
                    background: rgba(0, 20, 40, 0.8);
                    border: 1px solid rgba(100, 200, 255, 0.3);
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: white;
                    backdrop-filter: blur(5px);
                }

                .hud-coins {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 18px;
                    font-weight: bold;
                }

                .hud-score {
                    font-size: 14px;
                    color: #88ccff;
                }

                .hud-water {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 10px;
                    font-size: 12px;
                }

                .water-stat {
                    text-align: center;
                }

                .water-stat .label {
                    color: #88aacc;
                    margin-bottom: 4px;
                }

                .water-stat .value {
                    font-size: 16px;
                    font-weight: bold;
                }

                .water-stat .value.good { color: #44ff88; }
                .water-stat .value.warning { color: #ffaa44; }
                .water-stat .value.poor { color: #ff4444; }

                .hud-food {
                    display: flex;
                    gap: 8px;
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .food-slot {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    pointer-events: auto;
                    transition: all 0.2s;
                    border: 2px solid rgba(100, 200, 255, 0.3);
                }

                .food-slot.active {
                    border-color: #44aaff;
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(68, 170, 255, 0.5);
                }

                .food-slot .food-icon {
                    font-size: 20px;
                }

                .food-slot .food-key {
                    font-size: 10px;
                    color: #88aacc;
                }

                .hud-controls {
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    color: #88aacc;
                    font-size: 12px;
                }

                .feed-mode-indicator {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #44ff88;
                    font-size: 14px;
                    font-weight: bold;
                    text-shadow: 0 0 10px rgba(68, 255, 136, 0.5);
                    display: none;
                }

                .feed-mode-indicator.active {
                    display: block;
                }

                .achievement-popup {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(135deg, #1a4a1a, #0a2a0a);
                    border: 2px solid #44ff88;
                    border-radius: 10px;
                    padding: 15px 20px;
                    color: white;
                    animation: slideIn 0.5s ease-out;
                    z-index: 200;
                }

                .achievement-popup .title {
                    font-size: 14px;
                    color: #44ff88;
                    margin-bottom: 5px;
                }

                .achievement-popup .name {
                    font-size: 18px;
                    font-weight: bold;
                }

                .achievement-popup .reward {
                    font-size: 12px;
                    color: #ffdd44;
                    margin-top: 5px;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .hud-fish-status {
                    position: fixed;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .fish-status-bar {
                    width: 120px;
                    background: rgba(0, 20, 40, 0.8);
                    border-radius: 5px;
                    padding: 8px;
                    border: 1px solid rgba(100, 200, 255, 0.2);
                }

                .fish-status-bar .fish-name {
                    font-size: 10px;
                    color: #88aacc;
                    margin-bottom: 4px;
                }

                .hunger-bar {
                    height: 6px;
                    background: #1a1a2e;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .hunger-fill {
                    height: 100%;
                    transition: width 0.3s, background 0.3s;
                }

                .hunger-fill.high { background: #44ff88; }
                .hunger-fill.medium { background: #ffaa44; }
                .hunger-fill.low { background: #ff4444; }

                .mood-indicator {
                    font-size: 12px;
                    margin-top: 4px;
                    text-align: right;
                }
            </style>

            <div class="hud-top">
                <div class="hud-panel hud-coins">
                    <span>💰</span>
                    <span id="hud-coins">0</span>
                    <span class="hud-score" id="hud-score">Score: 0</span>
                </div>

                <div class="hud-panel hud-water">
                    <div class="water-stat">
                        <div class="label">pH</div>
                        <div class="value" id="hud-ph">7.0</div>
                    </div>
                    <div class="water-stat">
                        <div class="label">Temp</div>
                        <div class="value" id="hud-temp">26°C</div>
                    </div>
                    <div class="water-stat">
                        <div class="label">Clean</div>
                        <div class="value" id="hud-clean">100%</div>
                    </div>
                </div>
            </div>

            <div class="hud-fish-status" id="hud-fish-status">
            </div>

            <div class="feed-mode-indicator" id="feed-mode-indicator">
                🎯 FEED MODE - Tekan SPACE untuk kasih makan
            </div>

            <div class="hud-controls">
                [F] Feed Mode | [SPACE] Kasih Makan | [C] Bersihkan | [1-5] Ganti Makanan | [←→↑↓] Kamera
            </div>

            <div class="hud-food" id="hud-food">
            </div>
        `;

        document.body.appendChild(this.container);

        this.createFoodSlots();
        this.createFishStatusBars();
    }

    createFoodSlots() {

        const foodContainer =
            document.getElementById('hud-food');

        FOODS.forEach(food => {

            const slot =
                document.createElement('div');

            slot.className = 'food-slot';

            if (food.id === this.selectedFoodId) {
                slot.classList.add('active');
            }

            slot.style.background =
                `rgba(${this.hexToRgb(food.color)}, 0.3)`;

            slot.innerHTML = `
                <div class="food-icon">${
                    this.getFoodIcon(food.id)
                }</div>
                <div class="food-key">[${food.id}]</div>
            `;

            slot.dataset.foodId = food.id;

            foodContainer.appendChild(slot);
        });
    }

    createFishStatusBars() {

        const container =
            document.getElementById('hud-fish-status');

        for (let i = 0; i < 5; i++) {

            const bar =
                document.createElement('div');

            bar.className = 'fish-status-bar';

            bar.id = `fish-status-${i}`;

            bar.innerHTML = `
                <div class="fish-name">Fish ${i + 1}</div>
                <div class="hunger-bar">
                    <div class="hunger-fill high"
                         id="hunger-fill-${i}"
                         style="width: 100%">
                    </div>
                </div>
                <div class="mood-indicator"
                     id="mood-indicator-${i}">
                    😊
                </div>
            `;

            container.appendChild(bar);
        }
    }

    getFoodIcon(foodId) {

        const icons = {
            1: '🟤',
            2: '🦐',
            3: '🪱',
            4: '🟢',
            5: '⭐'
        };

        return icons[foodId] || '🍖';
    }

    hexToRgb(hex) {

        const r = (hex >> 16) & 255;
        const g = (hex >> 8) & 255;
        const b = hex & 255;

        return `${r}, ${g}, ${b}`;
    }

    update(stats, waterStatus, fishes, selectedFoodId) {

        this.selectedFoodId = selectedFoodId;

        document.getElementById('hud-coins')
            .textContent = stats.coins;

        document.getElementById('hud-score')
            .textContent = `Score: ${stats.score}`;

        const phEl =
            document.getElementById('hud-ph');
        phEl.textContent = waterStatus.ph;
        phEl.className = `value ${waterStatus.phStatus}`;

        const tempEl =
            document.getElementById('hud-temp');
        tempEl.textContent = `${waterStatus.temperature}°C`;
        tempEl.className = `value ${waterStatus.tempStatus}`;

        const cleanEl =
            document.getElementById('hud-clean');
        cleanEl.textContent = `${waterStatus.cleanliness}%`;
        cleanEl.className = `value ${waterStatus.cleanStatus}`;

        this.updateFoodSlots();

        this.updateFishStatus(fishes);
    }

    updateFoodSlots() {

        const slots =
            document.querySelectorAll('.food-slot');

        slots.forEach(slot => {

            const foodId =
                parseInt(slot.dataset.foodId);

            if (foodId === this.selectedFoodId) {

                slot.classList.add('active');

            } else {

                slot.classList.remove('active');
            }
        });
    }

    updateFishStatus(fishes) {

        fishes.forEach((fish, index) => {

            const bar =
                document.getElementById(
                    `fish-status-${index}`
                );

            if (!bar) return;

            const hungerPercent =
                Math.round(fish.hunger);

            const fill =
                document.getElementById(
                    `hunger-fill-${index}`
                );

            fill.style.width = `${hungerPercent}%`;

            if (hungerPercent > 60) {

                fill.className = 'hunger-fill high';

            } else if (hungerPercent > 30) {

                fill.className = 'hunger-fill medium';

            } else {

                fill.className = 'hunger-fill low';
            }

            const moodEl =
                document.getElementById(
                    `mood-indicator-${index}`
                );

            moodEl.textContent =
                this.getMoodEmoji(fish.state);
        });
    }

    getMoodEmoji(state) {

        const emojis = {
            happy: '😊',
            normal: '😐',
            hungry: '😟',
            critical: '😰'
        };

        return emojis[state] || '😐';
    }

    setFeedMode(active) {

        const indicator =
            document.getElementById(
                'feed-mode-indicator'
            );

        if (active) {

            indicator.classList.add('active');

        } else {

            indicator.classList.remove('active');
        }
    }

    showAchievement(achievement) {

        const popup =
            document.createElement('div');

        popup.className = 'achievement-popup';

        popup.innerHTML = `
            <div class="title">🏆 ACHIEVEMENT UNLOCKED!</div>
            <div class="name">
                ${achievement.icon} ${achievement.name}
            </div>
            <div class="reward">
                +${achievement.reward} coins
            </div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {

            popup.remove();

        }, 4000);
    }

    dispose() {

        if (this.container) {

            this.container.remove();
        }
    }
}
