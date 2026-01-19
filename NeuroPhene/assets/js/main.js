// NeuroPhene Core 3D Logic

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020612, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('neuro-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Groups
const brainGroup = new THREE.Group();
scene.add(brainGroup);

// Particles - Neurons
const particleCount = 1200;
const geometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

const color1 = new THREE.Color(0x00f3ff); // Cyan
const color2 = new THREE.Color(0xbd00ff); // Purple

for (let i = 0; i < particleCount; i++) {
    // Spherical distribution
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;

    const r = 10 + Math.random() * 2; // Radius variation

    const x = r * Math.cos(theta) * Math.sin(phi);
    const y = r * Math.sin(theta) * Math.sin(phi); // Flattened y for brain shape? Maybe not, keep sphere for abstract
    const z = r * Math.cos(phi);

    // Distort slightly to make it less perfect sphere, more "organic" cloud
    const distortion = 1 + Math.random() * 0.2;

    positions.push(x * distortion, y * distortion, z * distortion);

    // Mix colors
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
brainGroup.add(particles);

// Connections - Synapses
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
});

const lineGeometry = new THREE.BufferGeometry();
// We won't pre-calculate all lines, just some random connections for effect
// Actually, let's make a separate object for "active" synapses that animate
// For now, let's just add static lines for structure
const linePositions = [];
const maxDistance = 3;

for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
        const dist = Math.sqrt(
            Math.pow(positions[i * 3] - positions[j * 3], 2) +
            Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2) +
            Math.pow(positions[i * 3 + 2] - positions[j * 3 + 2], 2)
        );

        if (dist < maxDistance && Math.random() > 0.95) { // Only connect some neighbors
            linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
            );
        }
    }
}

lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
brainGroup.add(lines);


// Outer Glow / Aura
const auraGeometry = new THREE.SphereGeometry(12, 32, 32);
const auraMaterial = new THREE.MeshBasicMaterial({
    color: 0xbd00ff,
    transparent: true,
    opacity: 0.03,
    wireframe: true
});
const aura = new THREE.Mesh(auraGeometry, auraMaterial);
brainGroup.add(aura);

// Interaction
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Move brain away and rotate on scroll
    camera.position.z = 30 + scrollY * 0.01;
    brainGroup.rotation.z = scrollY * 0.002;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Idle rotation
    targetRotationY += 0.002;

    // Mouse Interaction easing
    brainGroup.rotation.y += 0.05 * (mouseX + targetRotationY - brainGroup.rotation.y);
    brainGroup.rotation.x += 0.05 * (mouseY - brainGroup.rotation.x);

    // Pulse effect
    const scale = 1 + Math.sin(time * 2) * 0.01;
    brainGroup.scale.set(scale, scale, scale);

    // Rotate Aura
    aura.rotation.y -= 0.005;

    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// UI Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
