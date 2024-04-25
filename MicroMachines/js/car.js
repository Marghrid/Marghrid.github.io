class Car extends GameElement {
    constructor(initialPos, scale) {
        super(initialPos.clone(), 8.07*scale);

        this.main_b_material = car_main_b_material;
        this.main_p_material = car_main_p_material;
        this.main_g_material = car_main_g_material;

        this.spoiler_b_material = car_spoiler_b_material;
        this.spoiler_p_material = car_spoiler_p_material;
        this.spoiler_g_material = car_spoiler_g_material;

        this.cockpit_b_material = cockpit_b_material;
        this.cockpit_p_material = cockpit_p_material;
        this.cockpit_g_material = cockpit_g_material;

        this.wheels_b_material = wheels_b_material;
        this.wheels_p_material = wheels_p_material;
        this.wheels_g_material = wheels_g_material;
        
        // Main body (A):
        var main_body_geometry = generate_main_body_geometry();
        this.main_mesh = new THREE.Mesh(main_body_geometry, this.main_p_material);
        this.add(this.main_mesh);

        // Cockpit (B):
        var cockpit_geometry = generate_cockpit_geometry();
        this.cockpit_mesh = new THREE.Mesh(cockpit_geometry, this.cockpit_p_material);
        this.add(this.cockpit_mesh);

        // Spoiler (E):
        var spoiler_geometry = generate_spoiler_geometry();
        this.spoiler_mesh = new THREE.Mesh(spoiler_geometry, this.spoiler_p_material);
        this.add(this.spoiler_mesh);

        //Front wheels:
        var wheels_geometry = generate_wheels_geometry(1.5, 1, 6);
        this.wheel_1_mesh = new THREE.Mesh(wheels_geometry, this.wheels_p_material);
        this.wheel_2_mesh = new THREE.Mesh(wheels_geometry, this.wheels_p_material);
        this.wheel_3_mesh = new THREE.Mesh(wheels_geometry, this.wheels_p_material);
        this.wheel_4_mesh = new THREE.Mesh(wheels_geometry, this.wheels_p_material);
        this.wheel_1_mesh.position.set( 3.49, 4, 1.5);
        this.wheel_2_mesh.position.set(-3.49, 4, 1.5);
        this.wheel_3_mesh.position.set( 3.49, -2, 1.5);
        this.wheel_4_mesh.position.set(-3.49, -2, 1.5);
        this.add(this.wheel_1_mesh);
        this.add(this.wheel_2_mesh);
        this.add(this.wheel_3_mesh);
        this.add(this.wheel_4_mesh);

        var left_headlight_pos = new THREE.Vector3(-2.5, 7, 2);
        var right_headlight_pos = new THREE.Vector3(2.5, 7, 2);

        var left_headlight_target = new THREE.Vector3(-2.5, 15, 0);
        var right_headlight_target = new THREE.Vector3(2.5, 15, 0);

        this.left_headlight = new Headlight(left_headlight_pos, left_headlight_target, 2, 200, Math.PI/6, 0.3);
        this.right_headlight = new Headlight(right_headlight_pos, right_headlight_target, 2, 200, Math.PI/6, 0.3);

        if(!headlightsOn) {
            this.left_headlight.turnOnOff();
            this.right_headlight.turnOnOff();
        }

        this.add(this.left_headlight);
        this.add(this.right_headlight);
        this.add(this.left_headlight.target);
        this.add(this.right_headlight.target);
		
    	this.initialPos = initialPos;
        this.position.set(initialPos.x, initialPos.y, 0)
        this.scale.set(scale, scale, scale);

        this.linearSpeed = 0;
        this.angularSpeed = 0;
        this.acceleration = 0;
        this.DOF = new THREE.Vector3(0, 1, 0);
        this.frictionCoefficient = CAR_FRICTION_COEFFICIENT;

        this.restart = false;


       }

    update(dt) {
        if(upArrow && !downArrow)
            this.acceleration = CAR_ACCELERATION;

        else if(downArrow && !upArrow)
            this.acceleration = -CAR_ACCELERATION;

        else //both true or both false
            this.acceleration = 0;


        if(leftArrow && !rightArrow)
            this.angularSpeed = CAR_ANGULAR_SPEED;

        else if(rightArrow && !leftArrow)
            this.angularSpeed = -CAR_ANGULAR_SPEED;

        else //both true or both false
            this.angularSpeed = 0;

        if(this.position.x < -TABLE_X/2 || this.position.x > TABLE_X/2  ||
           this.position.y < -TABLE_Y/2 || this.position.y > TABLE_Y/2) {
            this.restart = true;
        }

        if(this.restart) {
        	lostLife = true;
        	this.position.set(this.initialPos.x, this.initialPos.y, this.initialPos.z);
        	this.boundingSphereCenter.set(this.initialPos.x, this.initialPos.y, this.boundingSphereCenter.z);
        	this.rotation.set(0, 0, 0);
        	this.DOF = new THREE.Vector3(0, 1, 0);
        	this.restart = false;
        }

        super.update(dt);

        // If either the angular speed or the linear speed of the car are nil,
        //   no rotation should be applied to it.
        if(this.angularSpeed != 0 && this.linearSpeed != 0) {

            // Theta is the angle of the rotation we want to apply to the car.
            var theta = this.linearSpeed * this.angularSpeed * dt;

            //Rotates all vertices and faces
            this.rotateZ(theta);

            //The car's DOF vector must then be updated, to reflect the new "front" direction of the car.
            // This is done by applying to the DOF a rotation of theta.
            var new_DOF = new THREE.Vector3();
            new_DOF.x = Math.cos(theta) * this.DOF.x - Math.sin(theta) * this.DOF.y;
            new_DOF.y = Math.sin(theta) * this.DOF.x + Math.cos(theta) * this.DOF.y;

            this.DOF = new_DOF;
        }
    }

    manageCollision(collidable) {
        if(collidable instanceof Butter)
            this.collideWithButter(collidable);
        if(collidable instanceof Orange)
            this.collideWithOrange(collidable);
        if(collidable instanceof Cheerio)
            this.collideWithCheerio(collidable);
    }

    collideWithButter(butter) {
        this.positionCorrection(butter);
        this.linearSpeed *= .5;
    }

    collideWithCheerio(cheerio) {
        this.positionCorrection(cheerio);
        this.linearSpeed /= 1.2;
    }

    collideWithOrange(orange) {
        this.positionCorrection(orange);
        this.linearSpeed = 0;
        this.restart = true;
    }

    toggleLighting() {
    	if(this.lighting)
    		this.setToBasic();
    	else if(this.isPhong) 
    		this.setToPhong();
    	else
    		this.setToGouraud();
    	this.lighting = !this.lighting;
    }

    toggleShadingType() {
    	if(!this.lighting) return;
    	if(this.isPhong)
    	 	this.setToGouraud();
    	else
    		this.setToPhong();
    	this.isPhong = !this.isPhong;
    }

    setToPhong() {
    	this.swapMainMaterial(this.main_p_material);
    	this.swapSpoilerMaterial(this.spoiler_p_material);
    	this.swapCockpitMaterial(this.cockpit_p_material);
    	this.swapWheelsMaterial(this.wheels_p_material);
    }
    setToBasic() {
    	this.swapMainMaterial(this.main_b_material);
    	this.swapSpoilerMaterial(this.spoiler_b_material);
    	this.swapCockpitMaterial(this.cockpit_b_material);
    	this.swapWheelsMaterial(this.wheels_b_material);
    }
    setToGouraud() {
    	this.swapMainMaterial(this.main_g_material);
    	this.swapSpoilerMaterial(this.spoiler_g_material);
    	this.swapCockpitMaterial(this.cockpit_g_material);
    	this.swapWheelsMaterial(this.wheels_g_material);
    }

    swapMainMaterial(material) {
    	this.main_mesh.material = material;
    }
    swapSpoilerMaterial(material) {
    	this.spoiler_mesh.material = material;
    }
    swapCockpitMaterial(material) {
    	this.cockpit_mesh.material = material;
    }
    swapWheelsMaterial(material) {
    	this.wheel_1_mesh.material = material;
    	this.wheel_2_mesh.material = material;
    	this.wheel_3_mesh.material = material;
    	this.wheel_4_mesh.material = material;
    }

    toggleHeadlights() {
    	this.left_headlight.turnOnOff();
    	this.right_headlight.turnOnOff();
    }
}

