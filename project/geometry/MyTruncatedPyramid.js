import { CGFobject } from '../../lib/CGF.js';

/**
 * My Truncated Pyramid
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
* @param {number} slices - number of divisions around the Y axis
* @param {number} stacks - number of vertical divisions
* @param {number} baseRadius - radius of the bottom base
* @param {number} topRadius - radius of the top (cut) face
* @param {number} height - vertical height of the truncated pyramid
 */
export class MyTruncatedPyramid extends CGFobject {
    constructor(scene, slices, stacks, baseRadius, topRadius, height) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const angleInc = 2 * Math.PI / this.slices;

        // Generate vertices in pairs: bottom ring vertex followed by top ring vertex
        for (let i = 0; i <= this.slices; i++) {
            const ang = i * angleInc;
            const cosA = Math.cos(ang);
            const sinA = Math.sin(ang);

            // Bottom ring vertex
            this.vertices.push(cosA * this.baseRadius, 0, -sinA * this.baseRadius);
            this.normals.push(cosA, 0, -sinA);
            this.texCoords.push(i / this.slices, 1);

            // Top ring vertex
            this.vertices.push(cosA * this.topRadius, this.height, -sinA * this.topRadius);
            this.normals.push(cosA, 0, -sinA);
            this.texCoords.push(i / this.slices, 0);
        }

        // Connect vertices to form side faces using triangle pairs
        // Each slice creates a quad made of 2 triangles
        for (let i = 0; i < this.slices; i++) {
            const b1 = 2 * i;
            const t1 = b1 + 1;
            const b2 = 2 * (i + 1);
            const t2 = b2 + 1;

            // First triangle of quad
            this.indices.push(b1, b2, t2);

            // Second triangle of quad
            this.indices.push(b1, t2, t1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
