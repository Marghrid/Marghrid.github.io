function createLifeScene(n_lives) {
    lifescene = new THREE.Scene();

    lifescene.lives = new Array();

    var initialLifeX = 185;
    var initialLifeY = -135;
    var distance = 17;

    var car_life;
    for(let i = 0; i < n_lives; ++i) {
    	car_life = new Car(new THREE.Vector3(initialLifeX - distance*i, initialLifeY, 0), 1.5);
    	car_life.toggleLighting() 
    	lifescene.add(car_life);
    	lifescene.lives.push(car_life);
    }
}

function loseLife() {
	if(lifescene.lives.length > 0) {
		var car_life = lifescene.lives.pop();
		lifescene.remove(car_life);
	}
	else gameOver = true;
}

function pause() {
	lifescene.add(pause_mesh);
}

function unpause() {
	lifescene.remove(pause_mesh);
}

function gameOverScreen() {
	lifescene.add(game_over_mesh);
}

function restart() {
	createGameScene();
	createLifeScene(5);
	lifescene.remove(game_over_mesh);
}