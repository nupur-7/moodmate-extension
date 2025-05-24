const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Life is what happens when you're busy making other plans.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, so don't waste it living someone else's life.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    "When you reach the end of your rope, tie a knot in it and hang on.",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn."
];

const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.querySelector('.timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const resetBtn = document.getElementById('resetBtn');
const resultOverlay = document.getElementById('resultOverlay');
const finalWpmElement = document.getElementById('finalWpm');
const finalAccuracyElement = document.getElementById('finalAccuracy');
const timeTakenElement = document.getElementById('timeTaken');
const tryAgainBtn = document.getElementById('tryAgainBtn');

let timer = null;
let timeLeft = 60;
let isTimerRunning = false;
let startTime;
let correctChars = 0;
let totalChars = 0;
let currentQuote = '';

//Initialize the game
renderNewQuote();

function renderNewQuote() {
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplayElement.innerHTML = '';
    
    //Create a span for each character in the quote
    currentQuote.split('').forEach(char => {
    const charSpan = document.createElement('span');
    charSpan.innerText = char;
    quoteDisplayElement.appendChild(charSpan);
    });
    
    quoteInputElement.value = '';
    resetTimer();
    resetStats();
}

function startTimer() {
    if (!isTimerRunning) {
    isTimerRunning = true;
    startTime = new Date();
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft + 's';
        
        if (timeLeft <= 0) {
        endTest();
        }
    }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    timeLeft = 60;
    timerElement.innerText = timeLeft + 's';
}

function resetStats() {
    correctChars = 0;
    totalChars = 0;
    wpmElement.innerText = '0';
    accuracyElement.innerText = '0%';
}

function calculateWPM() {
    if (!startTime) return 0;
    
    const timeElapsed = (new Date() - startTime) / 1000 / 60; //in minutes
    const words = correctChars / 5; //average word length is 5 characters
    return Math.round(words / timeElapsed);
}

function calculateAccuracy() {
    if (totalChars === 0) return 0;
    return Math.round((correctChars / totalChars) * 100);
}

function endTest() {
    clearInterval(timer);
    isTimerRunning = false;
    quoteInputElement.disabled = true;
    
    const finalWpm = calculateWPM();
    const finalAccuracy = calculateAccuracy();
    const timeTaken = Math.round((new Date() - startTime) / 1000);
    
    // Display results
    finalWpmElement.innerText = finalWpm;
    finalAccuracyElement.innerText = finalAccuracy + '%';
    timeTakenElement.innerText = timeTaken + 's';
    
    resultOverlay.style.display = 'flex';
}

quoteInputElement.addEventListener('input', () => {
    if (!isTimerRunning && quoteInputElement.value.length > 0) {
    startTimer();
    }
    
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    
    let correct = true;
    totalChars = arrayValue.length;
    correctChars = 0;
    
    arrayQuote.forEach((charSpan, index) => {
    const character = arrayValue[index];
    
    charSpan.classList.remove('correct', 'incorrect', 'current');
    
    if (character == null) {
        correct = false;
        charSpan.classList.remove('correct', 'incorrect');
        if (index === arrayValue.length) {
        charSpan.classList.add('current');
        }
    } else if (character === charSpan.innerText) {
        charSpan.classList.add('correct');
        correctChars++;
    } else {
        charSpan.classList.add('incorrect');
        correct = false;
    }
    });
    
    wpmElement.innerText = calculateWPM();
    accuracyElement.innerText = calculateAccuracy() + '%';
    
    if (arrayValue.length === arrayQuote.length && correct) {
    endTest();
    }
});

newQuoteBtn.addEventListener('click', renderNewQuote);

resetBtn.addEventListener('click', () => {
    renderNewQuote();
    quoteInputElement.disabled = false;
});

tryAgainBtn.addEventListener('click', () => {
    resultOverlay.style.display = 'none';
    renderNewQuote();
    quoteInputElement.disabled = false;
    quoteInputElement.focus();
});