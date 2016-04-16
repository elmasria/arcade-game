var allEnemies = [];

var constants = {
	PLAYER_MOVEMENT: 82,
	PLAYER_MOVEMENT_X: 101,
	MAX_Y_BORDER: 400,
	MIN_Y_BORDER: 72,
	MAX_X_BORDER: 404,
	MIN_X_BORDER: 0,
	ENEMY_Y_POSITION: [225, 140, 60],
	PLAYER_START_POINT: [0,400],
	PLAYER_RESET_POINT: [202, 400]
};

// Enemies our player must avoid
var Enemy = function(positionY, enemySpeed) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.x = generateRandomPosition(-1000, -100);
	this.y = positionY;
	this.speed = enemySpeed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x = this.x + this.speed * dt
	if(this.x > constants.MAX_Y_BORDER) {
		this.x = generateRandomPosition(-2000, -100);
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.sprite = 'images/char-boy.png';
	this.x = constants.PLAYER_START_POINT[0];
	this.y = constants.PLAYER_START_POINT[1];
	this.score = 0;
}

Player.prototype.update = function() {
	this.xNow = this.x;
	this.yNow = this.y;
	this.checkCollisions();
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.hit = function () {
	player.x = constants.PLAYER_RESET_POINT[0];
	player.y = constants.PLAYER_RESET_POINT[1];
}

Player.prototype.win = function () {4
	console.log("win");
	player.x = 0;
	player.y = 400;

	ctx.font = "30px Arial";
	ctx.clearRect(0,0,400,400);
	ctx.fillText("Score: " + ++this.score ,0,40);
}

Player.prototype.checkCollisions = function() {
	 if(player.y < 318 && player.y > 71){
	 	allEnemies.forEach(function(enemy) {
	 		var xCondition = player.x -70 < enemy.x &&  enemy.x < player.x + 85,
	 			yCondition = player.y -15 < enemy.y &&  enemy.y< player.y + 15;
	 		if(xCondition && yCondition ) {
				player.hit();
				console.log("collision");
	 		}
	 	});
	 }else if(player.y < 71) {
	 	player.win();
	 }
}

Player.prototype.handleInput = function(key) {
	if(key === 'left') {
			/* Allow the player to move. when he
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
	}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

allEnemies = [new Enemy(60, 100), new Enemy(140, 300), new Enemy(225, 100)];

var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});


function generateRandomPosition(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}