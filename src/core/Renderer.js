import * as THREE from 'three';

export function createRenderer() {

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;

    document.body.appendChild(
        renderer.domElement
    );

    window.addEventListener(
        'resize',
        () => {

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    );

    return renderer;
}