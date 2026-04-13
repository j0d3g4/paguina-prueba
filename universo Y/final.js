// ==================== scene.js - VERSIÓN CORREGIDA (anti-negro) ====================

// Esperar a que el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('container');
    if (!container) {
        console.error("No se encontró el div #container");
        return;
    }

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x220022); // Fondo rosa oscuro inicial (para que no sea negro)

    // Cámara
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 60, 250);

    // Renderer (¡importantísimo!)
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Luces (sin luces todo se ve negro)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffaadd, 1.2);
    directionalLight.position.set(50, 100, 80);
    scene.add(directionalLight);

    // === Tulipanes mejorados ===
    function createTulip() {
        const group = new THREE.Group();

        // Tallo
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.06, 2.5, 16),
            new THREE.MeshPhongMaterial({ color: 0x22dd88 })
        );
        stem.position.y = 1.25;
        group.add(stem);

        // Pétalos
        for (let i = 0; i < 6; i++) {
            const petal = new THREE.Mesh(
                new THREE.ConeGeometry(0.38, 1.0, 32),
                new THREE.MeshPhongMaterial({ color: 0xff44bb, shininess: 20 })
            );
            petal.position.y = 2.4;
            petal.rotation.x = 0.6;
            petal.rotation.y = (i * Math.PI * 2) / 6;
            group.add(petal);
        }

        return group;
    }

    const flowers = [];
    for (let i = 0; i < 6500; i++) {
        const tulip = createTulip();
        tulip.position.x = (Math.random() - 0.5) * 380;
        tulip.position.z = (Math.random() - 0.5) * 380;
        tulip.position.y = 0;
        scene.add(tulip);
        flowers.push(tulip);
    }

    // Mariposas
    const butterflies = [];
    for (let i = 0; i < 40; i++) {
        const butterfly = new THREE.Group();
        const wing = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2, 0.9),
            new THREE.MeshBasicMaterial({ 
                color: 0xff88cc, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85
            })
        );
        butterfly.add(wing);
        butterfly.add(wing.clone());
        butterfly.children[1].rotation.y = Math.PI;

        butterfly.position.set(
            (Math.random() - 0.5) * 120,
            15 + Math.random() * 30,
            (Math.random() - 0.5) * 120
        );
        scene.add(butterfly);
        butterflies.push(butterfly);
    }

    // Pétalos flotando
    const petals = [];
    for (let i = 0; i < 350; i++) {
        const petal = new THREE.Mesh(
            new THREE.PlaneGeometry(0.18, 0.25),
            new THREE.MeshBasicMaterial({ 
                color: 0xffbbdd, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            })
        );
        petal.position.set(
            (Math.random() - 0.5) * 300,
            Math.random() * 80,
            (Math.random() - 0.5) * 300
        );
        scene.add(petal);
        petals.push(petal);
    }

    let time = 0;
    let phase = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.015;

        // Animaciones suaves
        flowers.forEach(f => {
            f.rotation.z = Math.sin(time * 1.5) * 0.03;
        });

        butterflies.forEach((b, i) => {
            b.position.x += Math.sin(time * 2 + i) * 0.04;
            b.position.y += Math.cos(time * 1.7 + i) * 0.025;
            b.rotation.z = Math.sin(time * 5 + i) * 0.4;
        });

        petals.forEach(p => {
            p.position.y -= 0.1;
            p.rotation.z += 0.03;
            if (p.position.y < 0) p.position.y = 90;
        });

        // Cámara suave (movimiento lento)
        camera.position.y = 55 + Math.sin(time * 0.3) * 12;
        camera.position.z = 220 - time * 0.6;   // se acerca lentamente

        // Cambio de fase (agujero negro)
        if (camera.position.z < 80 && phase === 0) {
            phase = 1;
            scene.background = new THREE.Color(0x000000);
            setTimeout(() => {
                scene.background = new THREE.Color(0x330022); // rosa oscuro
                phase = 2;
            }, 1400);
        }

        renderer.render(scene, camera);
    }

    animate();

    // Resize correcto
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log("✅ Escena 3D cargada correctamente");
});