function generate_cockpit_geometry() {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 2,  3, 3),
		new THREE.Vector3(-2,  3, 3),
		new THREE.Vector3( 2, -3, 3),
		new THREE.Vector3(-2, -3, 3),
		new THREE.Vector3( 2,  0, 4.5),
		new THREE.Vector3(-2,  0, 4.5),
		new THREE.Vector3( 2,  0, 3),
		new THREE.Vector3(-2,  0, 3),
		new THREE.Vector3( 2, -3, 4.5),
		new THREE.Vector3(-2, -3, 4.5),
	);
	
	geometry.faces.push(
		new THREE.Face3( 0, 4, 6), //lado
		new THREE.Face3( 4, 8, 6),
		new THREE.Face3( 6, 8, 2),

		new THREE.Face3( 1, 7, 5), //outro lado
		new THREE.Face3( 5, 7, 9),
		new THREE.Face3( 7, 3, 9),

		new THREE.Face3( 1, 4, 0), //topo
		new THREE.Face3( 1, 5, 4),
		new THREE.Face3( 4, 5, 8),
		new THREE.Face3( 5, 9, 8),

		new THREE.Face3(9, 3, 8), //trás
		new THREE.Face3(3, 2, 8)
	);
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	return geometry;
}

function generate_main_body_geometry() {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( 3, 7, 1),
		new THREE.Vector3(-3, 7, 1),
		new THREE.Vector3( 3, 5, 1),
		new THREE.Vector3(-3, 5, 1),
		new THREE.Vector3( 3, 5, 3),
		new THREE.Vector3(-3, 5, 3),
		new THREE.Vector3( 3,-3, 1),
		new THREE.Vector3(-3,-3, 1),
		new THREE.Vector3( 3,-4, 3),
		new THREE.Vector3(-3,-4, 3),
		new THREE.Vector3( 3,-3, 3),
		new THREE.Vector3(-3,-3, 3),
	);
	
	geometry.faces.push(
		new THREE.Face3(0, 4, 2), //lado
		new THREE.Face3(2, 4, 10),
		new THREE.Face3(2, 10, 6),
		new THREE.Face3(6, 10, 8),

		new THREE.Face3(1, 3, 5), //lado
		new THREE.Face3(3, 11,5),
		new THREE.Face3(3, 7, 11),
		new THREE.Face3(7, 9, 11),

		new THREE.Face3(0, 1, 4), //topo
		new THREE.Face3(4, 1, 5),
		new THREE.Face3(4, 5, 8),
		new THREE.Face3(8, 5, 9),

		new THREE.Face3(9, 7, 8),
		new THREE.Face3(8, 7, 6)
	);
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
}

