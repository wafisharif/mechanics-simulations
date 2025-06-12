let x, y, vx, vy;
let x2, y2, vx2, vy2;
let v0 = 100, v0_2 = 120;
let angle = 45, angle2 = 60;
let g = 9.8;
let t = 0, t2 = 0;
let launched = false, launched2 = false;
let trail = [], trail2 = [];
let pixelsPerMeter = 50; // 50 pixels per meter




let velocitySlider, angleSlider, velocity2Slider, angle2Slider;
let resetButton, toggleRealTimeButton;
let zoomInButton, zoomOutButton, resetZoomButton;
let totalTime1 = 0, totalTime2 = 0;
let totalRange1 = 0, totalRange2 = 0;
let maxHeight1 = 0, maxHeight2 = 0;
let statsCalculated1 = false, statsCalculated2 = false;


let zoomFactor = 1.0;
let originX = 0;
let originY;
let realTime = false;


function calculateProjectileStats(v0, angleDeg) {
  let rad = radians(angleDeg);
  let time = (2 * v0 * sin(rad)) / g;
  let range = (v0 * v0 * sin(2 * rad)) / g;
  let maxHeight = (v0 * v0 * pow(sin(rad), 2)) / (2 * g);
  return { time, range, maxHeight };
}




function setup() {
  createCanvas(800, 600);
  textSize(16);
  textAlign(LEFT, TOP);
  originY = height - 50;


  velocitySlider = document.getElementById('velocitySlider');
  angleSlider = document.getElementById('angleSlider');
  velocity2Slider = document.getElementById('velocity2Slider');
  angle2Slider = document.getElementById('angle2Slider');
  resetButton = document.getElementById('resetButton');
  zoomInButton = document.getElementById('zoomInButton');
  zoomOutButton = document.getElementById('zoomOutButton');
  resetZoomButton = document.getElementById('resetZoomButton');
  toggleRealTimeButton = document.getElementById('toggleRealTimeButton');


  toggleRealTimeButton.textContent = `Real Time: OFF`;


  velocitySlider.addEventListener('input', () => {
    document.getElementById('velocityValue').textContent = velocitySlider.value;
    if (!launched) resetProjectile();
  });
  angleSlider.addEventListener('input', () => {
    document.getElementById('angleValue').textContent = angleSlider.value;
    if (!launched) resetProjectile();
  });
  velocity2Slider.addEventListener('input', () => {
    document.getElementById('velocity2Value').textContent = velocity2Slider.value;
    if (!launched) resetProjectile();
  });
  angle2Slider.addEventListener('input', () => {
    document.getElementById('angle2Value').textContent = angle2Slider.value;
    if (!launched) resetProjectile();
  });


  resetButton.addEventListener('click', () => {
    resetProjectile();
    resetButton.blur();
  });
  zoomInButton.addEventListener('click', () => {
    zoomFactor *= 1.1;
    updateZoomDisplay();
    zoomInButton.blur();
  });
  zoomOutButton.addEventListener('click', () => {
    zoomFactor /= 1.1;
    updateZoomDisplay();
    zoomOutButton.blur();
  });
  resetZoomButton.addEventListener('click', () => {
    zoomFactor = 1.0;
    updateZoomDisplay();
    resetZoomButton.blur();
  });
  toggleRealTimeButton.addEventListener('click', () => {
    realTime = !realTime;
    toggleRealTimeButton.textContent = `Real Time: ${realTime ? "ON" : "OFF"}`;
    toggleRealTimeButton.blur();
  });


  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      document.activeElement.blur();
    }
  });


  updateZoomDisplay();
  resetProjectile();
}


function updateZoomDisplay() {
  document.getElementById('zoomDisplay').textContent = `Zoom: ${zoomFactor.toFixed(2)}×`;
}


