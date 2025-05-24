import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MySphere} from '../geometry/MySphere.js'
/**
 * MyPanorama
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {CGFtexture} texture - Texture to be applied to the panorama
 */
export class MyPanorama  extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;

        // Create sphere geometry (inverted normals for inside view)
        this.sphere = new MySphere(scene, 60, 60, true);

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0, 0, 0, 1);
        this.appearance.setDiffuse(0, 0, 0, 1);
        this.appearance.setSpecular(0, 0, 0, 1);
        this.appearance.setEmission(1, 1, 1, 1); 
        this.appearance.setTexture(this.texture);

        this.radius = 200;
    }

    updateTexture(newTexture) {
        this.texture = newTexture;
        this.appearance.setTexture(this.texture);
    }
    
    display() {
        this.appearance.apply();
        this.scene.pushMatrix();
        

        this.scene.scale(this.radius, this.radius, this.radius);
                
        this.sphere.display();
        this.scene.popMatrix();
    }
    

}

