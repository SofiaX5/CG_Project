import {CGFobject} from '../../lib/CGF.js';

/**
 * MyCustomParallelogram
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} [width=3] - Total width of the parallelogram
 * @param {number} [height=1] - Height of the parallelogram
 * @param {number} [depth=1] - Depth/thickness of the parallelogram
 * @param {number} [offset=1] - Horizontal offset creating the parallelogram slant
 */

export class MyCustomParallelogram extends CGFobject {
    constructor(scene, width = 3, height = 1, depth = 1, offset = 1) {
        super(scene);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.offset = offset; 
        this.initBuffers();
    }
   
    initBuffers() {
        const halfDepth = this.depth / 2;

        // Define 8 vertices: 4 for back face, 4 for front face
        // Offset creates the parallelogram shape by shifting top vertices
        this.vertices = [
            0, 0, -halfDepth,                  // 0
            this.width - this.offset, 0, -halfDepth,  // 1
            this.offset, this.height, -halfDepth,     // 2
            this.width, this.height, -halfDepth,      // 3
            0, 0, halfDepth,                  // 4
            this.width - this.offset, 0, halfDepth,  // 5
            this.offset, this.height, halfDepth,     // 6
            this.width, this.height, halfDepth       // 7
        ];
        
        // Define triangles for all 6 faces (back, front, bottom, top, left, right)
        this.indices = [
            0, 1, 2, 
            1, 3, 2, 
            
            4, 6, 5,  
            5, 6, 7, 
            
            0, 5, 1,
            0, 4, 5,
            
            2, 3, 7,
            2, 7, 6,
            
            0, 2, 6,
            0, 6, 4,
            
            1, 5, 7,
            1, 7, 3
        ];

        // Texture coordinates for all 8 vertices
        // Each face uses standard quad UV mapping (0,0 to 1,1)
        this.texCoords = [
            0, 1,       // bottom left
            1, 1,       // bottom right
            0, 0,       // top left
            1, 0,       // top right

            0, 1,       // bottom left
            1, 1,       // bottom right
            0, 0,       // top left
            1, 0        // top right
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}