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
        
        let angle = 2*Math.PI / this.slices;
        let x0 = Math.cos(0);
        let y0 = Math.sin(0);
        let i = 0; let diff_stack = 1 / this.stacks;

        for (let i_stack = 0; i_stack < this.stacks; i_stack++) {
            let stack = i_stack * diff_stack;
            this.vertices.push(x0,y0,stack, x0,y0,stack+diff_stack);
            let size = Math.sqrt(x0*x0 + y0*y0);
            this.normals.push(x0/size, y0/size, 0, x0, y0, 0);
            for (let i_vert = 1; i_vert <= this.slices; i_vert++) {
                let angle_vert = angle*i_vert;
                let x = Math.cos(angle_vert);
                let y = Math.sin(angle_vert);
                if (i_vert == this.slices) {
                    x = Math.cos(0);
                    y = Math.sin(0);
                }
                size = Math.sqrt(x*x + y*y);

                this.vertices.push(x,y,stack, x,y,stack+diff_stack);
                this.indices.push(i+1, i, i+2);
                this.indices.push(i+1, i+2, i+3);
                this.normals.push(x/size, y/size, 0, x/size, y/size, 0);
    
                x0=x; y0=y;
                i+= 2;
            }
        }
        this.indices.push(i+1, i, i+2);
        this.indices.push(i+1, i+2, i+3);


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity){
    }
}

