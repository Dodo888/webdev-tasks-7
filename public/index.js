var satiety = 50;
var energy = 50;
var mood = 50;
try {
    satiety = localStorage.satiety || 50;
    energy = localStorage.energy || 50;
    mood = localStorage.mood || 50;

    window.onunload = function () {
        localStorage.satiety = satiety;
        localStorage.energy = energy;
        localStorage.mood = mood;
    };
} catch (error) {}

var satietyBar = document.getElementById('satiety');
satietyBar.setAttribute('value', satiety);
var energyBar = document.getElementById('energy');
energyBar.setAttribute('value', energy);
var moodBar = document.getElementById('mood');
moodBar.setAttribute('value', mood);

var isSleeping = false;
var isEating = false;
var isTalking = false;

var mouth = document.getElementById('pig-head__mouth');

var hidden = null;
var visibilityState = null;
var visibilityChange = null;

if ('hidden' in document) {
    hidden           = 'hidden';
    visibilityState  = 'visibilityState';
    visibilityChange = 'visibilitychange';
} else if ('mozHidden' in document) {
    hidden           = 'mozHidden';
    visibilityState  = 'mozVisibilityState';
    visibilityChange = 'mozvisibilitychange';
} else if ('webkitHidden' in document) {
    hidden           = 'webkitHidden';
    visibilityState  = 'webkitVisibilityState';
    visibilityChange = 'webkitvisibilitychange';
} else {
    var energyButton = document.createElement('input');
    energyButton.setAttribute('type', 'radio');
    energyButton.className = 'energy-button';
    document.body.appendChild(energyButton);
}

if (!navigator.getBattery) {
    var satietyButton = document.createElement('input');
    satietyButton.setAttribute('type', 'radio');
    satietyButton.className = 'satiety-button';
    document.body.appendChild(satietyButton);
}

var newGameButton = document.getElementById('new-game');
newGameButton.onclick = function () {
    satiety = 50;
    energy = 50;
    mood = 50;
    satietyBar.setAttribute('value', satiety);
    energyBar.setAttribute('value', energy);
    moodBar.setAttribute('value', mood);
    var gameOver = document.getElementById('game-over');
    gameOver.style.display = "none";
};

function isDead(energy, mood, satiety) {
    return (energy == 0 && mood == 0)
        || (energy == 0 && satiety == 0)
        || (mood == 0 && satiety == 0)
}

function checkDeath() {
    if (isDead(energy, mood, satiety)) {
        var gameOver = document.getElementById('game-over');
        gameOver.style.display = "block";
    }
}

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    var log = document.getElementById('speech-log');

    var recognizer = new SpeechRecognition();
    recognizer.lang = 'en-US';
    recognizer.continuous = true;
//recognizer.interimResults = true;

    log.onclick = function () {
        log.innerHTML = 'Recognition started';
        recognizer.start();
        mouth.fill = "black";
        isTalking = true;
    };

    recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();

        log.innerHTML = result;
        if (mood + 25 > 100) {
            recognizer.stop();
            mouth.fill = "none";
            log.innerHTML = 'You are the best friend!';
            isTalking = false;
        }
        mood = Math.min(100, mood + 25);
        if (result.toLowerCase() === 'goodbye') {
            log.innerHTML += '<br>Recognition stopped';
            recognizer.stop();
            mouth.fill = "none";
            isTalking = false;
        }
        moodBar.setAttribute('value', mood);
    };
} else {
    var moodButton = document.createElement('input');
    moodButton.setAttribute('type', 'button');
    moodButton.className = 'mood-button';
    moodButton.setAttribute('value', 'Click to say');
    moodButton.addEventListener('click', function () {
        mood = Math.min(100, mood + 25);
    });
    document.body.appendChild(moodButton);
}

setInterval(function () {
    mood = Math.max(0, mood - 1);
    checkDeath();
    moodBar.setAttribute('value', mood);
}, 3000);

setInterval(function () {
    if (navigator.getBattery) {
        navigator.getBattery().then(function (battery) {
            if (battery.charging && !isSleeping) {
                isEating = true;
                satiety = Math.min(100, satiety + 3);
            } else {
                isEating = false;
                satiety = Math.max(0, satiety - 1);
                checkDeath();
            }
        });
        satietyBar.setAttribute('value', satiety);
    } else {
        var satietyButton = document.getElementsByClassName('satiety-button');
        if (satietyButton[0] && satietyButton[0].checked) {
            isEating = true;
            satiety = Math.min(100, satiety + 3);
        } else {
            isEating = false;
            satiety = Math.max(0, satiety - 1);
            checkDeath();
        }
    }
}, 3000);

setInterval(function () {
    var energyButton = document.getElementsByClassName('energy-button');
    if (document[hidden] || (energyButton[0] && energyButton[0].checked)) {
        if (isTalking) {
            recognizer.Stop();
            mouth.fill = "none";
            isTalking = false;
            log.innerHTML = 'Click to talk with me';
        }
        isSleeping = true;
        energy = Math.min(100, energy + 3);
    } else {
        isSleeping = false;
        energy= Math.max(0, energy - 1);
        checkDeath();
    }
    energyBar.setAttribute('value', energy);
}, 3000);