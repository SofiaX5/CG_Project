import {CGFobject} from '../../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, topToBottomRatio = 1.0) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.topToBottomRatio = Math.min(topToBottomRatio, 1.0);

        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; 
        
        let angle = 2 * Math.PI / this.slices;
        let i = 0; 
        let diff_stack = 1 / this.stacks;
    
        for (let i_stack = 0; i_stack <= this.stacks; i_stack++) {
            let stack = i_stack * diff_stack;
            let radiusRatio = 1.0 + stack * (this.topToBottomRatio - 1.0);
   
            for (let i_vert = 0; i_vert <= this.slices; i_vert++) {
                let angle_vert = angle * i_vert;
                let x = Math.cos(angle_vert) * radiusRatio;
                let y = Math.sin(angle_vert) * radiusRatio;
                
                let nx = x;
                let ny = y;
                let nz = 0;
                
                if (this.topToBottomRatio !== 1.0) {
                    let slope = (this.topToBottomRatio - 1.0) / this.stacks;
                    let length = Math.sqrt(x*x + y*y);
                    if (length > 0) {
                        nz = slope * length;
                        let normalLength = Math.sqrt(nx*nx + ny*ny + nz*nz);
                        nx /= normalLength;
                        ny /= normalLength;
                        nz /= normalLength;
                    }
                }
                
                this.vertices.push(x, y, stack);
                this.normals.push(nx, ny, nz);
                
                this.texCoords.push(i_vert/this.slices, i_stack/this.stacks);
   
                if (i_stack < this.stacks && i_vert < this.slices) {
                    let current = i;
                    let next = i + this.slices + 1;
   
                    this.indices.push(current, current + 1, next);
                    this.indices.push(next, current + 1, next + 1);
                }
                i += 1;
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        
        super.display();
        
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
    }
    

    updateBuffers(complexity){
    }
}

