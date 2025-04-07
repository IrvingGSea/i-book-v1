let amplitudeSlider;

function setup() {
  createCanvas(676, 400);

  // Create a slider for amplitude
  amplitudeSlider = createSlider(10, 200, 100);
  amplitudeSlider.position(10, height + 10);
}

function draw() {
  background('aliceblue');
  stroke(0);
  noFill();

  let amp = amplitudeSlider.value();

  beginShape();
  for (let x = 0; x < width; x++) {
    let y = height / 2 + amp * sin(x * 0.05);
    vertex(x, y);
  }
  endShape();
}
