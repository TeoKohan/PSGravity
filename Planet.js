class Planet {

  constructor (location, diameter, mass) {
    this.location = location;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = diameter/2;
    this.mass = mass;
    this.ball_color = color(random(255), 255, 255);
  }
  
  speed() { return this.velocity.mag(); }
  
  update() {
    this.add_force(this.drag(1));
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.edges();
    this.acceleration.mult(0);
  }
  
  add_force(force) {
    this.acceleration.add(force.copy().mult(1/this.mass/framerate));
  }
  
  gravity() {
    return createVector(0, 9.8).mult(this.mass);
  }
  
  drag(Cd) {
    return this.velocity.copy().setMag(1).mult(pow(this.speed(), 2) * -Cd/2);
  }
  
  edges() {
    this.location.x = (width + this.location.x) % width;
    this.location.y = (height + this.location.y) % height;
  }
  
  draw() {
    fill(this.ball_color);
    ellipse(this.location.x, this.location.y, this.radius, this.radius);
    if (this.location.x > width-this.radius/2) { ellipse(-width+this.location.x, this.location.y, this.radius, this.radius); }
    else if(this.location.x < this.radius/2) { ellipse(width+this.location.x, this.location.y, this.radius, this.radius); }
    if (this.location.y > height-this.radius/2) { ellipse(this.location.x, -height+this.location.y, this.radius, this.radius); }
    else if(this.location.y < this.radius/2) { ellipse(this.location.x, height+this.location.y, this.radius, this.radius); }
  }
}