function resetProjectile() {
  v0 = parseFloat(velocitySlider.value);
  angle = parseFloat(angleSlider.value);
  t = 0;
  x = 50;
  y = height - 50;
  let rad = radians(angle);
  vx = v0 * cos(rad);
  vy = -v0 * sin(rad);
  trail = [];


  v0_2 = parseFloat(velocity2Slider.value);
  angle2 = parseFloat(angle2Slider.value);
  t2 = 0;
  x2 = 50;
  y2 = height - 50;
  let rad2 = radians(angle2);
  vx2 = v0_2 * cos(rad2);
  vy2 = -v0_2 * sin(rad2);
  trail2 = [];


  launched = false;
  launched2 = false;
 
  // Convert pixel/sec to meter/sec for calculations
  let v0_m_s = v0 / pixelsPerMeter;
  let stats1 = calculateProjectileStats(v0_m_s, angle);
  totalTime1 = stats1.time;
  totalRange1 = stats1.range * pixelsPerMeter;
  maxHeight1 = stats1.maxHeight * pixelsPerMeter;


 let v0_2_m_s = v0_2 / pixelsPerMeter;
 let stats2 = calculateProjectileStats(v0_2_m_s, angle2);
 totalTime2 = stats2.time;
 totalRange2 = stats2.range * pixelsPerMeter;
 maxHeight2 = stats2.maxHeight * pixelsPerMeter;


  statsCalculated1 = false;
  statsCalculated2 = false;
}


function draw() {
  background(18);
  stroke(100);
  line(0, height - 50, width, height - 50);


  push();
  translate(originX * (1 - zoomFactor), originY * (1 - zoomFactor));
  scale(zoomFactor);


  const dt = (realTime ? deltaTime / 1000 : 2.5 * deltaTime / 1000);


  if (launched && !statsCalculated1) {
    t += dt;
    x = 50 + vx * t;
    y = (height - 50) + (vy * t) + (0.5 * g * t * t);
    trail.push({ x, y });


    const currentHeight = height - 50 - y;
    if (currentHeight > maxHeight1) maxHeight1 = currentHeight;


    if (y >= height - 50) {
      y = height - 50;
      launched = false;
      statsCalculated1 = true;
      let v0_m_s = v0 / pixelsPerMeter;
let stats1 = calculateProjectileStats(v0_m_s, angle);
totalTime1 = stats1.time;
totalRange1 = stats1.range * pixelsPerMeter;
maxHeight1 = stats1.maxHeight * pixelsPerMeter;


    }
  }


  if (launched2 && !statsCalculated2) {
    t2 += dt;
    x2 = 50 + vx2 * t2;
    y2 = (height - 50) + (vy2 * t2) + (0.5 * g * t2 * t2);
    trail2.push({ x: x2, y: y2 });


    const currentHeight2 = height - 50 - y2;
    if (currentHeight2 > maxHeight2) maxHeight2 = currentHeight2;


    if (y2 >= height - 50) {
  y2 = height - 50;
  launched2 = false;
  statsCalculated2 = true;
  totalTime2 = t2;
  totalRange2 = x2 - 50;


  let v0_2_m_s = v0_2 / pixelsPerMeter;
  let stats2 = calculateProjectileStats(v0_2_m_s, angle2);
  totalTime2 = stats2.time;
  totalRange2 = stats2.range * pixelsPerMeter;
  maxHeight2 = stats2.maxHeight * pixelsPerMeter;
}
  }


  noFill();
  stroke(0, 0, 255);
  beginShape();
  for (let pos of trail) vertex(pos.x, pos.y);
  endShape();


  stroke(0, 255, 0);
  beginShape();
  for (let pos of trail2) vertex(pos.x, pos.y);
  endShape();


  noStroke();
  fill(255, 0, 0);
  ellipse(x, y, 20 / zoomFactor);
  fill(0, 255, 0);
  ellipse(x2, y2, 20 / zoomFactor);


  // Vectors for 1st projectile
  if (launched || statsCalculated1) {
    let velVec1 = createVector(vx, vy + g * t);
    let accVec1 = createVector(0, g * 15);
    let forceVec1 = createVector(0, g * 10); // longer tail


    drawVectorArrow(createVector(x, y), velVec1, color(0, 200, 255));
    labelVector(createVector(x, y), velVec1, "Velocity", color(0, 200, 255));


    drawVectorArrow(createVector(x, y), accVec1, color(255, 165, 0));
    labelVector(createVector(x, y), accVec1, "Acceleration", color(255, 165, 0));


    drawVectorArrow(createVector(x, y), forceVec1, color(255, 0, 0));
    labelVector(createVector(x, y), forceVec1, "Net Force", color(255, 0, 0));


   
   
  }


  // Vectors for 2nd projectile
  if (launched2 || statsCalculated2) {
    let velVec2 = createVector(vx2, vy2 + g * t2);
    let accVec2 = createVector(0, g * 15);
    let forceVec2 = createVector(0, g * 10); // longer tail


    drawVectorArrow(createVector(x2, y2), velVec2, color(0, 255, 180));
    labelVector(createVector(x2, y2), velVec2, "Velocity", color(0, 255, 180));


    drawVectorArrow(createVector(x2, y2), accVec2, color(255, 100, 50));
    labelVector(createVector(x2, y2), accVec2, "Acceleration", color(255, 100, 50));


    drawVectorArrow(createVector(x2, y2), forceVec2, color(255, 0, 0));
    labelVector(createVector(x2, y2), forceVec2, "Net Force", color(255, 0, 0));


  }


  pop();


  fill(200);
  text(`Time: ${Math.max(t, t2).toFixed(2)} s`, 10, 10);
  text(`Height 1: ${(height - 50 - y).toFixed(2)} px (${((height - 50 - y) / pixelsPerMeter).toFixed(2)} m)`, 10, 30);
  text(`Distance 1: ${(x - 50).toFixed(2)} px (${((x - 50) / pixelsPerMeter).toFixed(2)} m)`, 10, 50);
  text(`Height 2: ${(height - 50 - y2).toFixed(2)} px (${((height - 50 - y2) / pixelsPerMeter).toFixed(2)} m)`, 10, 70);
  text(`Distance 2: ${(x2 - 50).toFixed(2)} px (${((x2 - 50) / pixelsPerMeter).toFixed(2)} m)`, 10, 90);
  text(`Scale: 1 m = ${pixelsPerMeter} px`, 10, 110);




  if (!launched && !launched2) {
    text("Press SPACE!", 350, 130);
  }


 let statY = 150;


if (statsCalculated1) {
  text(`--- Projected Final Stats (1st Projectile) ---`, 10, statY);
  text(`Time: ${totalTime1.toFixed(2)} s`, 10, statY + 20);
  text(`Range: ${totalRange1.toFixed(2)} px (${(totalRange1 / pixelsPerMeter).toFixed(2)} m)`, 10, statY + 40);
  text(`Max Height: ${maxHeight1.toFixed(2)} px (${(maxHeight1 / pixelsPerMeter).toFixed(2)} m)`, 10, statY + 60);
  statY += 100;
}


if (statsCalculated2) {
  text(`--- Projected Final Stats (2nd Projectile) ---`, 10, statY);
  text(`Time: ${totalTime2.toFixed(2)} s`, 10, statY + 20);
  text(`Range: ${totalRange2.toFixed(2)} px (${(totalRange2 / pixelsPerMeter).toFixed(2)} m)`, 10, statY + 40);
  text(`Max Height: ${maxHeight2.toFixed(2)} px (${(maxHeight2 / pixelsPerMeter).toFixed(2)} m)`, 10, statY + 60);
}


}


