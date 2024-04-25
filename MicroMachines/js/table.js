class Table extends THREE.Object3D {

    constructor(posX, posY, posZ) {
        super();
        this.position.set(posX, posY, posZ);
        this.basic_material = table_top_b_material;
        this.phong_material = table_top_p_material;
        this.gouraud_material = table_top_g_material;

        this.table_top_mesh = new THREE.Mesh(table_top_geometry, this.phong_material);
        this.table_top_mesh.position.z = -TABLE_Z/2;
        this.add(this.table_top_mesh);

        this.lighting = true;
        this.isPhong = true;
    }

    swapMaterial(material) {
        this.table_top_mesh.material = material;
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
