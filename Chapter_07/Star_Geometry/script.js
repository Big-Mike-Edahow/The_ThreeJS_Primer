// script.js

// Import ThreeJS libraries.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set window size.
let width = window.innerWidth;
let height = window.innerHeight;

// Create the scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// New perspective camera.
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 4);

// Add ambient lighting and directional lighting.
const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0.2, 1, 1);
scene.add(light);

// Create a new star.
const geometry = createStarGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x9d00ff });
const star = new THREE.Mesh(geometry, material);
scene.add(star);

// Create a new renderer. Append the renderer to the HTML.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#threejs-container");
container.appendChild(renderer.domElement);

// Add Orbit Controls.
const controls = new OrbitControls(camera, renderer.domElement);

// Geometry for new star.
function createStarGeometry(innerRadius = 0.4, outerRadius = 0.8, points = 5) {
  const shape = new THREE.Shape();
  const PI2 = Math.PI * 2, inc = PI2 / (points * 2);
  shape.moveTo(outerRadius, 0);
  let inner = true;
  for (let theta = inc; theta < PI2; theta += inc) {
    const radius = inner ? innerRadius : outerRadius;
    shape.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    inner = !inner;
  }
  const extrudeSettings = {
    steps: 1,
    depth: 1,
    bevelEnabled: false
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Window responsiveness.
window.addEventListener("resize", resize);
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// Main animation loop.
function animate() {
  requestAnimationFrame(animate);
  star.rotation.x += 0.01;
  star.rotation.y += 0.01;
  star.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

// Render the scene and start the animation loop.
renderer.render(scene, camera);
requestAnimationFrame(animate);

