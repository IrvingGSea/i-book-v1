
let samples = [];
let samplingRate = 10;
let quantizationLevels = 256;
let lastSampleTime = 0;

function setup() {
  createCanvas(700, 450);
  frameRate(60);

  rateSlider = createSlider(1, 60, 10);
  rateSlider.position(20, height - 60);
  rateSlider.style('width', '300px');

  resolutionSlider = createSlider(2, 10, 8);
  resolutionSlider.position(370, height - 60);
  resolutionSlider.style('width', '300px');
}

function draw() {
  background(255);

  let time = millis() / 1000;
  let signal = sin(TWO_PI * 0.5 * time);

  stroke(0);
  noFill();
  beginShape();
  for (let x = 0; x < width; x++) {
    let t = map(x, 0, width, 0, 5);
    vertex(x, map(sin(TWO_PI * 0.5 * t), -1, 1, height*0.25, height*0.75));
  }
  endShape();

  // Handle sampling
  if (millis() - lastSampleTime > (1000 / samplingRate)) {
    let quantized = floor(map(signal, -1, 1, 0, quantizationLevels));
    samples.push({time: time, value: quantized});
    lastSampleTime = millis();
  }

  // Draw sampled points
  stroke(255, 0, 0);
  strokeWeight(6);
  noFill();
  for (let s of samples) {
    let x = map(s.time, time-5, time, 0, width);
    let val = map(s.value, 0, quantizationLevels-1, height*0.75, height*0.25);
    point(x, val);
  }

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("Sampling Rate: " + samplingRate + " Hz", 20, 30);
  text("Resolution: " + resolutionSlider.value() + "-bit (" + quantizationLevels + " levels)", 370, 30);

  // Update settings
  samplingRate = rateSlider.value();
  quantizationLevels = pow(2, resolutionSlider.value());

  // Clean old samples
  samples = samples.filter(s => (millis()/1000) - s.time <= 5);
}
