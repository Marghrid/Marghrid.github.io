function createGameScene() {
    'use strict';

    gameScene = new THREE.Scene();
    gameScene.gameElements = new Array();
    //gameScene.add(new THREE.AxisHelper(10));

    // Table top positioned on z = 0
    table = new Table(0, 0, 0);

    track = new CheerioTrack(0, 15, 1.2);
    car = new Car(track.startingPoint, 1);

    butter_array = generateButters(5, 0, 1);
    orange_array = generateOranges(3, 0, 1);

    table.add(track);
    table.add(car);
    carCamera.attachToCar(car);

    sun = new Sun(1.7, 100);
    candle_array = generateCandles(1.5, 130, 30);

    if(!sunOn) {
        sun.turnOnOff();
    }

    if(!candlesOn) {
        for(let c in candle_array)
            candle_array[c].turnOnOff();
    }

    for(var i = 0; i < orange_array.length; i++)
        table.add(orange_array[i]);

    for(var i = 0; i < butter_array.length; i++)
        table.add(butter_array[i]);

    for(var i = 0; i < candle_array.length; i++)
        table.add(candle_array[i]);

    gameScene.add(table);
    gameScene.add(sun);

    // Elements array:
    gameScene.gameElements = gameScene.gameElements.concat(track.get_cheerios());
	gameScene.gameElements.push(car);
    gameScene.gameElements = gameScene.gameElements.concat(butter_array);
    gameScene.gameElements = gameScene.gameElements.concat(orange_array);

    // If illumination has been turned off
    if(!lightingOn) {
    	table.toggleLighting();
        for(let e in gameScene.gameElements)
            gameScene.gameElements[e].toggleLighting();
    }

    if(!phongShading) {
    	table.toggleShadingType();
        for(let e in gameScene.gameElements)
            gameScene.gameElements[e].toggleShadingType();
    }
}
