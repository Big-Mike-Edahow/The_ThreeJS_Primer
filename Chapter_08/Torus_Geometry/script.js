// script.js

// Import the ThreeJS libraries.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set the window size.
let width = window.innerWidth;
let height = window.innerHeight;

// Create a new scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// New perspective camera.
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 4);

// Add ambient and directional lighting.
const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0.2, 1, 1);
scene.add(light);

// Create a torus knot. Add the torus knot to the scene.
const geometry = new THREE.TorusKnotGeometry();
const material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x444444, shininess: 60});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Create a new renderer. Append the renderer to the HTML.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
const container = document.querySelector("#threejs-container");
container.appendChild(renderer.domElement);

// Add orbit camera controls.
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
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

// Render the scene and start the animation loop.
renderer.render(scene, camera);
requestAnimationFrame(animate);
