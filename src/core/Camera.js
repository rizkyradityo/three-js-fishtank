import * as THREE from 'three';

export function createCamera() {

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(
        0,
        1.5,
        10
    );

    camera.lookAt(
        0,
        -0.5,
        0
    );

    return camera;
}
