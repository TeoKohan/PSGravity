var framerate = 60;
var diagonal;
var attractor_number = 10;
var planet_number = 50;
var friction = 0.9;

var attractors;
var planets;

var draw_line = false;

function loop_vector(A, B) {
  var x_distances = createVector((A.x-B.x+width) %width,  (B.x-A.x+width) %width);
  var y_distances = createVector((A.y-B.y+height)%height, (B.y-A.y+height)%height);
  var x_distance = x_distances.x < x_distances.y ? x_distances.x : -x_distances.y ;
  var y_distance = y_distances.x < y_distances.y ? y_distances.x : -y_distances.y ;
  return createVector(x_distance, y_distance);
}

function loop_distance(A, B) {
  var x_distance = min((A.x-B.x+width) %width,  (B.x-A.x+width) %width);
  var y_distance = min((A.y-B.y+height)%height, (B.y-A.y+height)%height);
  return sqrt(sq(x_distance)+sq(y_distance));
}

function random_bell() {
    var u = 0, v = 0;
    while(u == 0) {u = random(1);}
    while(v == 0) {v = random(1);}
    return sqrt(-2*log(u))*cos(2*PI*v);
}

function setup() {
  attractor_number = floor(attractor_number * abs(random_bell()) + attractor_number/2);
  planet_number = floor(planet_number * abs(random_bell()) + planet_number/2);
  createCanvas(windowWidth, windowHeight);
  frameRate(framerate);
  diagonal = sqrt(sq(width)+sq(height));
  colorMode(HSB, 255);
  noStroke();
  fill(255);
  
  var location;
  attractors = [];
  for (i = 0; i < attractor_number; i++) {
    location = createVector(random(0, width), random(0, height));
    var force = abs(random_bell())*25000+10000;
    var A = new Attractor(location, force);
    attractors.push(A);
  }
  
  planets = [];
  for (i = 0; i < planet_number; i++) {
    location = createVector(random(0, width), random(0, height));
    var diameter = abs(random_bell())*50+10;
    var P = new Planet(location, diameter, diameter/10);
    planets.push(P);
  }
}

var last_mouse;

function mousePressed() {
  mouse_pressed = true;
  last_mouse = createVector(mouseX, mouseY);
  var A;
  drag = null;
  for (i = 0; i < attractors.length; i++) {
    A = attractors[i];
    var distance = loop_distance(A.location, last_mouse);
    if (distance <= A.radius/2) { drag = A; return; }
  }
}

function mouseDragged() {
  if (drag == null) { draw_line = true; }
  else {
    var mouse = createVector(mouseX, mouseY);
    draw_line = false;
    var delta_mouse = mouse.copy().sub(last_mouse);
    drag.location.add(delta_mouse); 
    last_mouse = mouse;
  }
}

function mouseReleased() {
  draw_line = false;
  if (drag == null) {
    var mouse = createVector(mouseX, mouseY);
    var force = mouse.sub(last_mouse);
    force.setMag(pow(force.mag(), 1.2));
    for (k = 0; k < planet_number; k++) { planets[k].add_force(force); }
  }
}

function draw_arrow(from, to) {
  var dir = createVector(to.x-from.x, to.y-from.y);
  var cross = createVector(-dir.y, dir.x).setMag(10);
  var midpoint = from.copy().add(dir.copy().setMag(dir.mag()-10));
  var arrow_left = midpoint.copy().add(cross);
  var arrow_right = midpoint.copy().sub(cross);
  line(from.x, from.y, to.x, to.y);
  line(to.x, to.y, arrow_left.x, arrow_left.y);
  line(to.x, to.y, arrow_right.x, arrow_right.y);
}

function draw() {
  background(0);
  if (draw_line) {
    stroke(255);
    strokeWeight(3);
    var mouse = createVector(mouseX, mouseY);
    draw_arrow(last_mouse, mouse);
    noStroke();
  }
  var A, P;
  for (j = 0; j < attractor_number; j++) { 
    A = attractors[j];
    A.update();
    A.attract(planets);
  }
  for (j = 0; j < attractor_number; j++) { 
    A = attractors[j];
    A.draw();
  }
  for (k = 0; k < planet_number; k++) {
    P = planets[k];
    P.update(); 
    P.draw(); 
  }
}
