let dutySlider;
let duty = 50;

function setup() {
  createCanvas(700, 400);
  dutySlider = createSlider(0, 100, 50);
  dutySlider.position(20, height - 30);
  dutySlider.style('width', '660px');
}

function draw() {
  background(255);
  duty = dutySlider.value();

  // Draw labels
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Duty Cycle: " + duty + "%", 20, 30);

  // Draw waveform
  let waveHeight = 100;
  let period = 100;  // pixels per period
  let high = period * (duty / 100);
  let yStart = 60;
  stroke(0);
  noFill();
  beginShape();
  for (let x = 20; x < width - 20; x += period) {
    vertex(x, yStart + waveHeight);
    vertex(x, yStart);
    vertex(x + high, yStart);
    vertex(x + high, yStart + waveHeight);
    vertex(x + period, yStart + waveHeight);
  }
  endShape();

  // Simulate LED brightness
  fill(255, 200, 0, map(duty, 0, 100, 50, 255));
  stroke(0);
  ellipse(width/2, 300, 80, 80);
  fill(0);
  textAlign(CENTER);
  text("LED", width/2, 300 + 5);
}
