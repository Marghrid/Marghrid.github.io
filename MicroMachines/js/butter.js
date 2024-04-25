class Butter extends GameElement {

    constructor(position, scale) {
        super(position, 0.5*scale*Math.sqrt(BUTTER_X*BUTTER_X + BUTTER_Y*BUTTER_Y));
        this.basic_material = butter_b_material;
        this.phong_material = butter_p_material;
        this.gouraud_material = butter_g_material;

        this.butter_mesh = new THREE.Mesh(butter_geometry, this.phong_material);
        this.add(this.butter_mesh);
        this.rotateZ(Math.random()*Math.PI);
        this.scale.set(scale, scale, scale);
        this.position.set(position.x, position.y, position.z+(BUTTER_Z/2)*scale);
    }
    swapMaterial(material) {
         this.butter_mesh.material = material;
    }
}

function generateButters(numButters, posZ, scale){
    'use strict';

    var butter_r = new Array();
    var positions = new Array();

    // Random positions for the butters on top of the table.
    for(let i = 0; i < numButters; ++i) {
        let posX = TABLE_X*.9*(Math.random() - 0.5);
        let posY = TABLE_Y*.9*(Math.random() - 0.5);

        positions.push(new THREE.Vector3(posX, posY, posZ));
    }

    for(let pos in positions) {
        let butter = new Butter(positions[pos], scale);
        butter_r.push(butter);
    }

    return butter_r;
}
