const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 5

/* textura estrella */
const loader = new THREE.TextureLoader()
const starTexture = loader.load("https://threejs.org/examples/textures/sprites/disc.png")

/* ⭐ campo de estrellas 360 */
const starCount = 25000
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(starCount * 3)

for (let i = 0; i < starCount; i++) {
    let i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 1000
    positions[i3 + 1] = (Math.random() - 0.5) * 1000
    positions[i3 + 2] = (Math.random() - 0.5) * 1000
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
    size: 0.4,
    map: starTexture,
    transparent: true,
    depthWrite: false,
    color: 0xffffff
})

const stars = new THREE.Points(geometry, material)
scene.add(stars)

/* 🪐 AGREGADO: Generador de Planetas */
function createPlanet() {
    const size = Math.random() * 5 + 2;
    const planetGeo = new THREE.SphereGeometry(size, 32, 32);
    // Color aleatorio para variedad de planetas
    const planetMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 360}, 50%, 50%)`),
        shininess: 10
    });
    
    const planet = new THREE.Mesh(planetGeo, planetMat);
    
    // Posición lejana para que aparezcan en el horizonte
    planet.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        -1000 
    );
    
    scene.add(planet);

    // Animación individual del planeta
    function movePlanet() {
        planet.position.z += 2; // Se acerca al usuario
        planet.rotation.y += 0.01;
        
        if (planet.position.z > 100) {
            scene.remove(planet);
        } else {
            requestAnimationFrame(movePlanet);
        }
    }
    movePlanet();
}
setInterval(createPlanet, 8000); // Aparece un planeta cada 8 segundos

/* 🌀 AGREGADO: Galaxias lejanas */
function createGalaxy() {
    const galaxyGeo = new THREE.BufferGeometry();
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const color = new THREE.Color(Math.random(), Math.random(), 1);

    for (let i = 0; i < count; i++) {
        let i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 20;
        const spiral = radius * 0.5;
        pos[i3] = Math.cos(angle + spiral) * radius;
        pos[i3+1] = Math.sin(angle + spiral) * radius;
        pos[i3+2] = (Math.random() - 0.5) * 5;
    }
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const galaxyMat = new THREE.PointsMaterial({
        size: 0.2,
        color: color,
        transparent: true,
        opacity: 0.6
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    galaxy.position.set((Math.random()-0.5)*1000, (Math.random()-0.5)*1000, -1500);
    scene.add(galaxy);

    function moveGalaxy() {
        galaxy.position.z += 1.5;
        galaxy.rotation.z += 0.002;
        if(galaxy.position.z > 200) scene.remove(galaxy);
        else requestAnimationFrame(moveGalaxy);
    }
    moveGalaxy();
}
setInterval(createGalaxy, 15000);

// Luz para poder ver los planetas
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 0, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x333333));


/* 🌠 meteoritos con cola */
function meteor() {
    const group = new THREE.Group()
    const geo = new THREE.SphereGeometry(0.2, 8, 8)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const rock = new THREE.Mesh(geo, mat)
    group.add(rock)

    /* cola luminosa */
    const trailGeo = new THREE.CylinderGeometry(0.05, 0.2, 4, 8)
    const trailMat = new THREE.MeshBasicMaterial({
        color: 0xaaaaFF,
        transparent: true,
        opacity: 0.5
    })
    const trail = new THREE.Mesh(trailGeo, trailMat)
    trail.rotation.z = Math.PI / 2
    trail.position.x = -2
    group.add(trail)

    /* Fuego del meteorito (Tu código corregido para que funcione dentro de la función) */
    const fireGeo = new THREE.ConeGeometry(0.3, 2, 8)
    const fireMat = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.7
    })
    const fire = new THREE.Mesh(fireGeo, fireMat)
    fire.rotation.z = Math.PI / 2
    fire.position.x = -1.2
    group.add(fire)

    group.position.set(-300, Math.random() * 200 - 100, Math.random() * -500)
    scene.add(group)

    function move() {
        group.position.x += 4
        group.position.y -= 1
        group.rotation.z += 0.2
        if (group.position.x > 300) {
            scene.remove(group)
        } else {
            requestAnimationFrame(move)
        }
    }
    move()
}
setInterval(meteor, 1200)

/* 🚀 movimiento hacia adelante */
let speed = 3
let warpSpeed = 40
let hyperSpeed = false
let starPulse = 0

function animate() {
    requestAnimationFrame(animate)
    
    starPulse += 0.05
    material.opacity = 0.7 + Math.sin(starPulse) * 0.3
if(hyperSpeed){
material.size = 1.2
}else{
material.size = 0.4
}
    const pos = stars.geometry.attributes.position.array
    for (let i = 0; i < starCount; i++) {
        let i3 = i * 3 + 2
        pos[i3] += speed
        if (pos[i3] > 500) {
            pos[i3] = -500
        }
    }
    stars.geometry.attributes.position.needsUpdate = true

    /* rotación espacial */
    camera.rotation.x += 0.0003
    camera.rotation.y += 0.0005
    camera.rotation.z += 0.0002

    renderer.render(scene, camera)
}

animate()

/* responsive */
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})



const btn = document.getElementById("warpBtn")
btn.addEventListener("click", () => {

    hyperSpeed = true
    speed = warpSpeed
    
    btn.style.display = "none"
    
    })

    btn.addEventListener("click", () => {

        hyperSpeed = true
        btn.style.display = "none"
        
        /* activar warp visual */
        warpScreen.classList.add("active")
        
        /* después de 30 segundos cambiar de página */
        
        setTimeout(()=>{
        
        window.location.href = "pagina2.html"
        
        },30000)
        
        })






btn.addEventListener("click", async () => {

    hyperSpeed = true
    
    warpScreen.classList.add("active")
    
    music.volume = 0.6
    
    try{
    await music.play()
    }catch(e){}
    
    btn.style.display = "none"
    
    setTimeout(()=>{
    window.location.href = "pagina2.html"
    },30000)
    
    })