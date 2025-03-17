import {CGFobject} from '../lib/CGF.js';
import { MyQuad} from "./MyQuad.js";
/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top, front, right, back, left, bottom) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.textures = { top, front, right, back, left, bottom };
        
    }

   display() {
        const { scene, textures, quad } = this;
        const { gl } = this.scene;

        // Front
        scene.pushMatrix();
        scene.translate(0, 0, 0.5);
        textures.front.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();

        // Back 
        scene.pushMatrix();
        scene.translate(0, 0, -0.5);
        scene.rotate(Math.PI, 0, 1, 0);
        textures.back.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();

        // Left 
        scene.pushMatrix();
        scene.translate(-0.5, 0, 0);
        scene.rotate(-Math.PI / 2, 0, 1, 0);
        textures.left.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();

        // Right 
        scene.pushMatrix();
        scene.translate(0.5, 0, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);
        textures.right.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();

        // Top 
        scene.pushMatrix();
        scene.translate(0, 0.5, 0);
        scene.rotate(-Math.PI / 2, 1, 0, 0);
        textures.top.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();

        // Bottom
        scene.pushMatrix();
        scene.translate(0, -0.5, 0);
        scene.rotate(Math.PI / 2, 1, 0, 0);
        textures.bottom.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 
            scene.useNearestFilter ? gl.NEAREST : gl.LINEAR);        quad.display();
        scene.popMatrix();
    }
}

