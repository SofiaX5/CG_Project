import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import {MySphere} from '../geometry/MySphere.js';
import {MyCylinder} from '../geometry/MyCylinder.js';
import {MyCone} from '../geometry/MyCone.js';
import {MyTruncatedPyramid} from '../geometry/MyTruncatedPyramid.js';

/**
 * MyMustache
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyMustache extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        
        // Mustache components
        this.sphere = new MySphere(scene, 16, 8, false);
        this.cylinder = new MyCylinder(scene, 16, 1, 1);
        this.cylinderFunnel = new MyCylinder(scene, 16, 1, 0.7);
        this.cylinderFunnelMore = new MyCylinder(scene, 16, 1, 0.5);

        this.cone = new MyCylinder(scene, 16, 1, 0);
        

        // Mustache dimensions
        this.MUSTACHE = {
            MAIN_WIDTH: 0.05,
            MAIN_HEIGHT: 0.04,
            MAIN_DEPTH: 0.06,
            CENTER_GAP: 0.02,
            CURL_RADIUS: 0.05,
            CURL_THICKNESS: 0.042
        };
        
        // Create mustache appearance
        this.mustacheAppearance = new CGFappearance(scene);
        this.mustacheAppearance.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.mustacheAppearance.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.mustacheAppearance.setSpecular(0.7, 0.7, 0.7, 1.0);
        this.mustacheAppearance.setShininess(50);
        //this.mustacheTexture = new CGFtexture(this.scene, "textures/helicopter/hair.jpg");
        //this.mustacheAppearance.setTexture(this.mustacheTexture);
        //this.mustacheAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display() {
        this.mustacheAppearance.apply();
        
        this.scene.pushMatrix();

        // Left side of mustache
        this.drawLeftSide();
        
        // Right side of mustache
        this.drawRightSide();
        
        this.scene.popMatrix();
    }
    
    drawLeftSide() {

        this.scene.pushMatrix();
        this.scene.translate(-this.MUSTACHE.CENTER_GAP-0.018,-0.008, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinderFunnelMore.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.MUSTACHE.CENTER_GAP/2-0.015, -0.005, 0);
        this.scene.rotate(-Math.PI/2, -Math.PI/10, 1, 0 );
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.MUSTACHE.CENTER_GAP/2 - this.MUSTACHE.MAIN_WIDTH/2 - this.MUSTACHE.CURL_RADIUS/2, -this.MUSTACHE.MAIN_HEIGHT/3, 0);
        this.scene.rotate(-Math.PI/2, -Math.PI/4, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinderFunnel.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.MUSTACHE.CENTER_GAP/2 - this.MUSTACHE.MAIN_WIDTH/2 - this.MUSTACHE.CURL_RADIUS, -this.MUSTACHE.MAIN_HEIGHT, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS*0.7, this.MUSTACHE.CURL_THICKNESS*0.7, this.MUSTACHE.CURL_RADIUS*1.5);
        this.cylinderFunnel.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-this.MUSTACHE.CENTER_GAP/2 - this.MUSTACHE.MAIN_WIDTH - this.MUSTACHE.CURL_RADIUS*1.8, -this.MUSTACHE.MAIN_HEIGHT, 0);
        this.scene.rotate(-Math.PI/2, Math.PI/4, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS*0.49, this.MUSTACHE.CURL_THICKNESS*0.49, this.MUSTACHE.CURL_RADIUS*1.6);
        this.cone.display();
        this.scene.popMatrix();
        
    }
    
    drawRightSide() {

        this.scene.pushMatrix();
        this.scene.translate(this.MUSTACHE.CENTER_GAP+0.018,-0.008, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinderFunnelMore.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.MUSTACHE.CENTER_GAP/2+0.015, -0.005, 0);
        this.scene.rotate(Math.PI/2, Math.PI/10, 1, 0 );
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinder.display();
        this.scene.popMatrix();
      
        this.scene.pushMatrix();
        this.scene.translate(this.MUSTACHE.CENTER_GAP/2 + this.MUSTACHE.MAIN_WIDTH/2 + this.MUSTACHE.CURL_RADIUS/2, -this.MUSTACHE.MAIN_HEIGHT/3, 0);
        this.scene.rotate(Math.PI/2, Math.PI/4, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_THICKNESS, this.MUSTACHE.CURL_RADIUS);
        this.cylinderFunnel.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.MUSTACHE.CENTER_GAP/2 + this.MUSTACHE.MAIN_WIDTH/2 + this.MUSTACHE.CURL_RADIUS, -this.MUSTACHE.MAIN_HEIGHT, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS*0.7, this.MUSTACHE.CURL_THICKNESS*0.7, this.MUSTACHE.CURL_RADIUS*1.5);
        this.cylinderFunnel.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.MUSTACHE.CENTER_GAP/2 + this.MUSTACHE.MAIN_WIDTH + this.MUSTACHE.CURL_RADIUS*1.8, -this.MUSTACHE.MAIN_HEIGHT, 0);
        this.scene.rotate(Math.PI/2, -Math.PI/4, 1, 0 ); 
        this.scene.scale(this.MUSTACHE.CURL_THICKNESS*0.49, this.MUSTACHE.CURL_THICKNESS*0.49, this.MUSTACHE.CURL_RADIUS*1.6);
        this.cone.display();
        this.scene.popMatrix();
        
    }
}