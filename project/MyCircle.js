import {CGFobject} from '../lib/CGF.js';

/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCircle extends CGFobject {
    constructor(scene, slices = 30, minS = 0, maxS = 1, minT = 0, maxT = 1) {
        super(scene);
        this.slices = slices;
        this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        const angleIncrement = (2 * Math.PI) / this.slices;

        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleIncrement;
            const x = 0.5 * Math.cos(angle);
            const y = 0.5 * Math.sin(angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);

            const s = 0.5 + 0.5 * Math.cos(angle);
            const t = 0.5 + 0.5 * Math.sin(angle);
            this.texCoords.push(s, t);
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i + 2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
