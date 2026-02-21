// script.js

import * as THREE from "three";
import { APP } from "./app.js";

window.THREE = THREE; // Used by APP Scripts.

const loader = new THREE.FileLoader();
loader.load("app.json", async function(text) {
  const player = new APP.Player();
  await player.load(JSON.parse(text));
  player.setSize(window.innerWidth, window.innerHeight);
  player.play();

  document.body.appendChild(player.dom);

  window.addEventListener("resize", function() {
    player.setSize(window.innerWidth, window.innerHeight);
  });
});
