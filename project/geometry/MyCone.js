import {CGFobject} from '../../lib/CGF.js';

/**
* MyCone
* @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} slices - number of divisions around the Y axis
 * @param {number} height - height of the cone
 * @param {number} radius - radius of the cone base
*/

export class MyCone extends CGFobject {
    constructor(scene, slices, height, radius) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.radius = radius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        // Create vertices around the base circle and connect to apex
        for(var i = 0; i < this.slices; i++){
            this.vertices.push(Math.cos(ang)*this.radius, 0, -Math.sin(ang)*this.radius);

            // Base vertex texture coordinate
            this.texCoords.push(i/this.slices, 0);
            this.indices.push(i, (i+1) % this.slices, this.slices);

            // Normal pointing outward from cone surface
            this.normals.push(Math.cos(ang), Math.cos(Math.PI/4.0), -Math.sin(ang));
            this.texCoords.push(i/this.slices, 1);
            ang+=alphaAng;
        }
        this.vertices.push(0,this.height,0);

        // Apex vertex at top of cone
        this.texCoords.push(0.5, 1.0);
        this.normals.push(0,1,0);

        // Apex vertex texture coordinate
        this.texCoords.push(0.5, 0);


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}


