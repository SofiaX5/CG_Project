import {CGFobject} from '../lib/CGF.js';
import { MyQuad} from "./MyQuad.js";
/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(scene);
    }
   display() {
        const { scene, quad } = this;

        // Front
        scene.pushMatrix();
        scene.translate(0, 0, 0.5);
        quad.display();
        scene.popMatrix();

        // Back 
        scene.pushMatrix();
        scene.translate(0, 0, -0.5);
        scene.rotate(Math.PI, 0, 1, 0);
        quad.display();
        scene.popMatrix();

        // Left 
        scene.pushMatrix();
        scene.translate(-0.5, 0, 0);
        scene.rotate(-Math.PI / 2, 0, 1, 0);
        quad.display();
        scene.popMatrix();

        // Right 
        scene.pushMatrix();
        scene.translate(0.5, 0, 0);
        scene.rotate(Math.PI / 2, 0, 1, 0);
        quad.display();
        scene.popMatrix();

        // Top 
        scene.pushMatrix();
        scene.translate(0, 0.5, 0);
        scene.rotate(-Math.PI / 2, 1, 0, 0);
        quad.display();
        scene.popMatrix();

        // Bottom
        scene.pushMatrix();
        scene.translate(0, -0.5, 0);
        scene.rotate(Math.PI / 2, 1, 0, 0);
        quad.display();
        scene.popMatrix();
    }
}

