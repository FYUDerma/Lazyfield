let clickCount = 0;
let clickMultiplier = 1;
let totalPassiveClicksPerSecond = 0;
let passiveClickInterval = null;

import { saveProgressionToDB, loadProgressionFromDB } from './public/Javascript/progression.js';

const playerClickCountElem = document.getElementById('playerClickCount');
const clickZone = document.getElementById('clickZone');
const menuButton = document.getElementById('menuButton');
const menuBox = document.getElementById('menuBox');
const upgradesButton = document.getElementById('upgradesButton');
const upgradesMenu = document.getElementById('upgradesMenu');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const resetButton = document.getElementById('resetButton');

menuButton.addEventListener('click', () => {
    menuBox.classList.toggle('hidden');
});
upgradesButton.addEventListener('click', () => {
    upgradesMenu.classList.toggle('hidden')
});
resetButton.addEventListener('click', () => {
    resetProgression();
});

saveButton.addEventListener('click', () => {
    const serializableUpgrades = upgrades.map((upgrade) => ({
        name: upgrade.name,
        cost: upgrade.cost,
        purchased: upgrade.purchased,
        multiplier: upgrade.multiplier,
        multiple: upgrade.multiple,
    }));
    saveProgressionToDB(clickCount, serializableUpgrades, clickMultiplier);
});

loadButton.addEventListener('click', async () => {
    const gameState = await loadProgressionFromDB();
    applyLoadedProgression(gameState);
});

export function applyLoadedProgression(gameState) {
    if (!gameState) return;

    // Update click count
    clickCount = gameState.clicks || 0;
    playerClickCountElem.textContent = clickCount;

    // Update click multiplier
    clickMultiplier = gameState.clickMultiplier || 1;

    // Update upgrades
    if (gameState.upgrades) {
        upgrades = gameState.upgrades.map(savedUpgrade => {
            const baseUpgrade = baseUpgrades.find(base => base.name === savedUpgrade.name);
            if (baseUpgrade) {
                return {
                    ...baseUpgrade,
                    purchased: savedUpgrade.purchased || 0,
                    multiplier: savedUpgrade.multiplier || baseUpgrade.multiplier,
                };
            }
            return savedUpgrade;
        });
    }

    // Restore passive click rate
    totalPassiveClicksPerSecond = gameState.totalPassiveClicksPerSecond || 0;
    if (totalPassiveClicksPerSecond > 0) {
        startPassiveClicks(0);
    }
    
    // Apply purchased passive upgrades again
    for (const upgrade of upgrades) {
        if (upgrade.purchased > 0 && upgrade.effect) {
            for (let i = 0; i < upgrade.purchased; i++) {
                upgrade.effect();
            }
        }
    }
    
    // Update UI
    displayUpgrades();
    renderminicarrot();
}

const baseUpgrades = [
    { name: 'Mini Carrot', cost: 100, effect: () => startPassiveClicks(1), purchased: 0, multiple: true },
    { name: 'Garden', cost: 1000, effect: () => startPassiveClicks(10), purchased: 0, multiple: true },
    { name: 'Double Clicks', cost: 10, effect: () => clickMultiplier *= 2, purchased: 0, multiple: false },
    { name: 'Quadruple Clicks', cost: 50, effect: () => clickMultiplier *= 2, purchased: 0, multiple: false },
    { name: 'Octo Clicks', cost: 500, effect: () => clickMultiplier *= 2, purchased: 0, multiple: false },
];

let upgrades = JSON.parse(JSON.stringify(baseUpgrades));

function clickEvent(event) {
    clickCount += clickMultiplier;
    playerClickCountElem.textContent = clickCount;
    saveProgression();
// particle effect
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = `+${clickMultiplier}`;
    document.body.appendChild(particle);

    particle.style.left = `${event.clientX - 30}px`;
    particle.style.top = `${event.clientY - 70}px`;

    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

function startPassiveClicks(amount) {
    totalPassiveClicksPerSecond += amount;
    
    if (passiveClickInterval === null) {
        passiveClickInterval = setInterval(() => {
            if (totalPassiveClicksPerSecond > 0) {
                clickCount += totalPassiveClicksPerSecond;
                playerClickCountElem.textContent = clickCount;
                saveProgression();
            }
        }, 1000);
    }
}

clickZone.addEventListener('click', (event) => {
    clickEvent(event);
});

function saveProgression() {
    setCookie('clickCount', clickCount, 7);
    setCookie('clickMultiplier', clickMultiplier, 7);
    setCookie('totalPassiveClicksPerSecond', totalPassiveClicksPerSecond, 7);  
    setCookie('upgrades', JSON.stringify(upgrades), 7);
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function loadProgression() {
    const savedCount = getCookie('clickCount');
    if (savedCount) {
        clickCount = parseInt(savedCount);
        playerClickCountElem.textContent = clickCount;
    }
    
    const savedMultiplier = getCookie('clickMultiplier');
    if (savedMultiplier) {
        clickMultiplier = parseInt(savedMultiplier);
    }
    
    const savedPassiveClicks = getCookie('totalPassiveClicksPerSecond');
    if (savedPassiveClicks) {
        totalPassiveClicksPerSecond = parseInt(savedPassiveClicks);
        if (totalPassiveClicksPerSecond > 0 && passiveClickInterval === null) {
            startPassiveClicks(0); // Start the interval without adding more clicks
        }
    }
    
    const savedUpgrades = getCookie('upgrades');
    if (savedUpgrades) {
        const parsedUpgrades = JSON.parse(savedUpgrades);
        
        upgrades = parsedUpgrades.map((savedUpgrade) => {
            const baseUpgrade = baseUpgrades.find(base => base.name === savedUpgrade.name);
            if (baseUpgrade) {
                return {
                    ...savedUpgrade,
                    effect: baseUpgrade.effect
                };
            }
            return savedUpgrade;
        });
        
        displayUpgrades();
    }
}

function displayUpgrades() {
    const upgradeList = document.getElementById('upgradeList');
    upgradeList.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const li = document.createElement('li');
        li.textContent = `${upgrade.name} - Cost: ${upgrade.cost} carrots${upgrade.multiple ? ` (Purchased: ${upgrade.purchased})` : ''}`;
        li.addEventListener('click', () => purchaseUpgrade(index));
        upgradeList.appendChild(li);
    });
}

