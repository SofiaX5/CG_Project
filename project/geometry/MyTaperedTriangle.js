import {CGFobject} from '../../lib/CGF.js';

export class MyTaperedTriangle extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}

	initBuffers() {
		const segments = 5;
		const height = 1.0;
		const baseWidth  = 1.5;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (let i = 0; i <= segments; i++) {
			const y = (i / segments) * height;
			const width = baseWidth * (1 - (i / segments));
			
			this.vertices.push(-width / 2, y, 0); 
			this.vertices.push(width / 2, y, 0);

			this.normals.push(0, 0, 1);
			this.normals.push(0, 0, 1);

			this.texCoords.push(0, 1.0 - i / segments);
			this.texCoords.push(1, 1.0 - i / segments);
		}

		for (let i = 0; i < segments; i++) {
			const idx = i * 2;
			this.indices.push(idx, idx + 1, idx + 2);
			this.indices.push(idx + 1, idx + 3, idx + 2);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
