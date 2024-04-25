class CheerioTrack extends THREE.Object3D {

    constructor(posZ, approxDistance, scale) {
        super();
        'use strict';

        var track1_out = [  new THREE.Vector3(-190,  100, posZ),
                            new THREE.Vector3(-150,  140, posZ),
                            new THREE.Vector3( 150,  140, posZ),
                            new THREE.Vector3( 190,  100, posZ),
                            new THREE.Vector3( 190,  -30, posZ),
                            new THREE.Vector3( 150,  -70, posZ),
                            new THREE.Vector3( 100,  -70, posZ),
                            new THREE.Vector3(  30, -140, posZ),
                            new THREE.Vector3(-150, -140, posZ),
                            new THREE.Vector3(-190, -100, posZ)
        ];

        var track1_in = [   new THREE.Vector3(-150,   80, posZ),
                            new THREE.Vector3(-130,  100, posZ),
                            new THREE.Vector3( 130,  100, posZ),
                            new THREE.Vector3( 150,   80, posZ),
                            new THREE.Vector3( 150,  -10, posZ),
                            new THREE.Vector3( 130,  -30, posZ),
                            new THREE.Vector3(  80,  -30, posZ),
                            new THREE.Vector3(  10, -100, posZ),
                            new THREE.Vector3(-130, -100, posZ),
                            new THREE.Vector3(-150,  -80, posZ),
        ];


        // Tracks that will be drawn:
        var outerTrack = track1_out;
        var innerTrack = track1_in;
        this.cheerios = new Array()

        var positions = new Array();

        for(let i = 0; i < outerTrack.length; ++i)
            positions = positions.concat(computeCheerioPositions(
                outerTrack[i], outerTrack[(i+1)%outerTrack.length], approxDistance));

        for(let i = 0; i < innerTrack.length; ++i)
            positions = positions.concat(computeCheerioPositions(
                innerTrack[i], innerTrack[(i+1)%innerTrack.length], approxDistance));

        for(let pos in positions) {
            let cheerio = new Cheerio(positions[pos], scale);
            this.add(cheerio);
            this.cheerios.push(cheerio)
        }

        this.startingPoint = new THREE.Vector3(-170, 0, 0)
    }

     get_cheerios() {
        return this.cheerios;
    }
}

// computeCheerioPositions distributes an appropriate number of cheerios between vectorA and vectorB,
//   and returns their positions
function computeCheerioPositions(vectorA, vectorB, approxDistance) {
    'use strict';

    var length = vectorA.distanceTo(vectorB);

    //The number of cheerios that fit in this line:
    var numberOfCheerios = length/approxDistance;
    numberOfCheerios = numberOfCheerios.toFixed(0);

    var positions = new Array();
    for (let i = 1; i <= numberOfCheerios; ++i) {

        let position = new THREE.Vector3();

        // https://threejs.org/docs/index.html#api/math/Vector3.lerpVectors
        position.lerpVectors(vectorA, vectorB, i/numberOfCheerios);

        positions.push(position);
    }
    return positions;
}
