import * as THREE from 'three';

export class CameraController {

    constructor(camera) {

        this.camera = camera;

        this.target = new THREE.Vector3(0, -0.5, 0);

        this.offset = new THREE.Vector3(0, 1.5, 10);

        this.currentOffset = this.offset.clone();

        this.moveSpeed = 5;

        this.rotationSpeed = 2;

        this.angleX = 0;

        this.angleY = 0.3;

        this.distance = 10;

        this.minDistance = 5;

        this.maxDistance = 15;

        this.minAngleY = -0.5;

        this.maxAngleY = 1.2;
    }

    update(delta, inputDirection) {

        if (inputDirection.x !== 0) {

            this.angleX +=
                inputDirection.x *
                this.rotationSpeed *
                delta;
        }

        if (inputDirection.y !== 0) {

            this.angleY +=
                inputDirection.y *
                this.rotationSpeed *
                delta;

            this.angleY = Math.max(
                this.minAngleY,
                Math.min(
                    this.maxAngleY,
                    this.angleY
                )
            );
        }

        this.currentOffset.x =
            Math.sin(this.angleX) *
            Math.cos(this.angleY) *
            this.distance;

        this.currentOffset.y =
            Math.sin(this.angleY) * this.distance;

        this.currentOffset.z =
            Math.cos(this.angleX) *
            Math.cos(this.angleY) *
            this.distance;

        this.camera.position.copy(
            this.target.clone().add(this.currentOffset)
        );

        this.camera.lookAt(this.target);
    }
}
