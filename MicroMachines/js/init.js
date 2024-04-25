// Keys flags:
var key_a = false;
var key_c = false;
var key_g = false;
var key_h = false;
var key_l = false;
var key_n = false;
var key_r = false;
var key_s = false;

var key_1 = false;
var key_2 = false;
var key_3 = false;

// Arrow keys flags:
var leftArrow  = false,
    upArrow    = false,
    rightArrow = false,
    downArrow  = false;

// Resize event flag:
var resizeUpdate = true;

// Game flags:
var lostLife = false;
var gameOver = false;

var waitingToRestart = false;

var lightingOn = true;
var phongShading = true;

var candlesOn = true;
var sunOn = true;
var headlightsOn = true;

function onResize() {
    'use strict'
    resizeUpdate = true;
}

function onKeyDown(e) {
    'use strict';
    switch(e.keyCode) {
    case 37: // <- (left) will turn the car to the left
        leftArrow = true;
        break;
    case 38: // ^  (up) will accelerate car forward
        upArrow = true;
        break;
    case 39: // -> (right) will turn the car to the right
        rightArrow = true;
        break;
    case 40: // v  (down) will accelerate car backward
        downArrow = true;
        break;
    case 49: // '1' will activate top orthographic camera
        key_1 = true;
        break;
    case 50: // '2' will activate top perspective camera
        key_2 = true;
        break;
    case 51: // '3' will activate car camera
        key_3 = true;
        break;
    case 65: // 'a' will toggle wireframe
        key_a = true;
        break;
    case 67: // 'c' will toggle candles
        key_c = true;
        break;
    case 71: // 'g' will swap shading type
        key_g = true;
        break;
    case 72: // 'h' will toggle the car's headlights
        key_h = true;
        break;
    case 76: // 'l' will toggle lighting calculation
        key_l = true;
        break;
    case 78: // 'n' will toggle the Sun
        key_n = true;
        break;
    case 82:
        key_r = true;
        break;
    case 83:
        key_s = true;
        break;
    }
}

function onKeyUp(e) {
    'use strict';
    switch(e.keyCode) {
    case 37: // <- (left)
        leftArrow = false;
        break;
    case 38: // ^  (up) will stop accelerating car
        upArrow = false;
        break;
    case 39: // -> (right)
        rightArrow = false;
        break;
    case 40: // v  (down) will stop accelerating car
        downArrow = false;
        break;
    }
}

function animate() {
    'use strict';

    // Events management:
    if(key_a) {
        key_a = false;
        if(clock.running) {
            for(let m in all_materials) {
                all_materials[m].wireframe = !all_materials[m].wireframe;
            }
        }
    }

    if(key_c) { // 'c' will toggle candles
        key_c = false;
        if(clock.running) {
            for(let c in candle_array)
                candle_array[c].turnOnOff();
            candlesOn = !candlesOn;
        }
    }

    if(key_g) { // 'g' will swap shading type
        key_g = false;
        if(clock.running) {
            table.toggleShadingType();
            for(let e in gameScene.gameElements)
                gameScene.gameElements[e].toggleShadingType();
            phongShading = !phongShading;
        }
    }

    if(key_h) { // 'h' will toggle the car's headlights
        key_h = false;
        if(clock.running) {
            car.toggleHeadlights();
            headlightsOn = !headlightsOn;
        }
    }

    if(key_l) { // 'l' will toggle lighting calculation
        key_l = false;
        if(clock.running) {
            table.toggleLighting();
            for(let e in gameScene.gameElements)
                gameScene.gameElements[e].toggleLighting();
            lightingOn = !lightingOn;
        }
    }

    if(key_n) { // 'n' will toggle the Sun
        key_n = false;
        if(clock.running) {
            sun.turnOnOff();
            sunOn = !sunOn;
        }
    }

    if(key_r) {
        key_r = false;
        if(waitingToRestart) {
            clock.start();
            restart();
            waitingToRestart = false;
        }    	
    }

    if(key_s) {
        key_s = false;
        if(!waitingToRestart) {
            if(clock.running) {
                clock.stop();
        	    pause();
            }
            else {
                clock.start();
        	    unpause();
            }
        }
    }


    if(key_1 == true) { // '1' will activate top orthographic camera
        key_1 = false;
        if(clock.running) {
            currentCamera = orthoCamera;
            resizeUpdate = true;
        }
    }

    if(key_2 == true) {
        key_2 = false;
        if(clock.running) {
            currentCamera = staticCamera;
            resizeUpdate = true;
        }
    }

    if(key_3 == true) {
        key_3 = false;
        if(clock.running) {
            currentCamera = carCamera;
            resizeUpdate = true;
        }
    }

    if(resizeUpdate) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentCamera.update();
        lifeCamera.update();
        resizeUpdate = false;
    }

    if(lostLife) {
    	loseLife();
    	lostLife = false;
    }

    if(gameOver) {
    	clock.stop();
    	gameOverScreen();
    	waitingToRestart = true;
    	gameOver = false;
    }

    // Time updates:
    var dt = clock.getDelta();

    for(let e in gameScene.gameElements) {
        gameScene.gameElements[e].update(dt);
    }

    cheerio_array = track.get_cheerios();

    // Collisions check and management:
    for(let orange in  orange_array) { // Orange-car
        if(car.checkCollision(orange_array[orange]))
            car.manageCollision(orange_array[orange]);
    }
    for(let butter in butter_array) { // Butter-car
        if(car.checkCollision(butter_array[butter]))
            car.manageCollision(butter_array[butter]);
    }

    for(let cheerio in cheerio_array) { // Cheerios-car
        if(car.checkCollision(cheerio_array[cheerio])) {
            car.manageCollision(cheerio_array[cheerio]);
            cheerio_array[cheerio].manageCollision(car);
        }
  }

    for(let i = 0; i < cheerio_array.length - 1; i++) { // Cheerios-cheerios
        for(let j = i + 1; j < cheerio_array.length; j++) {
            if(cheerio_array[i].checkCollision(cheerio_array[j])) {
                cheerio_array[j].manageCollision(cheerio_array[i]);
                cheerio_array[i].manageCollision(cheerio_array[j]);
            }
        }
    }

    render();
    requestAnimationFrame(animate);
}

function render() {
    'use strict';
    renderer.clear();
    renderer.render(gameScene, currentCamera);
    renderer.clearDepth();
    renderer.render(lifescene, lifeCamera);

}

function init() {
    'use strict';
    clock = new THREE.Clock();
    clock.start();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = false;

    orthoCamera = new TopOrthographicCamera();
    staticCamera = new TopPerspectiveCamera();
    carCamera = new CarPerspectiveCamera(50);
    lifeCamera = new TopOrthographicCamera();
    currentCamera = carCamera;

    createGameScene();
    createLifeScene(5);

    window.addEventListener("resize",  onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
}
