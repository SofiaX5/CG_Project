import {CGFobject} from '../../lib/CGF.js';

/**
 * MySphere
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} slices - number of divisions around the longitude (horizontal)
 * @param {number} stacks - number of divisions from equator to pole (vertical)
 * @param {boolean} [inside=false] - if true, normals point inward for inside view
 */

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inside = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.inside = inside;

        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Calculate angular increments for longitude and latitude
        let diff_angle_x = (2 * Math.PI) / this.slices;    // 360º / slices
        let diff_angle_y = (Math.PI / 2) / this.stacks;    // 90º / stacks

        // Generate vertices from south pole to north pole, slice by slice
        for (let stack = -this.stacks; stack <= this.stacks; stack++) {
            let phi = stack * diff_angle_y;
            let cosPhi = Math.cos(phi);
            let sinPhi = Math.sin(phi);

            for (let slice = 0; slice <= this.slices; slice++) {
            let theta = slice * diff_angle_x;
            let cosTheta = Math.cos(theta);
            let sinTheta = Math.sin(theta);

            let x = cosTheta * cosPhi;
            let y = sinPhi;
            let z = sinTheta * cosPhi;

            // Add vertex position, normal (flipped if inside view), and texture coordinates
            this.vertices.push(x, y, z);
            this.normals.push(this.inside ? -x : x, this.inside ? -y : y, this.inside ? -z : z);
            this.texCoords.push(1 - (slice / this.slices), 1 - ((stack + this.stacks) / (2 * this.stacks)));  // u -> dividimos em slices, v -> nºstack/total_stacks(entre 0-1)
            }
        }

        for (let stack = 0; stack < 2 * this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
            let low = stack * (this.slices + 1) + slice;    // this.slices + 1 -> num of vertexs in a level
            let high = low + this.slices + 1;

            // Create triangles with correct winding order based on inside/outside view
                if (this.inside) {
                    if (stack == 0) {
                        this.indices.push(low, high + 1, high);
                    } else if (stack == (2 * this.stacks) - 1) {
                        this.indices.push(low, low + 1, high);
                    } else {
                        this.indices.push(low, low + 1, high);
                        this.indices.push(high, low + 1, high + 1);
                    }
                }
                else{
                // Polos
                    if (stack == 0) {
                        this.indices.push(low, high, high + 1);
                    } else if (stack == (2 * this.stacks) - 1) {
                        this.indices.push(low, high, low + 1);
                    
                    } else {
                        this.indices.push(low, high, low + 1);
                        this.indices.push(high, high + 1, low + 1);
                    }
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

