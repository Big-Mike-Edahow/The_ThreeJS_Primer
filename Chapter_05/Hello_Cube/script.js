// script.js

// Import ThreeJS libraries.
import * as THREE from "three";                                             
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set window size.
let width = window.innerWidth;
let height = window.innerHeight;

// New perspective camera.
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 4);

// Create the scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Add ambient and directional lighting.
const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0.2, 1, 1);
scene.add(light);

// Create the cube.
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create new renderer. Append renderer to HTML.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#threejs-container");
container.append(renderer.domElement);

// Add orbit controls.
const controls = new OrbitControls(camera, renderer.domElement);

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
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update()
  renderer.render(scene, camera);
}

// Render the scene and start the animation loop.
renderer.render(scene, camera)
requestAnimationFrame(animate);

