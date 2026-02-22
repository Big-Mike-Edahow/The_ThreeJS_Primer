// app.js

// Import the ThreeJS libraries.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

class App {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 0.05, 0.22);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.querySelector("#threejs-container");
    container.appendChild(this.renderer.domElement);
    this.setEnvironment();

    this.loadGLTF();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.y = 0.04;
    this.controls.update();

    window.addEventListener("resize", this.resize.bind(this));
  }

  setEnvironment() {
    const loader = new HDRLoader();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const self = this;

    loader.load(
      "static/hdr/venice_sunset_1k.hdr",
      texture => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();

        self.scene.environment = envMap;
      },
      undefined,
      err => {
        console.error("An error occurred setting the environment");
      }
    );
  }

  loadGLTF() {
    const loader = new GLTFLoader().setPath("static/glb/");
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource.
    loader.load("motorcycle.glb", gltf => {
      const bbox = new THREE.Box3().setFromObject(gltf.scene);
      this.motorcycle = gltf.scene;
      this.scene.add(gltf.scene);
      this.renderer.setAnimationLoop(this.render.bind(this));
    });
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.motorcycle.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
