class TopOrthographicCamera extends THREE.OrthographicCamera {
    constructor() {
        super(-100, 100, 100, -100, 1, 1000);

        this.position.set(0, 0, 100);
        this.lookAt(new THREE.Vector3(0,0,0));
    }

    update() {
        'use strict'
        if(window.innerHeight > 0 && window.innerWidth > 0) {
            var aspect = window.innerWidth/window.innerHeight;
            // We always want the camera to keep the same aspect ratio.
            if(aspect < MIN_ORTHO_CAMERA_WIDTH/MIN_ORTHO_CAMERA_HEIGHT) {
                this.left   = -MIN_ORTHO_CAMERA_WIDTH;
                this.right  =  MIN_ORTHO_CAMERA_WIDTH;
                this.top    =  MIN_ORTHO_CAMERA_WIDTH/aspect;
                this.bottom = -MIN_ORTHO_CAMERA_WIDTH/aspect;
            }
            else {
                this.left   = -MIN_ORTHO_CAMERA_HEIGHT*aspect;
                this.right  =  MIN_ORTHO_CAMERA_HEIGHT*aspect;
                this.top    =  MIN_ORTHO_CAMERA_HEIGHT;
                this.bottom = -MIN_ORTHO_CAMERA_HEIGHT;
            }
            this.updateProjectionMatrix();
        }
    }
}

class TopPerspectiveCamera extends THREE.PerspectiveCamera {
    constructor() {
        super(60, 4/3, 1, 1000);
        this.position.set(-90*2, -120*2, 200);
        this.up.set(0, 0, 1);
        this.lookAt(new THREE.Vector3(0,0,-120));
    }

    update() {
        this.aspect = window.innerWidth / window.innerHeight;
        this.updateProjectionMatrix();
    }
}

class CarPerspectiveCamera extends THREE.PerspectiveCamera {
    constructor(distance) {
        super(60, 4/3, 1, 1000);
        this.position.set(0, -4/5, 3/5);
        this.position.multiplyScalar(distance);
        this.lookAt(new THREE.Vector3(0, 10, 0));

    }

    update() {
        this.aspect = window.innerWidth / window.innerHeight;
        this.updateProjectionMatrix();
    }

    attachToCar(car) {
        car.add(this);
    }
}