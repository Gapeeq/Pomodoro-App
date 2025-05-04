const timeDisplay = document.querySelector('.time-display');
const timerLabel = document.querySelector('.timer-label');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const speedBtn = document.getElementById('speedBtn');
const modeToggle = document.getElementById('modeToggle');
const modeLabel = document.querySelector('.mode-label');

// Audio elements
const startSound = document.getElementById('startSound');
const warningSound = document.getElementById('warningSound');
const tickSound = document.getElementById('tickSound');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;
let hasPlayedWarning = false;
let isSpeedMode = false;
let isTestMode = true;
const NORMAL_INTERVAL = 1000; // 1 second
const SPEED_INTERVAL = NORMAL_INTERVAL / 60; // 60x faster

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    stopTimer();
    isWorkTime = true;
    timeLeft = 25 * 60;
    timerLabel.textContent = 'Work Time';
    hasPlayedWarning = false;
    isSpeedMode = false;
    speedBtn.textContent = 'Speed (60x)';
    updateDisplay();
}

function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
}

function toggleSpeed() {
    if (timerId === null) return;
    
    isSpeedMode = !isSpeedMode;
    speedBtn.textContent = isSpeedMode ? 'Normal Speed' : 'Speed (60x)';
    
    // Clear the current interval
    clearInterval(timerId);
    
    // Start a new interval with the appropriate speed
    const interval = isSpeedMode ? SPEED_INTERVAL : NORMAL_INTERVAL;
    timerId = setInterval(timerTick, interval);
}

function timerTick() {
    timeLeft--;
    updateDisplay();
    
    // Play tick sound in last 10 seconds
    if (timeLeft <= 10 && timeLeft > 0) {
        playSound(tickSound);
    }
    
    // Play warning sound at 10 seconds
    if (timeLeft === 10 && !hasPlayedWarning) {
        playSound(warningSound);
        hasPlayedWarning = true;
    }
    
    if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        
        if (isWorkTime) {
            // Switch to break time
            timeLeft = 5 * 60; // 5 minutes break
            timerLabel.textContent = 'Break Time';
            isWorkTime = false;
        } else {
            // Switch to work time
            timeLeft = 25 * 60; // 25 minutes work
            timerLabel.textContent = 'Work Time';
            isWorkTime = true;
        }
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = false;
        speedBtn.disabled = true;
        updateDisplay();
    }
}

function startTimer() {
    if (timerId !== null) return;
    
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
    speedBtn.disabled = false;
    hasPlayedWarning = false;
    isSpeedMode = false;
    speedBtn.textContent = 'Speed (60x)';
    
    // Play start sound
    playSound(startSound);
    
    timerId = setInterval(timerTick, NORMAL_INTERVAL);
}

function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
    speedBtn.disabled = true;
}

function toggleMode() {
    isTestMode = !isTestMode;
    modeLabel.textContent = isTestMode ? 'Test Mode' : 'Live Mode';
    speedBtn.style.display = isTestMode ? 'block' : 'none';
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
speedBtn.addEventListener('click', toggleSpeed);
modeToggle.addEventListener('change', toggleMode);

// Initialize the display
updateDisplay();
stopBtn.disabled = true;
resetBtn.disabled = true;
speedBtn.disabled = true; 