// app.js

// Import the ThreeJS libraries.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

class App {
  constructor() {
    // Set the window size.
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Used to update the mixer in the render loop.
    this.clock = new THREE.Timer();

    // Create a new scene.
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    // New perspective camera.
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 0.8, 2.5);

    // Add ambient and directional lighting.
    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    this.scene.add(ambient);
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    // Create a new renderer. Append the renderer to the HTML.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    const container = document.querySelector("#threejs-container");
    container.appendChild(this.renderer.domElement);

    // Add orbit camera controls.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.y = 0.8;
    this.controls.update();

    // Set up the environment lighting, and load the GLTF.
    this.setEnvironment();
    this.loadGLTF();

    // Window repsonsiveness.
    window.addEventListener("resize", this.resize.bind(this));
  }
  
  // Environmental lighting.
  setEnvironment() {
    const loader = new HDRLoader();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const self = this;
    loader.load("./static/images/venice_sunset_1k.hdr", texture => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      self.scene.environment = envMap;
    });
  }

  // GLTF loader.
  loadGLTF() {
    const loader = new GLTFLoader().setPath("./static/images/");
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
    loader.load("knight.glb", gltf => {
      this.knight = gltf.scene;
      this.knight.traverse(child => {
        if (child.isMesh && child.name == "Cube") child.visible = false;
      });

      this.mixer = new THREE.AnimationMixer(this.knight);
      this.animations = {};

      const names = [];

      gltf.animations.forEach(clip => {
        const name = clip.name.toLowerCase();
        names.push(name);
        this.animations[name] = clip;
      });

      this.action = "look around";
      const options = { name: "look around" };

      const gui = new GUI();
      gui.add(options, "name", names).onChange(name => {
        this.action = name;
      });

      this.scene.add(gltf.scene);
      this.renderer.setAnimationLoop(this.render.bind(this));
    });
  }

  // Set the action that the knight is to perform.
  set action(name) {
    if (this.actionName == name.toLowerCase()) return;

    const clip = this.animations[name.toLowerCase()];

    if (clip !== undefined) {
      const action = this.mixer.clipAction(clip);
      if (name == "die") {
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce);
      }
      action.reset();
      const nofade = this.actionName == "die";
      this.actionName = name.toLowerCase();
      action.play();
      if (this.curAction) {
        if (nofade) {
          this.curAction.enabled = false;
        } else {
          this.curAction.crossFadeTo(action, 0.5);
        }
      }
      this.curAction = action;
    }
  }

  // Resize window.
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  // Animation loop.
  render() {
    const dt = this.clock.getDelta();
    if (this.mixer) this.mixer.update(dt);
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
