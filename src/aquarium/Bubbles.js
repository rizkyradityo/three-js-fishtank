import * as THREE from 'three';

export class Bubbles {

    constructor(scene) {

        this.scene = scene;

        this.bubbles = [];

        this.time = 0;

        this.createBubbles(60);
    }

    createBubbles(count) {

        for (let i = 0; i < count; i++) {

            const size = 0.02 + Math.random() * 0.06;

            const geometry =
                new THREE.SphereGeometry(
                    size,
                    12,
                    12
                );

            const material =
                new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.4 + Math.random() * 0.3,
                    roughness: 0,
                    metalness: 0.1,
                    transmission: 0.8,
                    thickness: 0.5
                });

            const bubble =
                new THREE.Mesh(
                    geometry,
                    material
                );

            bubble.position.set(
                (Math.random() - 0.5) * 8,
                -3 + Math.random() * 6,
                (Math.random() - 0.5) * 4
            );

            bubble.userData.speed =
                0.2 + Math.random() * 0.5;

            bubble.userData.wobbleSpeed =
                1 + Math.random() * 2;

            bubble.userData.wobbleAmount =
                0.01 + Math.random() * 0.03;

            bubble.userData.startX =
                bubble.position.x;

            bubble.userData.phase =
                Math.random() * Math.PI * 2;

            this.scene.add(bubble);

            this.bubbles.push(bubble);
        }
    }

    update(delta) {

        this.time += delta;

        for (const bubble of this.bubbles) {

            bubble.position.y +=
                bubble.userData.speed * delta;

            const wobble =
                Math.sin(
                    this.time *
                        bubble.userData.wobbleSpeed +
                        bubble.userData.phase
                ) *
                bubble.userData.wobbleAmount;

            bubble.position.x =
                bubble.userData.startX + wobble;

            const scale =
                1 +
                Math.sin(
                    this.time * 2 +
                        bubble.userData.phase
                ) * 0.1;

            bubble.scale.setScalar(scale);

            if (bubble.position.y > 3) {

                bubble.position.y = -3;

                bubble.position.x =
                    (Math.random() - 0.5) * 8;

                bubble.userData.startX =
                    bubble.position.x;
            }
        }
    }
}
