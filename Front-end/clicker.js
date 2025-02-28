let clickCount = 0;
let clickMultiplier = 1;

const playerClickCountElem = document.getElementById('playerClickCount');
const clickZone = document.getElementById('clickZone');
const menuButton = document.getElementById('menuButton');
const menuBox = document.getElementById('menuBox');
const upgradesButton = document.getElementById('upgradesButton');
const upgradesMenu = document.getElementById('upgradesMenu');
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

clickZone.addEventListener('click', (event) => {
    clickEvent(event);
});

function saveProgression() {
    setCookie('clickCount', clickCount, 7);
    setCookie('clickMultiplier', clickMultiplier, 7);
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
    const savedUpgrades = getCookie('upgrades');
    if (savedUpgrades) {
        upgrades = JSON.parse(savedUpgrades);
        displayUpgrades();
    }
}

let upgrades = [
    { name: 'Double Clicks', cost: 10, effect: () => clickMultiplier *= 2 },
    { name: 'Triple Clicks', cost: 50, effect: () => clickMultiplier *= 3 },
];

function displayUpgrades() {
    const upgradeList = document.getElementById('upgradeList');
    upgradeList.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const li = document.createElement('li');
        li.textContent = `${upgrade.name} - Cost: ${upgrade.cost} carrots`;
        li.addEventListener('click', () => purchaseUpgrade(index));
        upgradeList.appendChild(li);
    });
}
function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    if (clickCount >= upgrade.cost) {
        clickCount -= upgrade.cost;
        upgrade.effect();
        upgrades.splice(index, 1); // Remove the purchased upgrade
        displayUpgrades();
        playerClickCountElem.textContent = clickCount;
        saveClickCount();
    } else {
        alert('Not enough carrots!');
    }
}

function resetProgression() {
    clickCount = 0;
    clickMultiplier = 1;
    upgrades = [
        { name: 'Double Clicks', cost: 10, effect: () => clickMultiplier *= 2 },
        { name: 'Quadruple Clicks', cost: 50, effect: () => clickMultiplier *= 2 },
        { name: 'Octo Clicks', cost: 500, effect: () => clickMultiplier *= 2 },
    ];
    playerClickCountElem.textContent = clickCount;
    displayUpgrades();
    saveProgression();
}

window.onload = () => {
    loadProgression();
    displayUpgrades();
};
