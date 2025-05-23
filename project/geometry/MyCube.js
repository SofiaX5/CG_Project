import {CGFobject} from '../../lib/CGF.js';
/**
 * MyCustomCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCustomCube extends CGFobject {
    constructor(scene, width = 1, height = 1, depth = 1) {
        super(scene);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.initBuffers();
    }
   
    initBuffers() {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const halfDepth = this.depth / 2;
        
        this.vertices = [
            // Bot
            halfWidth, -halfHeight, halfDepth,     
            -halfWidth, -halfHeight, halfDepth,   
            halfWidth, -halfHeight, -halfDepth,   
            -halfWidth, -halfHeight, -halfDepth,  
            // Top
            halfWidth, halfHeight, halfDepth,      
            -halfWidth, halfHeight, halfDepth,     
            halfWidth, halfHeight, -halfDepth,     
            -halfWidth, halfHeight, -halfDepth     
        ];
        
        this.indices = [
            // Top
            4, 7, 5,
            4, 6, 7,
            // Bot
            0, 1, 3,
            0, 3, 2,
            // Right 
            0, 2, 6,
            0, 6, 4,
            // Left
            3, 1, 5,
            3, 5, 7,
            // Front
            0, 4, 5,
            0, 5, 1,
            // Back
            6, 2, 3,
            6, 3, 7
        ];

        this.normals = [
            // Bot
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            // Top
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ];

        this.texCoords = [
            // Bot
            1, 1,
            0, 1,
            1, 0,
            0, 0,
            // Top
            1, 1,
            0, 1,
            1, 0,
            0, 0
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}