import * as THREE from 'three';

export class Aquarium {

    constructor(scene) {

        this.scene = scene;

        this.width = 10;
        this.height = 6;
        this.depth = 5;

        this.time = 0;

        this.createGlass();
        this.createBottom();
        this.createWater();
        this.createWaterSurface();
        this.createRocks();
        this.createCorals();
        this.createSeaweed();
    }

    createGlass() {

        const glassMaterial =
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.05,
                roughness: 0,
                metalness: 0,
                transmission: 0.95,
                thickness: 0.1,
                envMapIntensity: 1,
                clearcoat: 1,
                clearcoatRoughness: 0.05,
                side: THREE.DoubleSide,
                depthWrite: false
            });

        const frameMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x555555,
                metalness: 0.6,
                roughness: 0.4,
                side: THREE.DoubleSide
            });

        const frameSize = 0.15;

        const panels = [
            {
                size: [this.width, this.height, 0.02],
                pos: [0, 0, this.depth / 2]
            },
            {
                size: [this.width, this.height, 0.02],
                pos: [0, 0, -this.depth / 2]
            },
            {
                size: [0.02, this.height, this.depth],
                pos: [-this.width / 2, 0, 0]
            },
            {
                size: [0.02, this.height, this.depth],
                pos: [this.width / 2, 0, 0]
            }
        ];

        panels.forEach(panel => {
            const glass = new THREE.Mesh(
                new THREE.BoxGeometry(...panel.size),
                glassMaterial
            );
            glass.position.set(...panel.pos);
            this.scene.add(glass);
        });

        const edgeGeometry =
            new THREE.CylinderGeometry(
                frameSize,
                frameSize,
                this.height,
                8
            );

        const edges = [
            [-this.width / 2, 0, -this.depth / 2],
            [-this.width / 2, 0, this.depth / 2],
            [this.width / 2, 0, -this.depth / 2],
            [this.width / 2, 0, this.depth / 2]
        ];

        edges.forEach(pos => {
            const edge = new THREE.Mesh(
                edgeGeometry,
                frameMaterial
            );
            edge.position.set(...pos);
            this.scene.add(edge);
        });
    }

    createBottom() {

        const sandGeometry =
            new THREE.BoxGeometry(
                this.width - 0.3,
                0.5,
                this.depth - 0.3
            );

        const sandMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xc2b280,
                roughness: 0.9,
                metalness: 0.1
            });

        const sand = new THREE.Mesh(
            sandGeometry,
            sandMaterial
        );

        sand.position.y = -this.height / 2 + 0.25;
        sand.receiveShadow = true;
        this.scene.add(sand);

        this.createSandDetails();
    }

    createSandDetails() {

        const pebbleGeometry =
            new THREE.SphereGeometry(0.08, 6, 6);

        const pebbleColors = [0x8b7355, 0xa08060, 0x6b5036, 0x9a8a6a];

        for (let i = 0; i < 30; i++) {

            const pebbleMaterial =
                new THREE.MeshStandardMaterial({
                    color: pebbleColors[
                        Math.floor(
                            Math.random() * pebbleColors.length
                        )
                    ],
                    roughness: 0.8,
                    metalness: 0.2
                });

            const pebble = new THREE.Mesh(
                pebbleGeometry,
                pebbleMaterial
            );

            const scaleX = 0.5 + Math.random() * 1;
            const scaleY = 0.3 + Math.random() * 0.5;
            const scaleZ = 0.5 + Math.random() * 1;

            pebble.scale.set(scaleX, scaleY, scaleZ);

            pebble.position.set(
                (Math.random() - 0.5) * (this.width - 1),
                -this.height / 2 + 0.55,
                (Math.random() - 0.5) * (this.depth - 1)
            );

            pebble.rotation.y = Math.random() * Math.PI;

            this.scene.add(pebble);
        }
    }

    createWater() {

        const geometry =
            new THREE.BoxGeometry(
                this.width - 0.4,
                this.height - 0.6,
                this.depth - 0.4
            );

        const material =
            new THREE.MeshPhysicalMaterial({
                color: 0x88ccee,
                transparent: true,
                opacity: 0.12,
                roughness: 0.05,
                metalness: 0,
                transmission: 0.9,
                thickness: 1.5,
                envMapIntensity: 0.3,
                side: THREE.DoubleSide,
                depthWrite: false
            });

        this.water =
            new THREE.Mesh(
                geometry,
                material
            );

        this.scene.add(this.water);
    }

    createWaterSurface() {

        const geometry =
            new THREE.PlaneGeometry(
                this.width - 0.4,
                this.depth - 0.4,
                32,
                32
            );

        const material =
            new THREE.MeshPhysicalMaterial({
                color: 0xaaddff,
                transparent: true,
                opacity: 0.25,
                roughness: 0.05,
                metalness: 0.1,
                transmission: 0.7,
                side: THREE.DoubleSide,
                depthWrite: false
            });

        this.waterSurface =
            new THREE.Mesh(
                geometry,
                material
            );

        this.waterSurface.rotation.x = -Math.PI / 2;
        this.waterSurface.position.y =
            this.height / 2 - 0.3;

        this.scene.add(this.waterSurface);
    }

    createRocks() {

        const rockGroup = new THREE.Group();

        const rockMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x5a5a5a,
                roughness: 0.9,
                metalness: 0.1
            });

        const rockPositions = [
            { pos: [-3.5, -2.2, 1.5], scale: [0.8, 0.6, 0.7] },
            { pos: [-3.2, -2.1, 1.8], scale: [0.5, 0.4, 0.5] },
            { pos: [3.8, -2.3, -1.2], scale: [1, 0.7, 0.8] },
            { pos: [4.0, -2.2, -0.8], scale: [0.6, 0.5, 0.5] },
            { pos: [0, -2.4, -2], scale: [1.2, 0.5, 0.9] },
            { pos: [-2, -2.3, -1.8], scale: [0.7, 0.6, 0.6] },
            { pos: [2.5, -2.2, 1.5], scale: [0.9, 0.5, 0.7] }
        ];

        rockPositions.forEach(rock => {

            const geometry =
                new THREE.DodecahedronGeometry(0.5, 1);

            const positions = geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                positions.setX(
                    i,
                    positions.getX(i) +
                        (Math.random() - 0.5) * 0.15
                );
                positions.setY(
                    i,
                    positions.getY(i) +
                        (Math.random() - 0.5) * 0.15
                );
                positions.setZ(
                    i,
                    positions.getZ(i) +
                        (Math.random() - 0.5) * 0.15
                );
            }
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh(
                geometry,
                rockMaterial.clone()
            );

            mesh.material.color.setHex(
                [0x5a5a5a, 0x6b6b6b, 0x4a4a4a][
                    Math.floor(Math.random() * 3)
                ]
            );

            mesh.position.set(...rock.pos);
            mesh.scale.set(...rock.scale);
            mesh.rotation.set(
                Math.random() * 0.3,
                Math.random() * Math.PI * 2,
                Math.random() * 0.3
            );
            mesh.castShadow = true;

            rockGroup.add(mesh);
        });

        this.scene.add(rockGroup);
    }

    createCorals() {

        const coralGroup = new THREE.Group();

        const coralConfigs = [
            {
                pos: [-2.5, -2, 1.8],
                color: 0xff6b6b,
                type: 'branch'
            },
            {
                pos: [2.8, -2.1, 1.3],
                color: 0xff8c42,
                type: 'branch'
            },
            {
                pos: [-1, -2.2, -1.5],
                color: 0xff69b4,
                type: 'round'
            },
            {
                pos: [1.5, -2.2, -1.8],
                color: 0xba55d3,
                type: 'round'
            },
            {
                pos: [3.5, -2.3, 0],
                color: 0xff4500,
                type: 'branch'
            },
            {
                pos: [-3.5, -2.2, -0.5],
                color: 0xff1493,
                type: 'round'
            }
        ];

        coralConfigs.forEach(config => {

            let coral;

            if (config.type === 'branch') {
                coral = this.createBranchCoral(
                    config.color
                );
            } else {
                coral = this.createRoundCoral(
                    config.color
                );
            }

            coral.position.set(...config.pos);
            coralGroup.add(coral);
        });

        this.scene.add(coralGroup);
    }

    createBranchCoral(color) {

        const group = new THREE.Group();

        const material =
            new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.6,
                metalness: 0.1
            });

        const branchCount = 3 + Math.floor(
            Math.random() * 3
        );

        for (let i = 0; i < branchCount; i++) {

            const height = 0.4 + Math.random() * 0.5;
            const radius = 0.06 + Math.random() * 0.04;

            const geometry =
                new THREE.CylinderGeometry(
                    radius * 0.5,
                    radius,
                    height,
                    8
                );

            const branch = new THREE.Mesh(
                geometry,
                material
            );

            const angle = (i / branchCount) * Math.PI * 2;
            const spread = 0.15 + Math.random() * 0.1;

            branch.position.set(
                Math.cos(angle) * spread,
                height / 2,
                Math.sin(angle) * spread
            );

            branch.rotation.set(
                (Math.random() - 0.5) * 0.4,
                0,
                (Math.random() - 0.5) * 0.4
            );

            group.add(branch);

            if (Math.random() > 0.5) {

                const tipHeight = height * 0.4;
                const tipGeometry =
                    new THREE.CylinderGeometry(
                        0.02,
                        radius * 0.5,
                        tipHeight,
                        6
                    );

                const tip = new THREE.Mesh(
                    tipGeometry,
                    material
                );

                tip.position.set(
                    branch.position.x,
                    height + tipHeight / 2,
                    branch.position.z
                );

                tip.rotation.set(
                    (Math.random() - 0.5) * 0.6,
                    0,
                    (Math.random() - 0.5) * 0.6
                );

                group.add(tip);
            }
        }

        return group;
    }

    createRoundCoral(color) {

        const group = new THREE.Group();

        const material =
            new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.5,
                metalness: 0.1
            });

        const sphereCount = 4 + Math.floor(
            Math.random() * 4
        );

        for (let i = 0; i < sphereCount; i++) {

            const size = 0.1 + Math.random() * 0.15;

            const geometry =
                new THREE.SphereGeometry(
                    size,
                    12,
                    12
                );

            const sphere = new THREE.Mesh(
                geometry,
                material
            );

            sphere.position.set(
                (Math.random() - 0.5) * 0.4,
                size * 0.8,
                (Math.random() - 0.5) * 0.4
            );

            sphere.scale.set(
                1,
                0.7 + Math.random() * 0.3,
                1
            );

            group.add(sphere);
        }

        return group;
    }

    createSeaweed() {

        const seaweedGroup = new THREE.Group();

        const seaweedPositions = [
            [-4, -2, 0],
            [-3.5, -2, -1],
            [3.8, -2, 0.5],
            [4, -2, -0.8],
            [-1.5, -2, 2],
            [1, -2, 2.2],
            [0, -2, -2.2]
        ];

        seaweedPositions.forEach(pos => {

            const seaweed = this.createSingleSeaweed(
                pos[0] + (Math.random() - 0.5) * 0.5,
                pos[2] + (Math.random() - 0.5) * 0.5
            );

            seaweed.position.set(pos[0], pos[1], pos[2]);
            seaweedGroup.add(seaweed);
        });

        this.scene.add(seaweedGroup);
    }

    createSingleSeaweed(x, z) {

        const group = new THREE.Group();

        const segments = 8;
        const height = 1.5 + Math.random() * 1;

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x228b22,
                roughness: 0.7,
                metalness: 0,
                side: THREE.DoubleSide
            });

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                height * 0.3,
                (Math.random() - 0.5) * 0.3
            ),
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                height * 0.6,
                (Math.random() - 0.5) * 0.5
            ),
            new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                height,
                (Math.random() - 0.5) * 0.3
            )
        ]);

        const geometry =
            new THREE.TubeGeometry(
                curve,
                segments,
                0.04,
                6,
                false
            );

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        group.add(mesh);

        const leafMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2e8b2e,
                roughness: 0.7,
                side: THREE.DoubleSide
            });

        for (let i = 0; i < 3; i++) {

            const leafSize = 0.15 + Math.random() * 0.1;
            const leafGeometry =
                new THREE.PlaneGeometry(
                    leafSize,
                    leafSize * 2
                );

            const leaf = new THREE.Mesh(
                leafGeometry,
                leafMaterial
            );

            const t = 0.3 + Math.random() * 0.5;
            const point = curve.getPoint(t);

            leaf.position.copy(point);
            leaf.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.3
            );

            group.add(leaf);
        }

        return group;
    }

    update(delta) {

        this.time += delta;

        this.updateWaterSurface(delta);
    }

    updateWaterSurface(delta) {

        if (!this.waterSurface) return;

        const positions =
            this.waterSurface.geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            const y =
                Math.sin(x * 2 + this.time * 1.5) * 0.05 +
                Math.sin(z * 3 + this.time * 1.2) * 0.03 +
                Math.sin((x + z) * 1.5 + this.time * 2) * 0.02;

            positions.setY(i, y);
        }

        positions.needsUpdate = true;
        this.waterSurface.geometry.computeVertexNormals();
    }
}