function drawVectorArrow(base, vec, colorLabel) {
  push();
  stroke(colorLabel);
  fill(colorLabel);
  translate(base.x, base.y);
  let arrowSize = 10 / zoomFactor;
  let scaledVec = vec.copy().mult(0.50); // Global vector scaling
  line(0, 0, scaledVec.x, scaledVec.y);
  rotate(scaledVec.heading());
  translate(scaledVec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}


function keyPressed() {
  if (key === ' ') {
    // If projectiles are flying, reset
    if (launched || launched2) {
      resetProjectile();
    }
    // If projectiles have landed (stats are done), also reset
    else if (statsCalculated1 || statsCalculated2) {
      resetProjectile();
    }
    // Otherwise, launch
    else {
      launched = true;
      launched2 = true;
    }
  }
}


function labelVector(base, vec, label, colorLabel) {
  push();
  fill(colorLabel);
  noStroke();


  // Scale text size based on vector length (but clamp it within a readable range)
  let scaledVec = vec.copy().mult(0.50); // Match drawVectorArrow scaling
  let magnitude = scaledVec.mag();
  let minSize = 4;
  let maxSize = 14;
  let sizeFactor = 0.5; // Adjust to control how fast size grows with length
  let textSizeDynamic = constrain(magnitude * sizeFactor / zoomFactor, minSize / zoomFactor, maxSize / zoomFactor);


  textSize(textSizeDynamic);
  textAlign(CENTER, BOTTOM);


  let tip = p5.Vector.add(base, scaledVec); // Tip of arrow
  text(label, tip.x, tip.y - (10 / zoomFactor));
  pop();
}