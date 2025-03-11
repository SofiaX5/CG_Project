import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        
        let angle = 2 * Math.PI / this.slices;
        let i = 0; 
        let diff_stack = 1 / this.stacks;
    
        for (let i_stack = 0; i_stack <= this.stacks; i_stack++) { // Inclui a última stack
            let stack = i_stack * diff_stack;
    
            for (let i_vert = 0; i_vert <= this.slices; i_vert++) {
                let angle_vert = angle * i_vert;
                let x = Math.cos(angle_vert);
                let y = Math.sin(angle_vert);
                let size = Math.sqrt(x*x + y*y);
    
                this.vertices.push(x, y, stack);
                this.normals.push(x / size, y / size, 0);
    
                if (i_stack < this.stacks && i_vert < this.slices) { 
                    let current = i;
                    let next = i + this.slices + 1;
    
                    this.indices.push(current, current + 1, next);
                    this.indices.push(next, current + 1, next + 1);
                }
                i+= 1;
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    

    updateBuffers(complexity){
    }
}

