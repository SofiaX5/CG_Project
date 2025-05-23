import {CGFobject} from '../../lib/CGF.js';

/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the circle
 * @param minS - Minimum S texture coordinate
 * @param maxS - Maximum S texture coordinate
 * @param minT - Minimum T texture coordinate
 * @param maxT - Maximum T texture coordinate
 * @param halfCircle - Boolean to determine if it should be a half circle (default false)
 */
export class MyCircle extends CGFobject {
    constructor(scene, slices = 30, minS = 0, maxS = 1, minT = 0, maxT = 1, halfCircle = false) {
        super(scene);
        this.slices = slices;
        this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;
        this.halfCircle = halfCircle;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Center point for front face
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        // Determine angle range based on halfCircle flag
        const startAngle = this.halfCircle ? Math.PI : 0;
        const endAngle = this.halfCircle ? 2 * Math.PI : 2 * Math.PI;
        const angleIncrement = (endAngle - startAngle) / this.slices;

        // Front face vertices
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

        // Front face indices
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i + 2);
        }

        // If not a half circle, create back face
        if (!this.halfCircle) {
            
            // Center point for back face
            this.vertices.push(0, 0, 0);
            this.normals.push(0, 0, -1); 
            this.texCoords.push(0.5, 0.5);
            
            const backFaceCenterIndex = this.slices + 2;
            
            // Back face vertices
            for (let i = 0; i <= this.slices; i++) {
                const angle = startAngle + i * angleIncrement;
                const x = 0.5 * Math.cos(angle);
                const y = 0.5 * Math.sin(angle);
                
                this.vertices.push(x, y, 0);
                this.normals.push(0, 0, -1); 
                
                const s = 0.5 + 0.5 * Math.cos(angle);
                const t = 0.5 + 0.5 * Math.sin(angle);
                this.texCoords.push(s, t);
            }
            
            // Back face indices
            for (let i = 0; i < this.slices; i++) {
                this.indices.push(
                    backFaceCenterIndex,
                    backFaceCenterIndex + i + 2,
                    backFaceCenterIndex + i + 1
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
