function simulateUART() {
    const canvas = document.getElementById("uart-canvas");
    const ctx = canvas.getContext("2d");
    const input = document.getElementById("uart-input").value;

    if (!/^[01]{8}$/.test(input)) {
        alert("Please enter exactly 8 bits (e.g., 10101010)");
        return;
    }

    const bits = ["Start", ...input.split(""), "Stop"];
    const levels = [0, ...input.split("").map(b => parseInt(b)), 1];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bitWidth = 80;
    const high = 50;
    const low = 150;
    let x = 10;

    for (let i = 0; i < levels.length; i++) {
        const y = levels[i] === 1 ? high : low;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + bitWidth, y);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillText(bits[i], x + 20, y - 10);
        x += bitWidth;
    }
}
