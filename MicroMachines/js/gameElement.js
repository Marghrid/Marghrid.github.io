class GameElement extends THREE.Object3D {
    constructor(bsCenter, bsRadius) {
        super();
        // Position refers to world coordinates.
        this.position.set(new THREE.Vector3());
        this.boundingSphereCenter = new THREE.Vector3(bsCenter.x, bsCenter.y, 0);
        this.boundingSphereRadius = bsRadius;
        this.linearSpeed = 0;
        this.acceleration = 0;
        this.DOF = new THREE.Vector3(0, 1, 0);
        this.velocity = this.DOF.clone();
        this.frictionCoefficient = 0;
        /* TEST: to help visualize the bounding spheres, make them a white circle:
        var geometry = new THREE.CircleGeometry(this.boundingSphereRadius, 100);
        var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(bsCenter.x, bsCenter.y, 0);
        gameScene.add(mesh)*/

        this.basic_material = default_b_material;
        this.phong_material = default_p_material;
        this.gouraud_material = default_g_material;

        this.isPhong = true;
        this.lighting = true;
    }

    update(dt) {
        // Speed is updated, according to the values of acceleration and linear speed
        //  gotten from the keyboard keys
        this.linearSpeed += (this.acceleration - this.frictionCoefficient*this.linearSpeed)*dt;

        // The velocity should have the same direction as the DOF vector.
        // We then give it its length, by multiplying the normalized DOF vector
        //   by the computed linear speed.
        // Finally the car's new position should be the result of the sum of the car's
        //   old position with the computed velocity vector.
        this.velocity = this.DOF.clone();
        this.velocity.multiplyScalar(this.linearSpeed*dt);
        this.position.add(this.velocity);
        this.boundingSphereCenter.add(this.velocity);
    }

    positionCorrection(gameElement) {
        // Reposition the car so that it isn't overlapping the butter
        var collisionCorrection = new THREE.Vector3();
        // collisionCorrection: vector with direction from center of butter to center of car,
        //  and length equal to the overlaping lenght.
        collisionCorrection.subVectors(this.boundingSphereCenter, gameElement.boundingSphereCenter);
        collisionCorrection.normalize();
        collisionCorrection.multiplyScalar(this.boundingSphereRadius +
            gameElement.boundingSphereRadius - this.boundingSphereCenter.distanceTo(gameElement.boundingSphereCenter));

        // Adjust the car and its bounding box's positions, by substracting the overlapping quantity.
        this.position.add(collisionCorrection);
        this.boundingSphereCenter.add(collisionCorrection);

        // Perpendicular correction. Because the velocity is not always parallel to the direction of the collision,
        //  the perpendicular component of speed must also be subtracted from the position of the car.
        //var perpendicularCorrection = new THREE.Vector3(-collisionCorrection.y, collisionCorrection.x, 0);
        //perpendicularCorrection.normalize();
        //perpendicularCorrection.multiplyScalar(perpendicularCorrection.dot(this.velocity));
        //this.position.sub(perpendicularCorrection);
        //this.boundingSphereCenter.sub(perpendicularCorrection);
    }

    // Checks if bounding spheres touch.
    checkCollision(gameElement) {
        return (Math.pow(this.boundingSphereRadius + gameElement.boundingSphereRadius, 2) >=
                    this.boundingSphereCenter.distanceToSquared(gameElement.boundingSphereCenter));
    }

    // Defined on suclasses:
    manageCollision(gameElement) {
    }

    swapMaterial(material) {
    	// Swaps the material for all the meshes;
    }

    toggleLighting() {
        if(this.lighting)
    	   this.swapMaterial(this.basic_material);
        else if(this.isPhong)
            this.swapMaterial(this.phong_material);
        else
            this.swapMaterial(this.gouraud_material);
        this.lighting = !this.lighting;
    }

    toggleShadingType() {
        if(!this.lighting) return;
    	if(this.isPhong)
    		this.swapMaterial(this.gouraud_material);
    	else
    		this.swapMaterial(this.phong_material);
    	this.isPhong = !this.isPhong;
    }
}
