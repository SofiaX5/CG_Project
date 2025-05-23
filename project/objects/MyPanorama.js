import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import {MySphere} from '../geometry/MySphere.js'
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama  extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        this.sphere = new MySphere(scene, 60, 60, true);

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0, 0, 0, 1);
        this.appearance.setDiffuse(0, 0, 0, 1);
        this.appearance.setSpecular(0, 0, 0, 1);
        this.appearance.setEmission(1, 1, 1, 1); // só emissãoo
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
        

        const cameraPos = this.scene.camera.position; //vamos posicionar a esfera na camera
        //this.scene.translate(cameraPos[0], cameraPos[1], cameraPos[2]);
        
        this.scene.scale(this.radius, this.radius, this.radius);
                
        this.sphere.display();
        this.scene.popMatrix();
    }
    

}

