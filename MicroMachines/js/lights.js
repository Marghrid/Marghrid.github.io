class Candle extends THREE.PointLight {

    constructor(intensity, distance, position) {
        super(0xffd652, intensity, distance, 2);
        this.position.set(position.x, position.y, position.z);
        this.candle_intensity = intensity;
    }

    turnOnOff() {
        if(this.intensity == 0)
            this.intensity = this.candle_intensity;
        else
            this.intensity = 0;
    }
}

function generateCandles(intensity, distance, posZ) {
    'use strict';

    var candle_r = new Array();
    var positions = [
        new THREE.Vector3(-140, 0, posZ),
        new THREE.Vector3(180, 130, posZ),
        new THREE.Vector3(0, -100, posZ),
        new THREE.Vector3(140, 0, posZ),
        new THREE.Vector3(0, 100, posZ),
        new THREE.Vector3(-180, 130, posZ),
    ];

    for(let pos in positions) {
        let candle = new Candle(intensity, distance, positions[pos]);
        candle_r.push(candle);
    }

    return candle_r;
}

class Sun extends THREE.DirectionalLight {

    constructor(intensity, posZ) {
        super(0xffeeee, intensity);
        this.position.set(100, 100, posZ);
        this.sun_intensity = intensity;
    }

    turnOnOff() {
        if(this.intensity == 0)
            this.intensity = this.sun_intensity;
        else
            this.intensity = 0;
    }
}

class Headlight extends THREE.SpotLight {
	constructor(position, target, intensity, distance, angle, penumbra) {
		super(0xfff696, intensity, distance, angle, penumbra, 2)
		this.position.set(position.x, position.y, position.z);
		this.target.position.set(target.x, target.y, target.z);
        this.headlight_intensity = intensity;
	}

    turnOnOff() {
        if(this.intensity == 0)
            this.intensity = this.headlight_intensity;
        else
            this.intensity = 0;
    }
}