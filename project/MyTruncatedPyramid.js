import { CGFobject } from '../lib/CGF.js';

/**
 * My Truncated Pyramid
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of vertical divisions 
 * @param baseRadius - radius of the bottom base
 * @param topRadius - radius of the top (cut) face
 * @param height - vertical height of the frustum
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

        // Create vertices for top and bottom circles
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

        // Create indices for the side faces (2 triangles per slice)
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

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity);
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
