import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MyCone} from './MyCone.js';
import {MyCylinder} from './MyCustomCylinder.js';
import {MyTruncatedPyramid} from './MyTruncatedPyramid.js';
//import {} from './Utils.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTree extends CGFobject {
    constructor(scene, rotatAngle=0, rotatAxis="x", height=5, radius=0.5, leafColor=[0.1, 0.3, 0.1]) {
        super(scene);
        this.scene = scene;
        this.rotatAngle = rotatAngle;
        this.rotatAxis = rotatAxis;
        this.height = height;
        
        this.logColor = [0.3, 0.2, 0.2];//[0.3, 0.2, 0.1];
        this.leafColor = leafColor;
        this.numLeaf = (height-(this.height*0.2));

        this.logTexture = new CGFtexture(scene, "textures/tree/log.jpg");
        this.leafTexture = new CGFtexture(scene, "textures/tree/leaf.jpg");
        
        this.logAppearance = new CGFappearance(scene);
        this.logAppearance.setAmbient(this.logColor[0] * 0.5, this.logColor[1] * 0.5, this.logColor[2] * 0.5, 1);
        this.logAppearance.setDiffuse(this.logColor[0], this.logColor[1], this.logColor[2], 1);
        this.logAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.logAppearance.setShininess(10.0);
        this.logAppearance.setTexture(this.logTexture);

        this.leafAppearance = new CGFappearance(scene);
        this.leafAppearance.setAmbient(this.leafColor[0] * 0.5, this.leafColor[1] * 0.5, this.leafColor[2] * 0.5, 1);
        this.leafAppearance.setDiffuse(this.leafColor[0], this.leafColor[1], this.leafColor[2], 1);
        this.leafAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.leafAppearance.setShininess(10.0);
        this.leafAppearance.setTexture(this.leafTexture);

        this.log = new MyCylinder(scene, 20, 1, radius*2);
        this.leaves = [];

        for (let i = 0; i < this.numLeaf-1; i++) {
            let myTruncatedPyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * 2.5, radius * 2.5 * 0.4, (height * 0.9) / this.numLeaf);
            this.leaves.push(myTruncatedPyramid);
        }
        let pyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * 2.5, 0, (height * 2) / this.numLeaf );
        this.leaves.push(pyramid);
    }
    

    display() {
        this.scene.pushMatrix();
        // Transformations
        if (this.rotatAxis == "x") {
            this.scene.rotate(this.rotatAngle, 1, 0, 0);
        } else if (this.rotatAxis == "z") {
            this.scene.rotate(this.rotatAngle, 0, 0, 1);
        }
        
        // Log
        this.scene.pushMatrix();
        this.scene.rotate( Math.PI/2, -1, 0, 0);
        this.logAppearance.apply();
        this.scene.scale(0.5, 0.5, this.height*0.25);
        this.log.display();
        this.scene.popMatrix();
        
        // Leaves
        for (let i = 0; i < this.numLeaf; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, (this.height*0.2)+i, 0);
            this.leafAppearance.apply();
            this.leaves[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}