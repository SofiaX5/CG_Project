import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param {Array} coords 
 */
export class MyTriangle extends CGFobject {
	constructor(scene, coords) {
		super(scene);
		this.initBuffers();

		if (coords != undefined)
			this.updateTexCoords(coords);
	}
	
	initBuffers() {
		this.vertices = [
			-1, 1, 0,
			-1, -1, 0,
			1, -1, 0,
		];

		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		this.normals = [
            0, 0, 1,  
            0, 0, 1,  
            0, 0, 1  
        ];


		this.texCoords = [
			0.5, 0,    
			0, 1,    
			1, 1  
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

