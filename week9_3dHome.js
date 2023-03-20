class Color {
  constructor(_r, _g, _b) {
    this.r = _r;
    this.g = _g;
    this.b = _b;
  }
}

let canvas;
let gui;
let color;

let displayState = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  createEasyCam();

  color = new Color(255, 0, 0);

  //dat Gui expects an object 1st param, the property name to affect 2nd param, and slider range 3rd & 4th params
  gui = new dat.GUI();
  gui.add(color, 'r', 0, 255);
  gui.add(color, 'g', 0, 255);
  gui.add(color, 'b', 0, 255);

  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
}

function draw() {
  background(200, 200, 250);
  //image(capture,-width/2, -height/2);
  noStroke();
  lights();
  ambientMaterial(color.r, color.g, color.b);
  ambientLight(150+sin(frameCount*0.01)*100);
  capture.loadPixels();
  const stepSize = round(constrain(mouseX / 8, 6, 32));
  push();
  translate(-width/2, -height/2);
  for (let y = 0; y < height; y += stepSize) {
    for (let x = 0; x < width; x += stepSize) {
      const i = y * width + x;
      const darkness = (255 - capture.pixels[i * 4]) / 255;
      const radius = stepSize * darkness;
      ellipse(x, y, radius, radius);
      push();
      translate(x, y);
      fill(capture.pixels[i * 4], capture.pixels[i * 4+1], capture.pixels[i * 4+2]);
      rotateZ(darkness*TWO_PI);
      //rotateY(darkness*TWO_PI);
      box(stepSize-2,stepSize-2,radius*20);
      pop();
    }
  }
  pop();
}

function keyPressed() {
  switch (key) {
  case 'd':
    dat.GUI.toggleHide();//show / hide for performance mode
    break;
  case 'f':
    let fs = fullscreen();
    fullscreen(!fs);
    break;
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
