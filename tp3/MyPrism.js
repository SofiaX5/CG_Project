import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
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
            for (let i_vert = 1; i_vert <= this.slices; i_vert++) {
                let angle_vert = angle*i_vert;
                let x = Math.cos(angle_vert);
                let y = Math.sin(angle_vert);
                if (i_vert == this.slices) {
                    x = Math.cos(0);
                    y = Math.sin(0);
                }
                let x_normal = (x0+x)/2, y_normal = (y0+y)/2;
    
                this.vertices.push(x0,y0,stack, x0,y0,stack+diff_stack);
                this.vertices.push(x,y,stack, x,y,stack+diff_stack);
                this.indices.push(i+1, i, i+2);
                this.indices.push(i+1, i+2, i+3);
                this.normals.push(x_normal, y_normal, 0, x_normal, y_normal, 0, x_normal, y_normal, 0, x_normal, y_normal, 0);
    
                x0=x; y0=y;
                i+= 4;
            }
        }

        /*
        console.log("Vértices:", this.vertices);
        console.log("Índices:", this.indices);
        console.log("Normais:", this.normal);
        */

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity){
    }
}

