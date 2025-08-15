// generated using Gemini
// prompt: write a p5js sketch that draws a painting in the abstract and colorful style of Wassily Kandinsky. Add animation. Give the just the javascript.

function setup() {
  createCanvas(800, 800);
  background(255);
  noLoop();
}

function draw() {
  // Set up a colorful, abstract background
  drawAbstractBackground();

  // Draw Kandinsky-like elements with animation
  let numShapes = 10;
  for (let i = 0; i < numShapes; i++) {
    drawKandinskyShape(i * 100);
  }
}

function drawAbstractBackground() {
  // Use a series of transparent, large shapes and gradients
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(200, 400);
    let c = color(random(255), random(255), random(255), 50);

    noStroke();
    fill(c);

    // Draw either a circle or a rectangle
    if (random(1) > 0.5) {
      ellipse(x, y, r, r);
    } else {
      rectMode(CENTER);
      rect(x, y, r, r);
    }
  }
}

function drawKandinskyShape(delay) {
  // Use a setTimeout to create the animation effect
  setTimeout(() => {
    let x = random(width);
    let y = random(height);
    let shapeSize = random(50, 200);

    // Use random colors and line weights
    let shapeColor = color(random(255), random(255), random(255));
    let strokeColor = color(random(255), random(255), random(255));
    let strokeWeightValue = random(1, 5);

    fill(shapeColor);
    stroke(strokeColor);
    strokeWeight(strokeWeightValue);

    // Randomly choose a shape to draw
    let shapeType = floor(random(3));

    switch (shapeType) {
      case 0: // Circle
        ellipse(x, y, shapeSize, shapeSize);
        break;
      case 1: // Rectangle
        rectMode(CENTER);
        rect(x, y, shapeSize, shapeSize);
        break;
      case 2: // Triangle
        let x1 = x;
        let y1 = y - shapeSize / 2;
        let x2 = x - shapeSize / 2;
        let y2 = y + shapeSize / 2;
        let x3 = x + shapeSize / 2;
        let y3 = y + shapeSize / 2;
        triangle(x1, y1, x2, y2, x3, y3);
        break;
    }

    // Add a smaller, secondary shape or line inside
    if (random(1) > 0.5) {
      let innerShapeSize = shapeSize * random(0.2, 0.5);
      let innerColor = color(random(255), random(255), random(255));
      noStroke();
      fill(innerColor);
      ellipse(x, y, innerShapeSize, innerShapeSize);
    } else {
      let lineLength = shapeSize * random(0.5, 1);
      let angle = random(TWO_PI);
      let endX = x + lineLength * cos(angle);
      let endY = y + lineLength * sin(angle);
      stroke(strokeColor);
      strokeWeight(strokeWeightValue);
      line(x, y, endX, endY);
    }
  }, delay);
}
