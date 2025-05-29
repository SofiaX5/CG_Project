import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import {MyCylinder} from '../geometry/MyCylinder.js';
import {MyTruncatedPyramid} from '../geometry/MyTruncatedPyramid.js';

/**
 * MyTree
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} [rotatAngle=0] - Rotation angle in radians
 * @param {string} [rotatAxis="x"] - Axis of rotation ('x' or 'z')
 * @param {number} [height=5] - Total height of the tree
 * @param {number} [radius=0.5] - Base radius of the tree log
 * @param {number[]} [leafColor=[0.1, 0.3, 0.1]] - RGB color of leaves
 */
export class MyTree extends CGFobject {
    constructor(scene, rotatAngle=0, rotatAxis="x", height=5, radius=0.5, leafColor=[0.1, 0.3, 0.1]) {
        super(scene);

        // Tree constants
        this.TREE = {
            TRUNK_HEIGHT_RATIO: 0.25,     
            LEAF_START_HEIGHT: 0.2,       
            LEAF_BASE_SCALE: 2.5,        
            LEAF_TOP_SCALE: 0.4,        
            TOP_LEAF_HEIGHT_RATIO: 2.0
        };

        this.scene = scene;
        this.rotatAngle = rotatAngle;
        this.rotatAxis = rotatAxis;
        this.height = height;
        
        // Colors
        this.logColor = [0.3, 0.2, 0.2];
        this.leafColor = leafColor;

        // Calculate number of leaf sections
        this.numLeaf = (height-(this.height*0.2));

        // Load textures
        this.logTexture = new CGFtexture(scene, "textures/tree/log.jpg");
        this.leafTexture = new CGFtexture(scene, "textures/tree/leaf.jpg");
        
        // log (trunk) appearance
        this.logAppearance = new CGFappearance(scene);
        this.logAppearance.setAmbient(this.logColor[0] * 0.5, this.logColor[1] * 0.5, this.logColor[2] * 0.5, 1);
        this.logAppearance.setDiffuse(this.logColor[0], this.logColor[1], this.logColor[2], 1);
        this.logAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.logAppearance.setShininess(10.0);
        this.logAppearance.setTexture(this.logTexture);

        // leaf appearance
        this.leafAppearance = new CGFappearance(scene);
        this.leafAppearance.setAmbient(this.leafColor[0] * 0.5, this.leafColor[1] * 0.5, this.leafColor[2] * 0.5, 1);
        this.leafAppearance.setDiffuse(this.leafColor[0], this.leafColor[1], this.leafColor[2], 1);
        this.leafAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.leafAppearance.setShininess(10.0);
        this.leafAppearance.setTexture(this.leafTexture);

        // log geometry
        this.log = new MyCylinder(scene, 20, 1, radius*2);
        this.leaves = [];

        // leaf sections
        for (let i = 0; i < this.numLeaf-1; i++) {
            let myTruncatedPyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * this.TREE.LEAF_BASE_SCALE, radius * this.TREE.LEAF_BASE_SCALE * this.TREE.LEAF_TOP_SCALE, (height * 0.9) / this.numLeaf);
            this.leaves.push(myTruncatedPyramid);
        }

        // Create top leaf (pyramid)
        let pyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * this.TREE.LEAF_BASE_SCALE, 0, (height * this.TREE.TOP_LEAF_HEIGHT_RATIO) / this.numLeaf );
        this.leaves.push(pyramid);
    }
    
    
    update(rotatAngle, rotatAxis, height, radius, leafColor) {
        this.rotatAngle = rotatAngle;
        this.rotatAxis = rotatAxis;
        this.height = height;

        this.leafColor = leafColor;
        this.leafAppearance = new CGFappearance(this.scene);
        this.leafAppearance.setAmbient(this.leafColor[0] * 0.5, this.leafColor[1] * 0.5, this.leafColor[2] * 0.5, 1);
        this.leafAppearance.setDiffuse(this.leafColor[0], this.leafColor[1], this.leafColor[2], 1);
        this.leafAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.leafAppearance.setShininess(10.0);
        this.leafAppearance.setTexture(this.leafTexture);

        this.numLeaf = (height-(this.height*0.2));
        this.log = new MyCylinder(this.scene, 20, 1, radius*2);
        this.leaves = [];

        for (let i = 0; i < this.numLeaf-1; i++) {
            let myTruncatedPyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * this.TREE.LEAF_BASE_SCALE, radius * this.TREE.LEAF_BASE_SCALE * this.TREE.LEAF_TOP_SCALE, (height * 0.9) / this.numLeaf);
            this.leaves.push(myTruncatedPyramid);
        }
        let pyramid = new MyTruncatedPyramid(this.scene, 8, 1, radius * this.TREE.LEAF_BASE_SCALE, 0, (height * this.TREE.TOP_LEAF_HEIGHT_RATIO) / this.numLeaf );
        this.leaves.push(pyramid);
    }
    

    display() {
        this.scene.pushMatrix();
        
        // Apply initial rotation
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