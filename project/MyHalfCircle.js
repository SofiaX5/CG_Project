import {CGFobject} from '../lib/CGF.js';

/**
 * MyHalfCircle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHalfCircle extends CGFobject {
    constructor(scene, slices = 20) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
   
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.25, 0.5);
 
        const angleStep = Math.PI / this.slices;
        const startAngle = Math.PI;
        
        for (let i = 0; i <= this.slices; i++) {
            const angle = startAngle - i * angleStep;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);
            
            const s = 0.5 + 0.5 * x;
            const t = 0.5 - 0.5 * y;
            this.texCoords.push(s, t);
        }
        
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i + 2);
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 2, i + 1);
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}