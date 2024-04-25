class Orange extends GameElement {
    constructor(position, scale) {
        super(position, ORANGE_RADIUS * scale);
        this.radius = ORANGE_RADIUS * scale;

        this.basic_material = orange_b_material;
        this.phong_material = orange_p_material;
        this.gouraud_material = orange_g_material;
        
        this.stalk_flat_material = stalk_material;

        this.orange_mesh = new THREE.Mesh(orange_geometry, this.phong_material);
        this.add(this.orange_mesh);
        this.position.set(position.x, position.y, position.z + this.radius);
        this.scale.set(scale, scale, scale);

        var stalk = new THREE.Mesh(stalk_geometry, this.stalk_flat_material);
        stalk.position.set(0, 0, ORANGE_RADIUS+0.5);
        this.add(stalk);

        var leaf = new THREE.Mesh(leaf_geometry, this.stalk_flat_material);
        leaf.position.set(0, 2, 1);
        stalk.add(leaf);


        // Compute random initial speed:
        this.linearSpeed = Math.random() * (ORANGE_MAX_VELOCITY - ORANGE_MIN_VELOCITY) + ORANGE_MIN_VELOCITY;

        // Create DOF with random orientation;
        var theta = Math.random() * 2*Math.PI;
        this.DOF = new THREE.Vector3();
        this.DOF.x = Math.cos(theta);
        this.DOF.y = Math.sin(theta);

        // Time from one speed increment to the next.
        this.speedTimer = 0;
        // Counts the time since the orange fell off the table.
        this.reappearTimer = 0;
        // Time from the falling of the orange until it reappears. It's recalculated everytime the orange falls.
        this.reappearTime = Math.random() * (ORANGE_MAX_REAPPEAR_TIME - ORANGE_MIN_REAPPEAR_TIME) + ORANGE_MIN_REAPPEAR_TIME;
        // Flag signalling wether or not the orange is on the table.
        this.waitingToReappear = false;

    }

    update(dt) {
        this.speedTimer += dt;

        if(this.waitingToReappear) /* The orange has fallen */ {
            this.reappearTimer += dt;
            if(this.reappearTimer >= this.reappearTime) {
                this.waitingToReappear = false;

                /* New random position and orientation for the orange */
                this.rotation.set(0, 0, 0);
                this.position.x = TABLE_X*.9*(Math.random() - 0.5);
                this.position.y = TABLE_Y*.9*(Math.random() - 0.5);
                this.boundingSphereCenter.set(this.position.x, this.position.y, this.boundingSphereCenter.z);
                var theta = Math.random() * 2*Math.PI;
                this.DOF = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);

                table.add(this);
            }
        }

        if(this.speedTimer >= ORANGE_SPEED_INCREMENT_TIME_INT) {
            this.speedTimer = 0;
            this.linearSpeed += ORANGE_SPEED_INCREMENT;
        }

        // Linear movement:
        super.update(dt);

        // Check if it has fallen of the table
        if((this.position.x < -TABLE_X/2 || this.position.x > TABLE_X/2  ||
            this.position.y < -TABLE_Y/2 || this.position.y > TABLE_Y/2) &&
            !this.waitingToReappear) {
            table.remove(this);
            // Compute new random time for the orange to be disappeared.
            this.reappearTime = Math.random() * (ORANGE_MAX_REAPPEAR_TIME - ORANGE_MIN_REAPPEAR_TIME) + ORANGE_MIN_REAPPEAR_TIME;
            this.reappearTimer = 0;
            this.waitingToReappear = true;
        }

        // Rotational movement:
        var rotationAxis = this.DOF.clone().cross(new THREE.Vector3(0, 0, -1));
        this.rotateOnAxis(rotationAxis, this.linearSpeed*dt/this.radius);
    }

    swapMaterial(material) {
         this.orange_mesh.material = material;
    }
}

function generateOranges(numOranges, posZ, scale) {
    'use strict';

    var orange_r = new Array();
    var positions = new Array();

    // Random positions for the oranges on top of the table
    for(let i = 0; i < numOranges; ++i) {
        let posX = TABLE_X*.9*(Math.random() - 0.5);
        let posY = TABLE_Y*.9*(Math.random() - 0.5);

        positions.push(new THREE.Vector3(posX, posY, posZ));
    }

    for(let pos in positions) {
        let orange = new Orange(positions[pos], scale);
        orange_r.push(orange);
    }
    return orange_r;
}
