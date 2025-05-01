
const canvas = document.getElementById("i2cCanvas");
const ctx = canvas.getContext("2d");

function drawLine(x1, y1, x2, y2, color="black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawText(text, x, y) {
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(text, x, y);
}

function drawSquareWave(x, y, bits, bitWidth, height, label) {
    drawText(label, x - 30, y + 5);
    let currentX = x;
    let currentY = y;
    let up = true;

    for (let i = 0; i < bits.length; i++) {
        const bit = bits[i];
        const nextY = bit === 1 ? y - height : y;

        if (currentY !== nextY) {
            drawLine(currentX, currentY, currentX, nextY);
            currentY = nextY;
        }

        drawLine(currentX, currentY, currentX + bitWidth, currentY);
        currentX += bitWidth;
    }

    drawLine(currentX, currentY, currentX, y + height + 10);
}

function startTransmission() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bitWidth = 40;
    const height = 20;
    const scl = [1,0,1,0,1,0,1,0,1,0]; // SCL pulses
    const sda = [1,1,0,0,1,1,0,0,1,1]; // SDA data (stable during SCL low)

    drawSquareWave(100, 80, scl, bitWidth, height, "SCL");
    drawSquareWave(100, 150, sda, bitWidth, height, "SDA");

    drawText("Start", 95, 190);
    drawText("Addr", 180, 190);
    drawText("ACK", 300, 190);
    drawText("Data", 420, 190);
}
