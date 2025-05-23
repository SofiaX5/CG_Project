import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import {MyPlane} from '../geometry/MyPlane.js';

/**
 * MyWindow
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {string|CGFtexture} texture - Path to texture image or preloaded CGFtexture object
 */
export class MyWindow extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.scene = scene;
        
        this.plane = new MyPlane(scene, 20);
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.appearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.appearance.setShininess(10.0);
        
        // Handle both string paths and preloaded textures
        if (typeof texture === 'string') {
            this.texture = new CGFtexture(scene, texture);
        } else {
            this.texture = texture;
        }
        this.appearance.setTexture(this.texture);
    }
    

    display() {
        this.scene.pushMatrix();
        
        this.appearance.apply();
        this.scene.scale(1, 1, 0.1);
        this.plane.display();
        
        this.scene.popMatrix();
    }
}