function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    if (clickCount >= upgrade.cost) {
        clickCount -= upgrade.cost;
        upgrade.effect();
        if (upgrade.multiple) {
            upgrade.purchased += 1;
            renderminicarrot();
        } else {
            upgrades.splice(index, 1);
        }
        playerClickCountElem.textContent = clickCount;
        saveProgression();
        displayUpgrades();
    } else {
        alert('Not enough carrots!');
    }
}

function resetProgression() {
    clickCount = 0;
    clickMultiplier = 1;
    totalPassiveClicksPerSecond = 0;
    
    if (passiveClickInterval !== null) {
        clearInterval(passiveClickInterval);
        passiveClickInterval = null;
    }
    
    upgrades = JSON.parse(JSON.stringify(baseUpgrades));
    
    playerClickCountElem.textContent = clickCount;
    displayUpgrades();
    saveProgression();
}

function checkForMidnightAutoSave() {
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            saveProgressionToDB(clickCount, upgrades);
            console.log("Auto-saved progression at midnight!");
        }
    }, 60000);
}

checkForMidnightAutoSave();

window.onload = async () => {
    await loadProgressionFromDB();
    loadProgression();
    displayUpgrades();
    renderminicarrot();
};


//
//
//
//
//
//
//

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const modelloader = new GLTFLoader();
const textureloader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
const clock = new THREE.Clock();

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

// HELP GRID
//scene.add(new THREE.GridHelper(10, 10));

//3D MODELS
modelloader.load('./assets/models/carrot.glb', function(model) {
    var carrot = model.scene.children[0];
    carrot.scale.set(3,3,3)
    scene.add (model.scene);
    function animate() {
        requestAnimationFrame(animate);
        carrot.rotation.y += 0.005; // change rota speed here
        renderer.render(scene, camera);
    }

    animate();
}, undefined, function(error) {
    console.error(error);
});

await loadProgression();
var miniCarrots = []
function renderminicarrot() {
    var miniCarrotUpgrade = upgrades[0];
    var miniCarrotsNumber = miniCarrotUpgrade.purchased;
    for (let index = 0; index <= miniCarrotsNumber - miniCarrots.length - 1; index++) {
        modelloader.load('./assets/models/miniCarrot.glb', function(model) {
            var miniCarrot = model.scene.children[0];
            console.log(typeof miniCarrot)
            miniCarrot.scale.set(1,1,1)
            scene.add (model.scene);
            miniCarrots.push(miniCarrot);
        })
    }
    for (let index = 0; index < miniCarrots.length; index++) {
        const element = miniCarrots[index];
        element.rotation.y = 0.02;
    }
};
    function animateminicarrots(clock) {
        const radius = 2;
        let number = radius / upgrades[0].purchased;
        for (let index = 0; index < miniCarrots.length; index++) {
            const miniCarrot = miniCarrots[index];
            var time = clock.getElapsedTime() * 0.1 * Math.PI;
            miniCarrot.position.set(
                Math.sin(time + Math.PI * number * index) * radius,
                Math.sin(time * 2 + index * 0.5) * 0.1,
                Math.cos(time + Math.PI * number * index) * radius
            )
            miniCarrot.rotation.y += 0.02;
        }
        
    }
// grass block
modelloader.load('./assets/models/block-grass-low-large.glb', function(model) {
    var grassBlock = model.scene.children[0];
    grassBlock.scale.set(1.5,1,1.5)
    grassBlock.position.set(0,-1.5,0)
    scene.add (model.scene);
    animate();
}, undefined, function(error) {
    console.error(error);
});


function animate() {
    animateminicarrots(clock);
    renderer.render( scene, camera );
    controls.update();
};

console.log(upgrades)
