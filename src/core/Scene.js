import * as THREE from 'three';

export function createScene() {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x111111);

    scene.fog = new THREE.FogExp2(
        0x111111,
        0.008
    );

    createBackground(scene);

    return scene;
}

function createBackground(scene) {

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
        256, 200, 50,
        256, 256, 400
    );

    gradient.addColorStop(0, '#2a3a4a');
    gradient.addColorStop(0.5, '#1a2a3a');
    gradient.addColorStop(1, '#0d1520');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);

    const geometry =
        new THREE.PlaneGeometry(60, 40);

    const material =
        new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            fog: false
        });

    const background = new THREE.Mesh(
        geometry,
        material
    );

    background.position.set(0, 2, -15);

    scene.add(background);
}
