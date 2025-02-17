let clickCount = 0;

const playerClickCountElem = document.getElementById('playerClickCount');
const clickZone = document.getElementById('clickZone');

function clickEvent(event) {
    clickCount++
    playerClickCountElem.textContent = clickCount;
    saveClickCount();

    // Create particle element
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = '+1';
    document.body.appendChild(particle);

    // Position the particle at the click location
    particle.style.left = `${event.clientX - 30}px`;
    particle.style.top = `${event.clientY - 70}px`;

    // Remove the particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

clickZone.addEventListener('click', (event) => {
    clickEvent(event);
});

function saveClickCount() {
    setCookie('clickCount', clickCount, 7);
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

function loadClickCount() {
    const savedCount = getCookie('clickCount');
    if (savedCount) {
        clickCount = parseInt(savedCount);
        playerClickCountElem.textContent = clickCount;
    }
}

window.onload = () => {
    loadClickCount();
};