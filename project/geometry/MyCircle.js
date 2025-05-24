import {CGFobject} from '../../lib/CGF.js';

/**
 * MyCircle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} [slices] - Number of divisions around the circle (default: 30)
 * @param {number} [minS] - Minimum S texture coordinate (0 to 1) (default: 0)
 * @param {number} [maxS] - Maximum S texture coordinate (0 to 1) (default: 1)
 * @param {number} [minT] - Minimum T texture coordinate (0 to 1) (default: 0)
 * @param {number} [maxT] - Maximum T texture coordinate (0 to 1) (default: 1)
 * @param {boolean} [halfCircle=false] - Whether to create a half circle (true) or full circle (false) (default: false)
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
        const angleRange = this.halfCircle ? Math.PI : 2 * Math.PI;
        const angleStep = angleRange / this.slices;
        const startAngle = this.halfCircle ? Math.PI : 0;

        // Front face vertices
        for (let i = 0; i <= this.slices; i++) {
            const angle = startAngle + i * angleStep;
            const x = 0.5 * Math.cos(angle);
            const y = 0.5 * Math.sin(angle);

            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);

            // Texture coordinates 
            const s = this.halfCircle ? 
                0.5 + 0.5 * Math.cos(angle) : 
                0.5 + 0.5 * Math.cos(angle);
            const t = this.halfCircle ?
                0.5 - 0.5 * Math.sin(angle) :
                0.5 + 0.5 * Math.sin(angle);
            
            this.texCoords.push(s, t);
        }

        // Front face indices
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i + 2);
        }

        // Create back face for both full and half circles
        // Center point for back face
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5);
        
        const backFaceCenterIndex = this.slices + 2;
        
        // Back face vertices
        for (let i = 0; i <= this.slices; i++) {
            const angle = startAngle + i * angleStep;
            const x = 0.5 * Math.cos(angle);
            const y = 0.5 * Math.sin(angle);
            
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1);
            
            // Texture coordinates 
            const s = this.halfCircle ? 
                0.5 + 0.5 * Math.cos(angle) : 
                0.5 + 0.5 * Math.cos(angle);
            const t = this.halfCircle ?
                0.5 - 0.5 * Math.sin(angle) :
                0.5 + 0.5 * Math.sin(angle);
            
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

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}