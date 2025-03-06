import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // Bottom Face
            0.5, -0.5, 0.5,	    // 0 - Right Front
            -0.5, -0.5, 0.5,	// 1 - Left Front 
            0.5, -0.5, -0.5,	// 2 - Right Back
            -0.5, -0.5, -0.5,   // 3 - Left Back

            // Top Face
            0.5, 0.5, 0.5,	    // 4 - Right Front
            -0.5, 0.5, 0.5,	    // 5 - Left Front
            0.5, 0.5, -0.5,	    // 6 - Right Back
            -0.5, 0.5, -0.5     // 7 - Left Back
        ];

        this.indices = [
            // Top Face - COUNTER
            4, 7, 5,
            4, 6, 7,

            // Bottom Face - CLOCK
            0, 1, 3,
            0, 3, 2, 

            // Right Face - COUNTER
            0, 2, 6,
            0, 6, 4,

            // Left Face - CLOCK
            3, 1, 5,
            3, 5, 7,

            // Front Face - COUNTER
            0, 4, 5,
            0, 5, 1,
            
            // Back Face - CLOCK
            6, 2, 3,
            6, 3, 7
            
        ];
        this.normals = [
            0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1
        ];


        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

