class Attractor {

  constructor(location, force) {
    this.location = location; 
    this.radius = pow(force, 0.4);
    this.ball_color = color(0, 0, 255);
    this.force = force;
  }
  
  attract(planets) {
    for (i = 0; i < planets.length; i++) {
      var P = planets[i];
      var vector = loop_vector(this.location, P.location);
      var mag = vector.mag();
      var distance = mag;
      if (distance <= this.radius * 2) {
        var ray_color = color(hue(P.ball_color), saturation(P.ball_color), brightness(P.ball_color));
        var alpha = (1 - distance / this.radius / 2);
        ray_color.setAlpha(alpha*255);
        stroke(ray_color);
        strokeWeight(alpha*5);
        line(P.location.x, P.location.y, P.location.x+vector.x, P.location.y+vector.y);
        noStroke();
      }
      var direction = vector.div(mag);
      if (distance <= (this.radius/2+P.radius/2)) {
        P.location.set(this.location.copy().add(direction.copy().mult(-this.radius/2-P.radius/2)));
        var cross = createVector(-direction.y, direction.x);
        var r = direction.copy().sub( cross.copy().mult(direction.copy().dot(cross)) );
        r = P.velocity.copy().sub( cross.copy().mult(P.velocity.copy().dot(cross)) );
        P.velocity = r.mult(-friction); 
      }
      P.add_force(direction.mult(this.force * P.mass / (sq(distance))));
    }
  }
  
  update() {
    this.edges();
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
