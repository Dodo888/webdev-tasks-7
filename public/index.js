var satiety = localStorage.satiety || 50;
var energy = localStorage.energy || 50;
var mood = localStorage.mood || 50;

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

var hidden           = null;
var visibilityState  = null;
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

function checkDeath() {
    if ((energy == 0 && mood == 0) || (energy == 0 && satiety == 0) || (mood == 0 && satiety == 0)) {
        var gameOver = document.getElementById('game-over');
        gameOver.style.display = "block";
    }
}

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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

window.onunload = function() {
    localStorage.satiety = satiety;
    localStorage.energy = energy;
    localStorage.mood = mood;
};

if (navigator.getBattery) {
    setInterval(function () {
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
    }, 3000);
}

setInterval(function () {
    if (document[hidden]) {
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

if (SpeechRecognition) {
    setInterval(function () {
        mood = Math.max(0, mood - 1);
        checkDeath();
        moodBar.setAttribute('value', mood);
    }, 3000);
}