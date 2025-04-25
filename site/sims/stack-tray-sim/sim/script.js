
const canvas = document.getElementById("stackCanvas");
const ctx = canvas.getContext("2d");

let stack = [];

function drawStack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText("Call Stack (Top = Most Recent)", 20, 30);

    const trayHeight = 40;
    const trayWidth = 300;
    const spacing = 10;
    const baseY = 60;
    const maxTrays = 10;

    for (let i = 0; i < stack.length; i++) {
        let y = baseY + (trayHeight + spacing) * (stack.length - i - 1);
        ctx.fillStyle = "#cce0f7";
        ctx.fillRect(50, y, trayWidth, trayHeight);
        ctx.strokeStyle = "#0077cc";
        ctx.strokeRect(50, y, trayWidth, trayHeight);

        ctx.fillStyle = "#000";
        ctx.fillText(stack[i], 60, y + 25);
    }
}

function callFunction() {
    stack.push("Function Call " + (stack.length + 1));
    drawStack();
}

function returnFunction() {
    if (stack.length > 0) {
        stack.pop();
    }
    drawStack();
}

function resetStack() {
    stack = [];
    drawStack();
}

drawStack();
