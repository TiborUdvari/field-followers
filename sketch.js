console.log("let's hope this works");
// --- Gamepad stuff ---

// todo flow field

var gamepad = undefined;

pStretch = 0;
var stretch = 0;
var spin = 0;

var resolution = 20;
moverCount = 3;

var field = [];
var movers = [];
var cols; 
var rows;
var cellWidth;
var cellHeight;
var circles = [];
var circleCount = 0;
var score = 0;
var goal;

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
  //console.log(e.gamepad);
  gamepad = e.gamepad;
});

var Circle = function(x, y){
	this.pos = createVector(x, y);
	this.r = 1;
	this.temp = createVector(0, 0);
	this.shouldRemove = false;
	this.maxR = random(width / 5, width / 7);

	this.update = function() {
		this.r *= 1.2;
		if (this.r > this.maxR){
			this.shouldRemove = true;
		}
	}

	this.display = function(){
		noFill();
		ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
	}
}

function setup(){
	createCanvas(600, 600);

	cols = Math.floor(width / resolution);
	cellWidth = width / (cols - 2);
	cellHeight = Math.sqrt(cellWidth * cellWidth * 0.75);
	rows = Math.floor(height / cellHeight) + 2;
	
	setupGridPoints();
	setupMovers();
	stroke(255);
	goal = createVector(random(0, width), random(0, height));

	for (var i = 0; i < circleCount; i++) {
		circles.push(new Circle(width / 2, height / 2));
	}
}

function createCircle(x, y){
	var c = new Circle(x, y);
	circles.push(c);
}

function draw(){


	for (var i = circles.length - 1; i >= 0; i--) {
		var c = circles[i];
		if (c.r > width || c.shouldRemove) {
			circles.splice(i, 1);
		}
	}

	// Show the things
	scangamepads();
	updateGamepadVars();

	var b = map(stretch, -1, 1, 0, 255);
	background(0);

	//rect(goal.x, goal.y, 10, 10);

		for (var i = 0; i < movers.length; i++) {
			var m = movers[i];
			// Find a target
			
			// naive find Grid Point
			var c =	Math.floor( m.position.x / cellWidth );
			c = constrain(c, 0, cols);
			var r = Math.floor( m.position.y / cellHeight );
			r = constrain(r, 0, rows);
			var idx = c + r * cols;
			var gp = field[idx];
			m.applyForce(gp.dir.copy().mult(0.5));
			//gp.goOver();

			m.update();
			m.display();
		}
		var t = createVector(0, 0);
		for (var i = 0; i < field.length; i++) {
			var point = field[i];
		
			var c = i % cols;
			var r = ( i - c ) / cols;
			if (frameCount % 5  == 0) {
				var theta = map(noise(frameCount * 0.001 + c / 10,r / 10),0,1,0,TWO_PI);
    		t.x = cos(theta);
    		t.y = sin(theta);
    		point.look(t, 0.05);
			} 

    	//point.dir.x = cos(theta);
    	//point.dir.y = sin(theta);

    	// En fonction de i
    	var target = stretch;
    	var inp = lerp(pStretch, target, 0.5);
    	/*
    	var val = map(inp * i / 100, 0, 1, 0, TWO_PI);
    	point.dir.x = cos(val);
    	point.dir.y = sin(val);
*/
	    			// Check if they are inside a circle
			for (var j = 0; j < circles.length; j++) {
				var c = circles[j];
				var gp = point;
				// Get a vector that point toward the center
				var dirX = (gp.pos.x + cellWidth  / 2) - c.pos.x;
				var dirY = (gp.pos.y + cellHeight / 2) - c.pos.y;
				var dir = createVector(dirX, dirY) ;
				dir.normalize();
				var look = dir.copy();
				dir.mult(c.r).add(c.pos);
				fill(255);
				//ellipse(dir.x, dir.y, 1,1);
				// between 2 x
				var xOK = dir.x > gp.pos.x && dir.x <= gp.pos.x + cellWidth;
				var yOK = dir.y > gp.pos.y && dir.y <= gp.pos.y + cellHeight;

				if (xOK && yOK) {
					point.look(look, 0.8);
					
					//console.log("git");
				}
			}

			point.display();	
			point.update();
			
			//point.displace( Math.floor(i / cols), stretch);
			for (var j= 0; j< point.neighbours.length; j++) {
				var idx = point.neighbours[j];
				if ( j > 3) continue;
				var n = field[idx];
				//line(point.pos.x, point.pos.y, n.pos.x, n.pos.y);
				//line(point.drawPos().x, point.drawPos().y, n.drawPos().x, n.drawPos().y);
			}

			//console.log(stretch);
		}

		for (var i = 0; i < circles.length; i++) {
			var c = circles[i];
			c.update();
			c.display();
		}

	noFill();

	strokeWeight(2);
	var s = 5;
	
	//noStroke();
	fill(0);
	ellipse(goal.x, goal.y, s * 4, s * 4);
	stroke(255);
	line(goal.x -s, goal.y -s, goal.x + s, goal.y + s);
	line(goal.x -s, goal.y +s, goal.x + s, goal.y - s);
	strokeWeight(1);

	for (var i = movers.length - 1; i >= 0; i--) {
		var m = movers[i];
		if (m.position.dist(goal) <= s * 2) {
			movers.splice(i, 1);
			console.log("Success");
		}
	}

		pStretch = stretch;
}

function updateGamepadVars(){ 
	//stretch = map(mouseX, 0.0, width, 0.0, 1.0);

	if (!gamepad) return;
	if (frameCount % 3 == 0) {
	stretch = map(gamepad.axes[0], -0.5, 1, 0.0, 1.0);
	spin = map(gamepad.axes[1], -1, 1, 0, 1);
	}

}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  
  if (gamepads.length > 0) {
  	gamepad = gamepads[0];
  }
}


function setupGridPoints(){
	for (var i = 0; i < cols * rows; i++){
		var gp = new GridPoint();
		field.push(gp);
	}
	var rand = Math.floor(random(0,100));
	for (var i = 0; i < field.length; i++){
		var gp = field[i];
		var theta = map(rand,0,1,0,TWO_PI);
    gp.dir.x = cos(theta);
    gp.dir.y = sin(theta);
		var x = i % cols; 			// index
		var y = (i - x) / cols; // index

		if ( x > 0 ) { gp.neighbours.push(i - 1); } // left
		if ( y < rows - 1) { gp.neighbours.push( i + cols ); } // bottom
		if ( y % 2 == 0 && x > 0 && y > 0) { // if pair down left
				gp.neighbours.push(i - cols - 1);
		}
		
		if ( y % 2 == 1 && x < cols - 1 &&  y < rows ) { // if unpair right up
				gp.neighbours.push(i - cols + 1);
		}

		gp.neighbours.forEach(function (idx) {
				var neighbourGridPoint =  field[idx];
				neighbourGridPoint.neighbours.push(i);
			});

			var posx = cellWidth * x + (y % 2) * cellWidth / 2;
			var posy = cellHeight * y;
			var pos = createVector(posx, posy);

			gp.pos = pos;
			gp.initPos = pos.copy();
		}
	}

function setupMovers(){
	for (var i = 0; i < moverCount; i++) {
		var m = new Mover();
		var gp = field[Math.floor(random(field.length))];
		m.position = gp.pos.copy();
		//m.target = gp.randomNeighbour();
		movers.push(m);
	}
}

function mousePressed(){
	createCircle(mouseX, mouseY);
}
