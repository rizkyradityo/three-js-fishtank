import * as THREE from 'three';

export class Food {

    constructor(scene, foodData, position) {

        this.scene = scene;
        this.foodData = foodData;

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.gravity = -4;
        this.drag = 0.98;

        this.isEaten = false;
        this.isFloating = false;

        this.floatOffset = 0;
        this.floatSpeed = 1 + Math.random() * 2;

        this.createMesh(position);
    }

    createMesh(position) {

        const geometry =
            new THREE.SphereGeometry(
                this.foodData.size,
                8,
                8
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: this.foodData.color,
                roughness: 0.5,
                metalness: 0.1,
                emissive: this.foodData.color,
                emissiveIntensity: 0.2
            });

        this.mesh = new THREE.Mesh(
            geometry,
            material
        );

        this.mesh.position.copy(position);

        this.scene.add(this.mesh);
    }

    update(delta, waterLevel) {

        if (this.isEaten) return;

        if (!this.isFloating) {

            this.velocity.y += this.gravity * delta;
            this.velocity.multiplyScalar(this.drag);

            this.mesh.position.add(
                this.velocity.clone().multiplyScalar(delta)
            );

            this.mesh.rotation.x += delta * 2;
            this.mesh.rotation.z += delta * 1.5;

            if (this.mesh.position.y <= waterLevel) {

                this.mesh.position.y = waterLevel;
                this.isFloating = true;
                this.velocity.set(0, 0, 0);
            }
        } else {

            this.floatOffset += this.floatSpeed * delta;

            this.mesh.position.y =
                waterLevel +
                Math.sin(this.floatOffset) * 0.05;

            this.mesh.rotation.x = 0;
            this.mesh.rotation.z = 0;
        }
    }

    eaten() {

        this.isEaten = true;
        this.scene.remove(this.mesh);

        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }
        if (this.mesh.material) {
            this.mesh.material.dispose();
        }
    }

    getPosition() {
        return this.mesh.position;
    }

    isNearFish(fishPosition, threshold = 1.2) {

        if (this.isEaten || !this.isFloating) {
            return false;
        }

        const distance =
            this.mesh.position.distanceTo(fishPosition);

        return distance < threshold;
    }
}
