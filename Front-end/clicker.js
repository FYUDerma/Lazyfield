let clickCount = 0;
let clickMultiplier = 1;
let totalPassiveClicksPerSecond = 0;
let passiveClickInterval = null;

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
    
    // Only set up the interval if it doesn't exist yet
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

window.onload = () => {
    loadProgression();
    displayUpgrades();
};