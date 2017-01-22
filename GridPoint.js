var GridPoint = function(){
	this.neighbours = [];
	this.pos = createVector();
	this.visitCount = 0;
	this.initPos;
	this.active = false;
	this.currentNeighbour = 0;
	this.hitCounter = 0;
	this.amp = 0;
	this.inc = 0.1;
	this.dir = createVector(0, 0);
	this.len = cellWidth / 2;
	this.initDir = createVector(1, 0);

	this.drawPos = function(){
		return {x: this.pos.x + this.dir.x * this.len, y: this.pos.y + this.dir.y * this.len };
	}

	this.nextNeighbour = function(i) {
		this.currentNeighbour = i % this.neighbours.length;
		return field[this.neighbours[this.currentNeighbour]];
	};

	this.randomNeighbour = function() {
		return field[this.neighbours[ Math.floor(Math.random() * this.neighbours.length) ]];
	};
	
	this.look = function(t, pct) {
		this.dir.lerp(t, pct);
		this.dir.normalize();
	};

	this.update = function(){	
		// Displace
/*
		var val = map(sin(frameCount / 10), -1, 1, Math.sqrt(cellWidth * cellWidth * 0.75) * 0.5, Math.sqrt(cellWidth * cellWidth * 0.75 ) * 1.2) / 10;
		val = sin(frameCount/10) * this.amp;
		this.pos.y += val;
		*/
		this.pos.y += this.amp;

		var d = cellHeight * .75;
		//this.dir.lerp(this.initDir, 0.05);
		this.dir.normalize();
		//this.pos.y = constrain(this.pos.y, this.initPos.y - d, this.initPos.y + d);
		//console.log(this.pos.y);
		//this.pos.lerp(this.initPos, 0.01);
		this.amp = lerp(this.amp, 0.0, 0.01);
	}

	this.goOver = function(){
		this.amp++;
		this.amp = min( this.amp * 2, cellHeight * .5);
	}

	this.displace = function(i, pct){
		var val = map(sin(frameCount / 10), -1, 1, Math.sqrt(cellWidth * cellWidth * 0.75) * 0.5, Math.sqrt(cellWidth * cellWidth * 0.75 ) * 1.2) / 10;
		val = sin(frameCount/100 * i) * pct;
		this.pos.y += i / 5;
		//this.pos.y += val;
	}

	this.display = function() {
		//ellipse(this.pos.x, this.pos.y, 1, 1);
		fill(255);
		line(this.pos.x, this.pos.y, this.pos.x + this.dir.x * this.len, this.pos.y + this.dir.y * this.len);
		//ellipse(this.pos.x + this.dir.x * this.len, this.pos.y + this.dir.y * this.len, 3, 3);
	}
}