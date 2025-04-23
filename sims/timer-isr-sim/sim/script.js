
let tmr1 = 0;
let timer = null;
let matchCount = 0;

function updateDisplay() {
    document.getElementById("tmr1").textContent = tmr1;
}

function updateIndicator() {
    const indicator = document.getElementById("visual-indicator");
    const colors = ["red", "yellow", "green"];
    indicator.style.backgroundColor = colors[matchCount % colors.length];
}

function startTimer() {
    const pr1 = parseInt(document.getElementById("pr1").value);
    if (timer !== null) return;

    timer = setInterval(() => {
        tmr1++;
        updateDisplay();
        if (tmr1 === pr1) {
            matchCount++;
            updateIndicator();
            document.getElementById("interruptMsg").textContent = `⚡ Interrupt Triggered! Count: ${matchCount}`;
            tmr1 = 0;
        } else {
            document.getElementById("interruptMsg").textContent = "";
        }
    }, 500);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    tmr1 = 0;
    matchCount = 0;
    updateDisplay();
    stopTimer();
    document.getElementById("visual-indicator").style.backgroundColor = "#eee";
    document.getElementById("interruptMsg").textContent = "";
}

updateDisplay();
