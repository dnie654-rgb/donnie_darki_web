// 3D Background Interactivity - Donnie Darko Portfolio

const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x6366f1, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xec4899, 1);
pointLight2.position.set(-20, -20, 20);
scene.add(pointLight2);

// Objects (Floating Geometry)
const geometryGroup = new THREE.Group();
scene.add(geometryGroup);

const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.6, // Glass-like
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
});

// Icosahedron (Main shape)
const geo1 = new THREE.IcosahedronGeometry(8, 0);
const mesh1 = new THREE.Mesh(geo1, material);
mesh1.position.set(15, 5, -20);
geometryGroup.add(mesh1);

// Torus
const geo2 = new THREE.TorusGeometry(6, 1.5, 16, 100);
const mesh2 = new THREE.Mesh(geo2, material);
mesh2.position.set(-15, -5, -25);
mesh2.rotation.x = 1;
geometryGroup.add(mesh2);

// Scattered smaller cubes
for (let i = 0; i < 8; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    geometryGroup.add(mesh);
}

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth movement
    geometryGroup.rotation.y += 0.05 * (targetX - geometryGroup.rotation.y);
    geometryGroup.rotation.x += 0.05 * (targetY - geometryGroup.rotation.x);

    // Constant rotation
    const time = clock.getElapsedTime();
    mesh1.rotation.x = time * 0.1;
    mesh1.rotation.y = time * 0.15;

    mesh2.rotation.x = time * 0.08 + 1;
    mesh2.rotation.y = time * 0.05;

    // Gentle float for group
    geometryGroup.position.y = Math.sin(time * 0.5) * 0.5;

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
