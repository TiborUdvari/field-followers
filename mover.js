var maxSpeed = 10;

var Mover = function(m, x, y, targetCallback) {
  this.mass = m;
  this.mass = random(1, 2);
  this.position = createVector(x, y);
  this.velocity = createVector(random(-5,5), random(-5, 5));
  this.acceleration = createVector(0, 0);
  this.targetCallback = targetCallback;
  this.hop = Math.floor(random(this.max));
  this.max = 3;
  this.dir = 1;
  this.damp = 0.9;

  this.applyForce = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  };
  
  this.update = function() {
    this.velocity.add(this.acceleration);
    // todo: limit max speed
    this.acceleration.mult(0);
    this.velocity.mult(this.damp);
    
    var mag = this.velocity.mag();
    mag = min(mag, this.max);

    this.velocity.normalize().mult(mag);


    this.handleEdges();
    this.position.add(this.velocity);
    // damp
  };

  this.display = function() {
    ellipse(this.position.x, this.position.y, 10, 10);
  };

  this.handleEdges = function() {
    if (this.position.x > width) {
      this.position.x = 0;
     // this.velocity.x = Math.abs(this.velocity.x) * -1;
    } else if (this.position.x < 0) {
      this.position.x = width;
      //this.velocity.x = Math.abs(this.velocity.x);
    }

    if (this.position.y < 0) {
      this.position.y = height;
     // this.velocity.y = Math.abs(this.velocity.y);
    } else if (this.position.y > height) {
      this.position.y = 0;
      //this.velocity.y = Math.abs(this.velocity.y) * -1;
    }
  }

}