let codeLines = ["MOV #5, W0", "LOOP:", "DEC W0", "CP W0, #0", "BNE LOOP", "; ... more code"];
let pc = 0;
let w0 = 5;
let loopCount = 0;

function updateDisplay() {
    for (let i = 0; i < codeLines.length; i++) {
        document.getElementById("line" + i).classList.remove("highlight");
    }
    if (pc < codeLines.length) {
        document.getElementById("line" + pc).classList.add("highlight");
    } else {
        document.getElementById("line5").classList.add("highlight");
    }

    document.getElementById("w0").innerText = w0;
    document.getElementById("loopCount").innerText = loopCount;
}

function runStep() {
    let statusBox = document.getElementById("statusBox");

    if (pc >= codeLines.length) {
        statusBox.textContent = "End of program.";
        statusBox.className = "status-done";
        updateDisplay();
        return;
    }

    switch (pc) {
        case 0: // MOV #5, W0
            w0 = 5;
            pc++;
            break;
        case 1: // LOOP:
            pc++;
            break;
        case 2: // DEC W0
            w0--;
            loopCount++;
            pc++;
            break;
        case 3: // CP W0, #0
            pc++;
            break;
        case 4: // BNE LOOP
            if (w0 !== 0) {
                pc = 1;
                statusBox.textContent = "Branch taken → LOOP";
                statusBox.className = "status-branch";
            } else {
                pc = 5;
                statusBox.textContent = "Loop complete";
                statusBox.className = "status-done";
            }
            break;
        case 5: // Final comment line
            pc++;
            break;
        default:
            pc++;
    }

    updateDisplay();
}

function reset() {
    pc = 0;
    w0 = 5;
    loopCount = 0;
    document.getElementById("statusBox").textContent = "Reset complete";
    document.getElementById("statusBox").className = "";
    updateDisplay();
}

window.onload = updateDisplay;
