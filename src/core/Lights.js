import * as THREE from 'three';

export function createLights(scene) {

    const ambient =
        new THREE.AmbientLight(0x6688aa, 0.8);

    scene.add(ambient);

    const hemisphere =
        new THREE.HemisphereLight(0x87ceeb, 0x3a5a3a, 0.5);

    scene.add(hemisphere);

    const sunLight =
        new THREE.DirectionalLight(0xfff4e0, 1.5);

    sunLight.position.set(2, 8, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;

    scene.add(sunLight);

    const fillLight =
        new THREE.DirectionalLight(0x88aacc, 0.4);

    fillLight.position.set(-3, 2, -2);

    scene.add(fillLight);

    const underwaterLight1 =
        new THREE.PointLight(0x00bfff, 2, 20);

    underwaterLight1.position.set(-3, 0, 0);
    scene.add(underwaterLight1);

    const underwaterLight2 =
        new THREE.PointLight(0x00ced1, 1.5, 18);

    underwaterLight2.position.set(3, -1, 1);
    scene.add(underwaterLight2);

    const underwaterLight3 =
        new THREE.PointLight(0x4488ff, 1, 15);

    underwaterLight3.position.set(0, -2, 3);
    scene.add(underwaterLight3);

    const rimLight =
        new THREE.PointLight(0x6699cc, 1.2, 15);

    rimLight.position.set(0, 1, -5);
    scene.add(rimLight);
}
