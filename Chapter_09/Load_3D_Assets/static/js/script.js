// script.js

// Import the ThreeJS libraries.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

// Variable declarations.
let width = window.innerWidth;
let height = window.innerHeight;
let motorcycle;

// Create a new scene.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// New perspective camera.
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0.05, 0.22);

// Add ambient lighting and directional lighting.
const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0.2, 1, 1);
scene.add(light);

// Create a new renderer. Append the renderer to the HTML.
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector("#threejs-container");
container.appendChild(renderer.domElement);

// Add orbit camera controls.
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 0.04;

// Environmental lighting.
function setEnvironment() {
  const loader = new HDRLoader();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  loader.load(
    "static/hdr/venice_sunset_1k.hdr",
    texture => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      scene.environment = envMap;
    },
    undefined,
    err => {
      console.error("An error occurred setting the environment");
    }
  );
}

// GLTF loader.
function loadGLTF() {
  const loader = new GLTFLoader().setPath("static/glb/");
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);
  loader.load("motorcycle.glb", function(gltf) {
    motorcycle = gltf.scene;
    scene.add(motorcycle);
  });
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
  if (motorcycle) {
    motorcycle.rotation.y += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
}

// Load the environmental lighting and the motorcycle GLTF.
setEnvironment();
loadGLTF();

// Render the scene and start the animation loop.
renderer.render(scene, camera);
requestAnimationFrame(animate);
