class Cheerio extends GameElement {
    constructor(position, scale) {
        super(position, (CHEERIO_RADIUS + CHEERIO_TUBE)*scale);
        this.basic_material = cheerio_b_material;
        this.phong_material = cheerio_p_material;
        this.gouraud_material = cheerio_g_material;
        this.cheerio_mesh = new THREE.Mesh(cheerio_geometry, this.phong_material);
        this.add(this.cheerio_mesh);
        this.scale.set(scale, scale, scale);
        this.position.set(position.x, position.y, position.z + CHEERIO_TUBE*scale);
        this.frictionCoefficient = CHEERIO_FRICTION_COEFFICIENT;
        this.previousDOF = new THREE.Vector3();
        this.previousSpeed = 0;
    }

    update(dt) {
        this.collided = false;
        super.update(dt);

    }

    manageCollision(collidable) {
        if(collidable instanceof Car)
                this.collideWithCar(collidable);
        if(collidable instanceof Cheerio)
            this.collideWithCheerio(collidable);
    }

    collideWithCar(car) {
        this.linearSpeed = car.linearSpeed;
        this.DOF = car.DOF.clone();
    }

    collideWithCheerio(other_cheerio) {
        this.collided = true;
        if(other_cheerio.collided) {
          this.positionCorrection(other_cheerio);
          this.linearSpeed = other_cheerio.previousSpeed;
          this.DOF = other_cheerio.previousDOF;

        }
        else {
            this.previousSpeed = this.linearSpeed;
            this.previousDOF = this.DOF.clone();
            this.linearSpeed = other_cheerio.linearSpeed;
            this.DOF = other_cheerio.DOF.clone();
        }
    }

    swapMaterial(material) {
         this.cheerio_mesh.material = material;
    }
}
