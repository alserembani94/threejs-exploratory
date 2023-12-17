import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Debug
const gui = new GUI();
const debugObject = {
  rotateTorus: true,
  rotateTorus2: true,
};


// Cursor info
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -1 * (event.clientY / sizes.height - 0.5);
});

// get canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene()

// Object
debugObject.color = 0x311717;

// Cube
const geometry = new THREE.BoxGeometry(4, 0.01, 4)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = -1.2;
scene.add(mesh)

const cubeTweak = gui.addFolder('Cube');

cubeTweak.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
cubeTweak.add(mesh, 'visible').setValue(false).name('visible');
cubeTweak.add(material, 'wireframe');
cubeTweak.addColor(debugObject, 'color').onChange(() => {
  material.color.set(debugObject.color);
});

debugObject.subdivision = 2;

cubeTweak.add(debugObject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
  mesh.geometry.dispose();
  const subdividedGeometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    debugObject.subdivision,
    debugObject.subdivision,
    debugObject.subdivision
  );
  mesh.geometry = subdividedGeometry;
});

debugObject.spin = () => {
  controls.autoRotate = !controls.autoRotate;
}
cubeTweak.add(debugObject, 'spin');

// Torus 1
debugObject.torusColor = 0xff00ff;
const torus1Material = new THREE.MeshBasicMaterial({ color: debugObject.torusColor, wireframe: true });
const torus1 = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 16, 32),
  torus1Material
);
scene.add(torus1);

const torus1Tweak = gui.addFolder('Torus 1');

torus1Tweak.add(torus1.position, 'y').min(-3).max(3).step(0.01).name('elevation');
torus1Tweak.add(torus1, 'visible');
torus1Tweak.add(torus1.material, 'wireframe');
torus1Tweak.addColor(debugObject, 'torusColor').onChange(() => {
  torus1Material.color.set(debugObject.torusColor);
}).name('color');
debugObject.torus1Spin = () => {
  debugObject.rotateTorus = !debugObject.rotateTorus;
};
torus1Tweak.add(debugObject, 'torus1Spin');

debugObject.torus2Color = 0x00ff00;
const torus2 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.2, 16, 32),
  new THREE.MeshBasicMaterial({ color: debugObject.torus2Color, wireframe: true })
);
scene.add(torus2);

const torus2Tweak = gui.addFolder('Torus 2');

torus2Tweak.add(torus2.position, 'y').min(-3).max(3).step(0.01).name('elevation');
torus2Tweak.add(torus2, 'visible');
torus2Tweak.add(torus2.material, 'wireframe');
torus2Tweak.addColor(debugObject, 'torus2Color').onChange(() => {
  torus2.material.color.set(debugObject.torus2Color);
}).name('color');
debugObject.torus2Spin = () => {
  debugObject.rotateTorus2 = !debugObject.rotateTorus2;
};
torus2Tweak.add(debugObject, 'torus2Spin');


// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () =>
{
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!fullscreenElement)
  {
    if(canvas.requestFullscreen)
    {
      canvas.requestFullscreen()
    }
    else if(canvas.webkitRequestFullscreen)
    {
      canvas.webkitRequestFullscreen()
    }
  }
  else
  {
    if(document.exitFullscreen)
    {
      document.exitFullscreen()
    }
    else if(document.webkitExitFullscreen)
    {
      document.webkitExitFullscreen()
    }
  }
})

// const aspectRatio = sizes.width / sizes.height;

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1
// );
camera.position.z = 3
camera.position.y = 2
camera.position.x = 2
// camera.rotateX(-0.5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotateSpeed = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Clock
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // Update objects
  torus1.rotation.x = debugObject.rotateTorus ? elapsedTime * 2 : 0;
  torus2.rotation.y = debugObject.rotateTorus2 ? elapsedTime * 2 : 0;

  // Update camera
  // camera.position.x = cursor.x * 3;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick();