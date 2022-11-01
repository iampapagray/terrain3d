import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";

import mountainImg from "./mountain.jpg";
import heightImg from "./height.jpg";
import alphaImg from "./alpha.png";

// debug gui
const gui = new dat.GUI();

// Loaders
const loader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("#canvas");

// Textures
const mountainTexture = loader.load(mountainImg);
const heightTexture = loader.load(heightImg);
const alpha = loader.load(alphaImg);

// Scene
const scene = new THREE.Scene();

// Geometry  - shapes/skeletons
const planeShape = new THREE.PlaneGeometry(3, 3, 64, 64);

// Materials - skins
const planeSkin = new THREE.MeshStandardMaterial({
  color: "gray",
  map: mountainTexture,
  displacementMap: heightTexture,
  displacementScale: 0.6,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});

// Mesh - Objects
const plane = new THREE.Mesh(planeShape, planeSkin);
scene.add(plane);
plane.rotation.x = 5.0;

// Lights
const pointLight1 = new THREE.PointLight("#00b3ff", 1.5);
pointLight1.position.set(0.2, 10, 4.4);
scene.add(pointLight1);

// Helpers
const pointLight1Helper = new THREE.PointLightHelper(pointLight1, 0.3);
scene.add(pointLight1Helper);

// Gui setup
const debugPlane = gui.addFolder("Plane");
debugPlane.add(plane.rotation, "x", 0, 10, 0.1);

const light1Debug = gui.addFolder("pointLight1");
light1Debug.add(pointLight1.position, "x", -6, 6, 0.01);
light1Debug.add(pointLight1.position, "y", -3, 3, 0.01);
light1Debug.add(pointLight1.position, "z", -3, 3, 0.01);
light1Debug.add(pointLight1, "intensity", 0, 10, 0.1);

const light1Color = { color: 0xffffff };
light1Debug
  .addColor(light1Color, "color")
  .onChange(() => pointLight1.color.set(light1Color.color));

gui.close();

// size
const sizes = {
  width: window.innerWidth * (window.innerWidth < 1024 ? 1 : 0.7),
  height: window.innerHeight,
};

// Orbit Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 3);
scene.add(camera);

// renderer
const ren = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //makes the bg of the canvas transparent
});
ren.setSize(sizes.width, sizes.height);
ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//ren.setClearColor(new THREE.color(''), 1);

// Event Listeners
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth * (window.innerWidth < 1024 ? 1 : 0.7);
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  ren.setSize(sizes.width, sizes.height);
  ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let mouseY = 0;
window.addEventListener("mousemove", animateTerrain);

function animateTerrain(event) {
  mouseY = event.clientY;
}

// animation and interactions
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // update objects
  // torus.rotation.y = 0.5 * elapsedTime;
  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = 0.3 + mouseY * 0.0008;

  // Update Orbital Controls
  // controls.update()

  // Render
  ren.render(scene, camera);

  requestAnimationFrame(animate);
};
animate();
