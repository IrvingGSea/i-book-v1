
let pulseStart = 0;
let pulseEnd = 0;
let capturing = false;
let captured = false;
let captureValue = 0;
let timer = 0;
let pulseActive = false;
let pulseDuration = 1000; // Default pulse width in milliseconds
let pulseSlider;

function setup() {
  createCanvas(700, 450);
  button = createButton('Start Pulse');
  button.position(20, height - 60);
  button.mousePressed(startPulse);

  pulseSlider = createSlider(200, 2000, 1000, 50);
  pulseSlider.position(150, height - 60);
  pulseSlider.style('width', '500px');

  textAlign(LEFT, CENTER);
  textSize(16);
}

function draw() {
  background(255);

  timer += deltaTime * 0.05;
  if (timer > 65535) timer = 0;

  fill(0);
  text("Timer: " + int(timer), 20, 30);
  text("Pulse Duration: " + pulseSlider.value() + " ms", 20, 60);

  if (captured) {
    text("Captured Timer Value: " + int(captureValue), 20, 90);
    text("Pulse Width: " + int(pulseEnd - pulseStart) + " timer ticks", 20, 120);
  }

  stroke(0);
  strokeWeight(2);
  let y = height/2;
  line(20, y + 40, width-20, y + 40);

  noStroke();
  fill(0, 150, 255);
  if (pulseActive) {
    rect(20, y, map(timer - pulseStart, 0, 200, 0, 300), 40);
  }

  if (captured) {
    stroke(255, 0, 0);
    line(20 + map(pulseStart, 0, 200, 0, 300), y, 20 + map(pulseStart, 0, 200, 0, 300), y+40);
  }
}

function startPulse() {
  pulseStart = timer;
  pulseActive = true;
  captured = false;
  pulseDuration = pulseSlider.value();
  setTimeout(() => {
    pulseEnd = timer;
    captureValue = pulseStart;
    pulseActive = false;
    captured = true;
  }, pulseDuration);
}
