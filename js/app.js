var allEnemies = [];

var constants = {
	MAX_Y_BORDER: 400,
	MIN_Y_BORDER: 72,
	MAX_X_BORDER: 404,
	MIN_X_BORDER: 0,
	PLAYER_MOVEMENT: 82,
	PLAYER_MOVEMENT_X: 101,
	PLAYER_START_POINT: [0,400],
	PLAYER_RESET_POINT: [202, 400],
	STARTINGLIVES: 3,
	ENEMY_Y_POSITION: [225, 140, 60]
};

var MovableObject =  function(sprite,xPosition, yPosition){
	this.sprite = sprite;
	this.x = xPosition;
	this.y = yPosition;
};


MovableObject.prototype.generateRandomNumber = function(a, b) {
	// Generate Random Number
	return Math.floor((Math.random() + a)*b);
}

// Enemies our player must avoid
var Enemy = function() {
	MovableObject.call(this,'images/enemy-bug.png', this.generateRandomNumber(100, -10), constants.ENEMY_Y_POSITION[this.generateRandomNumber(0, 3)]);
	this.speed = this.generateRandomNumber(1, 150);
};

Enemy.prototype = Object.create(MovableObject.prototype);

Enemy.prototype.constructor = Enemy;

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	this.x = this.x + this.speed * dt
	if(this.x > constants.MAX_Y_BORDER) {
		this.x = this.generateRandomNumber(100, -10);
	}
};

Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Enemies = function() {
	this.numberOfEnemies = (player.score + 1) * 3
};

Enemies.prototype.generateEnemies = function() {
	if(allEnemies.length < 10) {
		for(var i = 0 ; i < this.numberOfEnemies; i++) {
			allEnemies.push(new Enemy());
		}
	}
};

// Our player class
var Player = function() {
	MovableObject.call(this, 'images/char-boy.png', constants.PLAYER_START_POINT[0], constants.PLAYER_START_POINT[1])
	this.score = 0;
	this.lives = constants.STARTINGLIVES;
};

Player.prototype = Object.create(MovableObject.prototype);

Player.constructor = Player;

Player.prototype.update = function() {
	this.xNow = this.x;
	this.yNow = this.y;
	this.checkCollisions(this);
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.hit = function () {
	this.x = constants.PLAYER_RESET_POINT[0];
	this.y = constants.PLAYER_RESET_POINT[1];
	this.lives == 0 ?  this.gameOver(): this.lives--;
	this.updateDashboard();
};

Player.prototype.win = function () {
	this.x = 0;
	this.y = 400;
	this.score ++;
	enemies.generateEnemies();
	this.updateDashboard();
};

Player.prototype.gameOver = function() {
	this.score = 0;
	this.lives = 3;
	allEnemies = [];
	enemies.generateEnemies();
};

Player.prototype.updateDashboard = function() {
	ctx.font = "30px Arial";
	ctx.clearRect(0,0,500,500);
	ctx.fillText("Score: " +this.score,10,40);
	ctx.fillText(" Lives: " + this.lives ,370,40);
};

Player.prototype.checkCollisions = function(ply) {
	if(ply.y < 318 && ply.y > 71){
		allEnemies.forEach(function(enemy) {
			var xCondition = ply.x -70 < enemy.x &&  enemy.x < ply.x + 85,
			yCondition = ply.y -15 < enemy.y &&  enemy.y< ply.y + 15;
			if(xCondition && yCondition) {
				ply.hit();
			}
		});
	}else if(ply.y < 71) {
		ply.win();
	}
};

Player.prototype.handleInput = function(key) {
	if(key === 'left') {
		/**
		* Allow the player to move. when he
		* is within the canvas boundary
		*/
		if (this.x > constants.MIN_X_BORDER) {
			this.x = this.xNow - constants.PLAYER_MOVEMENT_X;
		}
	}
	if(key === 'up') {
		if(this.y >= constants.MIN_Y_BORDER){
			this.y = this.yNow - constants.PLAYER_MOVEMENT;
		}
	}
	if(key === 'right' ) {
		if(this.x < constants.MAX_X_BORDER) {
			this.x = this.xNow + constants.PLAYER_MOVEMENT_X;
		}
	}
	if(key === 'down') {
		if(this.y < constants.MAX_Y_BORDER ) {
			this.y = this.yNow + constants.PLAYER_MOVEMENT;
		}
	}
};

var player = new Player();
var enemies = new Enemies();
enemies.generateEnemies();

document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});