function generate_spoiler_geometry() {
	var geometry = new THREE.Geometry();
	//geometry.vertices.push(new THREE.Vector3(0, -3, 3), new THREE.Vector3(-3, -6, 3), new THREE.Vector3(3, -6, 3));
	//geometry.faces.push(new THREE.Face3( 0, 1, 2));
	geometry.vertices.push(
		new THREE.Vector3(-4,-7,5.5),
		new THREE.Vector3( 4,-7,5.5),
		new THREE.Vector3( 4,-5,5.5),
		new THREE.Vector3(-4,-5,5.5),
	

		new THREE.Vector3(-4,-7,5),
		new THREE.Vector3( 4,-7,5),
		new THREE.Vector3( 4,-5,5),
		new THREE.Vector3(-4,-5,5),
	);

	geometry.faces.push(
		new THREE.Face3(0, 1, 3),
		new THREE.Face3(2, 3, 1),

		new THREE.Face3(4, 7, 5),
		new THREE.Face3(6, 5, 7),

		new THREE.Face3(6, 7, 3),
		new THREE.Face3(3, 2, 6),

		new THREE.Face3(5, 6, 2),
		new THREE.Face3(2, 1, 5),

		new THREE.Face3(0, 3, 7),
		new THREE.Face3(7, 4, 0),

		new THREE.Face3(0, 4, 1),
		new THREE.Face3(1, 4, 5),
	);

	geometry.vertices.push(
		new THREE.Vector3(-1.5,-3,3),
		new THREE.Vector3(-2,  -3,3),
		new THREE.Vector3(-2,  -4,3),
		new THREE.Vector3(-1.5,-4,3),

		new THREE.Vector3(-1.5,-5,5),
		new THREE.Vector3(-2,  -5,5),
		new THREE.Vector3(-2,  -6,5),
		new THREE.Vector3(-1.5,-6,5),
	);

	geometry.faces.push(
		new THREE.Face3(9, 10, 13),
		new THREE.Face3(14, 13, 10),

		new THREE.Face3(8,  9, 12),
		new THREE.Face3(13, 12, 9),

		new THREE.Face3(8, 12, 11),
		new THREE.Face3(15, 11, 12),

		new THREE.Face3(14, 10, 15),
		new THREE.Face3(11, 15, 10),
	);

	geometry.vertices.push(
		new THREE.Vector3(2,  -3,3),
		new THREE.Vector3(1.5,-3,3),
		new THREE.Vector3(1.5,-4,3),
		new THREE.Vector3(2,  -4,3),

		new THREE.Vector3(2,  -5,5),
		new THREE.Vector3(1.5,-5,5),
		new THREE.Vector3(1.5,-6,5),
		new THREE.Vector3(2,  -6,5),
	);

	geometry.faces.push(
		new THREE.Face3(17, 18, 21),
		new THREE.Face3(22, 21, 18),

		new THREE.Face3(16,  17, 20),
		new THREE.Face3(21, 20, 17),

		new THREE.Face3(16, 20, 19),
		new THREE.Face3(23, 19, 20),

		new THREE.Face3(22, 18, 23),
		new THREE.Face3(19, 23, 18),
	);

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
}

function generate_wheels_geometry(radius, depth, segments) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(-depth/2, 0, 0),
		new THREE.Vector3( depth/2, 0, 0));

	geometry.vertices.push(
			new THREE.Vector3(-depth/2, radius, 0),
			new THREE.Vector3( depth/2, radius, 0));

	for(let i = 1; i < segments; ++i) {
		let theta = i*2*Math.PI/segments;
		geometry.vertices.push(
			new THREE.Vector3(-depth/2, radius*Math.cos(theta), radius*Math.sin(theta)),
			new THREE.Vector3( depth/2, radius*Math.cos(theta), radius*Math.sin(theta)));

		geometry.faces.push(
			new THREE.Face3(0, 2*i+2, 2*i),
			new THREE.Face3(1, 2*i+1, 2*i+3),
			new THREE.Face3(2*i, 2*i+2, 2*i+1),
			new THREE.Face3(2*i+2, 2*i+3, 2*i+1)
		)
	}
	let i = segments;
	geometry.faces.push(
		new THREE.Face3(0, 2, 2*i),
		new THREE.Face3(1, 2*i+1, 3),
		new THREE.Face3(2*i, 2, 2*i+1),
		new THREE.Face3(2, 3, 2*i+1)
	);
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
}