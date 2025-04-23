import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MySphere} from './MySphere.js';
import {MyCone} from './MyCone.js';
import {MyPlane} from './MyPlane.js';
import {MyCircle} from './MyCircle.js';
import {MyPyramid} from './MyPyramid.js';
import {MyCylinder} from './MyCustomCylinder.js';
import {MyCustomCube} from './MyCustomCube.js';
import {MyCustomParallelogram} from './MyCustomParallelogram.js';

/**
 * MyHeli - Helicopter model for firefighting
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // Dimensions
        this.bodyLength = 6;
        this.bodyWidth = 2.5;
        this.bodyHeight = 2.5;
        
        this.tailLength = 8;
        this.tailRadius = 0.4;
        
        this.mainRotorRadius = 5;
        this.tailRotorRadius = 3;
        
        this.bucketRadius = 0.8;
        this.bucketHeight = 1.2;
        
        // Animation variables
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.ropeLength = 4;
        
        // Position
        this.x = 0;
        this.y = 0;
        this.z = 0;
        
        this.initObjects();
        this.initMaterials();
    }
    
    initObjects() {
        this.sphere = new MySphere(this.scene, 20, 20);
        this.cone = new MyCone(this.scene, 20, 1, 1);
        this.plane = new MyPlane(this.scene, 1);
        this.circle = new MyCircle(this.scene, 30);
        this.cylinder = new MyCylinder(this.scene, 20, 5); 
        this.bucketCylinder = new MyCylinder(this.scene, 20, 5,0.7, 0.1); 
        this.pyramid = new MyPyramid(this.scene, 4, 1, 1);
        this.cube = new MyCustomCube(this.scene, 5, 3, 2);
        this.parallelogram = new MyCustomParallelogram(this.scene, 7, 3, 2, 3);

    }
    
    initMaterials() {
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(0.5, 0.1, 0.1, 1);
        this.bodyMaterial.setDiffuse(0.8, 0.2, 0.2, 1);
        this.bodyMaterial.setSpecular(0.4, 0.4, 0.4, 1);
        this.bodyMaterial.setShininess(50);
        this.bodyTexture = new CGFtexture(this.scene, "textures/helicopter/body.jpg");
        this.bodyMaterial.setTexture(this.bodyTexture);
        
        // Glass material - Transparent blue
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.2, 0.2, 0.3, 0.9);
        this.glassMaterial.setDiffuse(0.2, 0.2, 0.8, 0.5);
        this.glassMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.glassMaterial.setShininess(150);
        
        // Metal material - Dark grey
        this.metalMaterial = new CGFappearance(this.scene);
        this.metalMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.metalMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.metalMaterial.setSpecular(0.7, 0.7, 0.7, 1);
        this.metalMaterial.setShininess(100);
        
        // Blade material - Black
        this.bladeMaterial = new CGFappearance(this.scene);
        this.bladeMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.bladeMaterial.setDiffuse(0.2, 0.2, 0.2, 1);
        this.bladeMaterial.setSpecular(0.3, 0.3, 0.3, 1);
        this.bladeMaterial.setShininess(50);
        
        // Bucket material - Yellow
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.5, 0.5, 0.1, 1);
        this.bucketMaterial.setDiffuse(0.9, 0.9, 0.2, 1);
        this.bucketMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.bucketMaterial.setShininess(20);
        
        // Water material - Blue
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.1, 0.1, 0.5, 0.8);
        this.waterMaterial.setDiffuse(0.2, 0.2, 0.8, 0.5);
        this.waterMaterial.setSpecular(0.5, 0.5, 0.8, 1);
        this.waterMaterial.setShininess(80);
    }
    
    update(deltaTime) {
        this.mainRotorAngle += deltaTime * 0.01;
        this.tailRotorAngle += deltaTime * 0.02;
    }
    
    display() {
        this.scene.pushMatrix();
        
        this.scene.translate(this.x, this.y, this.z);
        
        this.drawBody();
        
        this.drawMainRotor();
        
        this.drawTail();
        
        this.drawLandingGear();
        
        this.drawBucket();
        
        this.scene.popMatrix();
    }
    
    drawBody() {
        this.scene.pushMatrix();
        
        // Main body 
        this.bodyMaterial.apply();
        this.scene.scale(this.bodyLength/2.5, this.bodyHeight/2, this.bodyWidth/2);
        this.sphere.display();
        
        this.scene.translate(this.bodyLength/9, -this.bodyHeight/8 , 0);
        this.scene.scale(this.bodyLength/9, this.bodyHeight/5, this.bodyWidth/4);
        this.sphere.display();
        
        this.scene.popMatrix();
        /*
        // Cockpit - glass dome at the front
        this.scene.pushMatrix();
        this.glassMaterial.apply();
        this.scene.translate(this.bodyLength/3, this.bodyHeight/4, 0);
        this.scene.scale(this.bodyLength/4, this.bodyHeight/3, this.bodyWidth/3);
        this.sphere.display();
        this.scene.popMatrix();*/
    }
    
    drawMainRotor() {
        this.scene.pushMatrix();
        
        // Rotor hub
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/8, this.bodyHeight/3 , 0);
        this.scene.scale(0.4, 0.4, 0.4);
        this.cube.display();

        this.metalMaterial.apply();
        this.scene.translate(0, this.bodyHeight/2 , 0);
        this.sphere.display();

        

        // Rotor blades
        this.bladeMaterial.apply();
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        
        // First blade
        this.scene.pushMatrix();
        this.scene.rotate(0, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Second blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Third blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Fourth blade
        this.scene.pushMatrix();
        this.scene.rotate(3*Math.PI/2, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
    
    drawTail() {
        // Tail boom
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/3+1, this.bodyHeight/5, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(this.tailRadius, this.tailLength, this.tailRadius);
        this.cone.display();
        this.scene.popMatrix();
        
        // Tail fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/2 - this.tailLength/1.2 + 2, this.bodyHeight/2-0.02, 0);
        this.scene.rotate(-Math.PI/6, 0, 0, 1);
        this.scene.scale(0.3, 0.2, 0.2);
        this.parallelogram.display();
        this.scene.popMatrix();

        // Tail rotor hub and blades 
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/2 - this.tailLength/1.2 + 2, this.bodyHeight/2-0.02, 0);
        
        // Rotor hub
        this.metalMaterial.apply();
        this.scene.translate(0.65, 0, 0.2);

        this.scene.scale(0.15, 0.1, 0.1);
        this.sphere.display();
        
        // Tail rotor blades
        this.bladeMaterial.apply();
        this.scene.rotate(this.tailRotorAngle, 0, 0, 1);
        
        // First tail blade
        this.scene.pushMatrix();
        this.scene.translate(0, this.tailRotorRadius/2, 0);
        this.scene.scale(0.2, this.tailRotorRadius, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        
        // Second tail blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, this.tailRotorRadius/2, 0);
        this.scene.scale(0.2, this.tailRotorRadius, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
    
    drawLandingGear() {
        // Landing gear struts - left side
        this.scene.pushMatrix();
        this.metalMaterial.apply();

        //left front
        this.scene.pushMatrix();
        this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, this.bodyWidth/2 - 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();
        
        //left back
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, this.bodyWidth/2 - 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, -Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //left connector
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bodyHeight/1.5, this.bodyWidth/2);
        this.scene.rotate(0, 1, 0, Math.PI/3);
        this.scene.scale(0.9, 0.05, 0.2);
        this.cube.display();
        this.scene.popMatrix();

        //right front
        this.scene.pushMatrix();
        this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, -this.bodyWidth/2 + 0.2);
        this.scene.rotate(Math.PI/2, -1, 0, Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //right back
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, -this.bodyWidth/2 + 0.2);
        this.scene.rotate(Math.PI/2, -1, 0, -Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //right connector
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bodyHeight/1.5, -this.bodyWidth/2);
        this.scene.rotate(0, -1, 0, Math.PI/3);
        this.scene.scale(0.9, 0.05, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawBucket() {
        // Rope
        /* // ideia fixe para bucket holder
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        this.scene.translate(0, -this.bodyHeight, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.scale(1, this.ropeLength, 1);
        this.cylinder.display();
        this.scene.popMatrix();*/
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        this.scene.translate(0, -this.bodyHeight/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, this.ropeLength);
        this.cylinder.display();
        this.scene.popMatrix();
        
        // Bucket body - fix the orientation
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, -this.bodyHeight/2 - this.ropeLength - this.bucketHeight/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.bucketRadius, this.bucketRadius, this.bucketRadius);
        this.bucketCylinder.display(); 
        this.scene.popMatrix();
        
        // Bucket bottom
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.scene.translate(0, -this.bodyHeight/2 - this.ropeLength - this.bucketHeight, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.bucketRadius, this.bucketRadius, this.bucketRadius);
        this.circle.display();
        this.scene.popMatrix();
        
        // Water - semi-transparent blue
        this.scene.pushMatrix();
        this.waterMaterial.apply();
        this.scene.translate(0, -this.bodyHeight/2 - this.ropeLength - this.bucketHeight*0.5, 0);
        this.scene.scale(this.bucketRadius*0.9, this.bucketHeight*0.2, this.bucketRadius*0.9);
        this.sphere.display();
        this.scene.popMatrix();
    }
    
    // Method to position the helicopter at a specific location
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}