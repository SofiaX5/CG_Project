import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
            1, 0, 0,	//1
            1, 1, 0,	//2
            2, 0, 0,	//3
            2, 1, 0,	//4
            3, 1, 0 	//5
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2,
            2, 3, 4,
            4, 3, 5,

            // Other side
            2, 1, 0,
            2, 3, 1,
            4, 3, 2,
            5, 3, 4
         ];

         this.normals = [
            0, 0, -1,  
            0, 0, -1,  
            0, 0, -1,  
            0, 0, -1,  
            0, 0, -1,  
            0, 0, -1   
        ]; 

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
