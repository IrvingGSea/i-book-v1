const canvas = document.getElementById("i2cCanvas");
const ctx = canvas.getContext("2d");

const sclY = 50;
const sdaY = 150;
const bitWidth = 40;
const waveHeight = 20;

let transmission = [
  { scl: 1, sda: 1 }, // idle
  { scl: 1, sda: 0 }, // start condition
  { scl: 0, sda: 0 }, // prepare bit 1
  { scl: 1, sda: 0 }, // clock high bit 1
  { scl: 0, sda: 1 }, // prepare bit 2
  { scl: 1, sda: 1 }, // clock high bit 2
  { scl: 0, sda: 0 }, // prepare bit 3
  { scl: 1, sda: 0 }, // clock high bit 3
  { scl: 0, sda: 1 }, // prepare bit 4
  { scl: 1, sda: 1 }, // clock high bit 4
  { scl: 0, sda: 0 }, // prepare bit 5
  { scl: 1, sda: 0 }, // clock high bit 5
  { scl: 1, sda: 1 }  // stop condition
];

function drawSquareWave() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "14px Arial";
  ctx.fillText("SCL", 10, sclY);
  ctx.fillText("SDA", 10, sdaY);

  let x = 50;
  for (let i = 0; i < transmission.length - 1; i++) {
    let curr = transmission[i];
    let next = transmission[i + 1];

    // Draw SCL
    ctx.beginPath();
    ctx.moveTo(x, sclY + (curr.scl ? -waveHeight : 0));
    ctx.lineTo(x + bitWidth, sclY + (next.scl ? -waveHeight : 0));
    ctx.strokeStyle = "blue";
    ctx.stroke();

    // Draw SDA
    ctx.beginPath();
    ctx.moveTo(x, sdaY + (curr.sda ? -waveHeight : 0));
    ctx.lineTo(x + bitWidth, sdaY + (next.sda ? -waveHeight : 0));
    ctx.strokeStyle = "green";
    ctx.stroke();

    x += bitWidth;
  }
}

function startSimulation() {
  drawSquareWave();
}
