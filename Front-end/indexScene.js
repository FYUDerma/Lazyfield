import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const textureloader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );

// CAMERA
camera.position.y = 1;
camera.position.z = 4;
camera.lookAt(0, 0, 0);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.maxDistance = 5;
controls.minDistance = 3;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enablePan = false;
controls.enableDamping = true;
controls.addEventListener( "change", event => {
console.log( controls.object.position );
});

// SKYBOX
const skytexture = textureloader.load( './assets/sky/sky_clouds_09_2k.png', () => {
    skytexture.mapping = THREE.EquirectangularReflectionMapping;
    skytexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = skytexture;
});

// RENDERER
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// AMBIENT LIGHT
const skyColor = 0xB1E1FF;
const groundColor = 0xB97A20;
const intensity = 5;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

function animate() {
    renderer.render( scene, camera );
    controls.update();
};

// Clickable elements //

const notRegistered = document.getElementById('notRegistered');
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const cancelButton = document.getElementById('cancelButton');

notRegistered.addEventListener('click', () => {
    loginContainer.classList.toggle('hidden');
    registerContainer.classList.toggle('hidden');
});

cancelButton.addEventListener('click', () => {
    loginContainer.classList.toggle('hidden');
    registerContainer.classList.toggle('hidden');
});