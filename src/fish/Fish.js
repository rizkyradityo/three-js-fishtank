import * as THREE from 'three';

export class Fish {
    constructor(model, animations, modelName = 'fish1') {
        this.mesh = model;
        this.animations = animations;
        this.modelName = modelName;

        this.mixer = null;
        this.action = null;

        if (this.animations && this.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.mesh);
            this.action = this.mixer.clipAction(this.animations[0]);
            this.action.play();
        }

        this.velocity = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
        this.baseSpeed = 1.5;
        this.speed = this.baseSpeed;

        this.bounds = {
            x: 4,
            y: 2,
            z: 2
        };

        this.hunger = 80;
        this.mood = 70;
        this.state = 'normal';

        this.lastFeedTime = Date.now();
        this.feedCount = 0;

        this.originalColors = null;
        this.colorSaved = false;

        this.setRandomTarget();
    }

    setRandomTarget() {
        this.targetPosition.set(
            (Math.random() - 0.5) * this.bounds.x * 2,
            (Math.random() - 0.5) * this.bounds.y * 2,
            (Math.random() - 0.5) * this.bounds.z * 2
        );
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.updateSpeedByState();

        const direction = new THREE.Vector3()
            .subVectors(this.targetPosition, this.mesh.position);

        if (direction.length() < 0.3) {
            this.setRandomTarget();
        }

        direction.normalize();

        this.velocity.lerp(
            direction.multiplyScalar(this.speed),
            delta * 2
        );

        this.mesh.position.add(
            this.velocity.clone().multiplyScalar(delta)
        );

        this.clampPosition();

        if (this.velocity.length() > 0.01) {
            const angle = Math.atan2(
                this.velocity.x,
                this.velocity.z
            );
            this.mesh.rotation.y = angle;
        }
    }

    updateSpeedByState() {
        switch (this.state) {
            case 'happy':
                this.speed = this.baseSpeed * 1.2;
                break;
            case 'hungry':
                this.speed = this.baseSpeed * 0.7;
                break;
            case 'critical':
                this.speed = this.baseSpeed * 0.4;
                break;
            default:
                this.speed = this.baseSpeed;
        }
    }

    saveOriginalColors() {
        if (!this.mesh || this.originalColors) return;

        this.originalColors = [];

        this.mesh.traverse((child) => {
            if (child.isMesh && child.material) {
                this.originalColors.push({
                    mesh: child,
                    color: child.material.color.clone()
                });
            }
        });
    }

    setMoodColor() {
        if (!this.mesh) return;

        if (!this.colorSaved) {
            this.saveOriginalColors();
            this.colorSaved = true;
        }

        if (!this.originalColors) return;

        let t = 0;
        if (this.state === 'critical') t = 0.6;
        else if (this.state === 'hungry') t = 0.3;

        for (const entry of this.originalColors) {
            const target = new THREE.Color(0x888888);
            entry.mesh.material.color.copy(
                entry.color.clone().lerp(target, t)
            );
        }
    }

    seekFood(foodPosition) {
        this.targetPosition.copy(foodPosition);
    }

    clampPosition() {
        const pos = this.mesh.position;

        if (pos.x > this.bounds.x) {
            pos.x = this.bounds.x;
            this.velocity.x *= -1;
            this.setRandomTarget();
        } else if (pos.x < -this.bounds.x) {
            pos.x = -this.bounds.x;
            this.velocity.x *= -1;
            this.setRandomTarget();
        }

        if (pos.y > this.bounds.y) {
            pos.y = this.bounds.y;
            this.velocity.y *= -1;
            this.setRandomTarget();
        } else if (pos.y < -this.bounds.y) {
            pos.y = -this.bounds.y;
            this.velocity.y *= -1;
            this.setRandomTarget();
        }

        if (pos.z > this.bounds.z) {
            pos.z = this.bounds.z;
            this.velocity.z *= -1;
            this.setRandomTarget();
        } else if (pos.z < -this.bounds.z) {
            pos.z = -this.bounds.z;
            this.velocity.z *= -1;
            this.setRandomTarget();
        }
    }
}
