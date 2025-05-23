import {CGFobject} from '../../lib/CGF.js';
/**
 * MyCustomParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
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
    
    updateBuffers() {
        this.initBuffers();
        this.initGLBuffers();
    }
}