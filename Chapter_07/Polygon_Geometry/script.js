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

// Create a new polygon.
const geometry = createPolygonGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0000FF });
const polygon = new THREE.Mesh(geometry, material);
scene.add(polygon);

// Create a new renderer. Append the renderer to the HTML.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#threejs-container");
container.appendChild(renderer.domElement);

// Add Orbit Controls.
const controls = new OrbitControls(camera, renderer.domElement);

// Geometry for new polygon.
function createPolygonGeometry(radius = 1, sides = 6) {
  const shape = new THREE.Shape();
  const PI2 = Math.PI * 2;
  const inc = PI2 / sides;
  shape.moveTo(radius, 0);
  let inner = true;
  for (let theta = inc; theta < PI2; theta += inc) {
    shape.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  const extrudeSettings = {
    steps: 1,
    depth: radius * 0.25,
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
  polygon.rotation.x += 0.01;
  polygon.rotation.y += 0.01;
  polygon.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

// Render the scene and start the animation loop.
renderer.render(scene, camera);
requestAnimationFrame(animate);
