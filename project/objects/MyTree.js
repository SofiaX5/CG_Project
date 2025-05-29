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
 * @param {number} [radius=0.5] - Base radius of the tree trunk
 * @param {Array} [leafColor=[0.1, 0.3, 0.1]] - RGB color array for leaves [r,g,b]
 */

export class MyTree extends CGFobject {
    constructor(scene, rotatAngle=0, rotatAxis="x", height=5, radius=0.5, leafColor=[0.1, 0.3, 0.1]) {
        super(scene);

        this.TREE = {
            TRUNK_HEIGHT_RATIO: 0.25,     
            LEAF_START_HEIGHT: 0.2,       
            LEAF_BASE_SCALE: 2.5,        
            LEAF_TOP_SCALE: 0.4,        
            TOP_LEAF_HEIGHT_RATIO: 2.0
        };

        this.scene = scene;
        
        // Current rendering parameters 
        this.rotatAngle = rotatAngle;
        this.rotatAxis = rotatAxis;
        this.height = height;
        this.radius = radius;
        this.leafColor = leafColor;
        
        this.logColor = [0.3, 0.2, 0.2];
        
        this.logTexture = new CGFtexture(scene, "textures/tree/log.jpg");
        this.leafTexture = new CGFtexture(scene, "textures/tree/leaf.jpg");
        
        this.logAppearance = new CGFappearance(scene);
        this.logAppearance.setAmbient(this.logColor[0] * 0.5, this.logColor[1] * 0.5, this.logColor[2] * 0.5, 1);
        this.logAppearance.setDiffuse(this.logColor[0], this.logColor[1], this.logColor[2], 1);
        this.logAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.logAppearance.setShininess(10.0);
        this.logAppearance.setTexture(this.logTexture);

        this.updateLeafAppearance();
        
        this.createStaticGeometry();
    }
    
    createStaticGeometry() {
        this.log = new MyCylinder(this.scene, 20, 1, 1.0);
        
        this.maxLeafSections = 10; 
        this.allLeaves = [];
        
        for (let i = 0; i < this.maxLeafSections; i++) {
            let truncatedPyramid = new MyTruncatedPyramid(this.scene, 8, 1, 1.0, 0.4, 1.0);
            this.allLeaves.push(truncatedPyramid);
        }
        
        this.topLeaf = new MyTruncatedPyramid(this.scene, 8, 1, 1.0, 0, 1.0);
    }
    
    updateLeafAppearance() {
        this.leafAppearance = new CGFappearance(this.scene);
        this.leafAppearance.setAmbient(this.leafColor[0] * 0.5, this.leafColor[1] * 0.5, this.leafColor[2] * 0.5, 1);
        this.leafAppearance.setDiffuse(this.leafColor[0], this.leafColor[1], this.leafColor[2], 1);
        this.leafAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.leafAppearance.setShininess(10.0);
        this.leafAppearance.setTexture(this.leafTexture);
    }
    
    update(rotatAngle, rotatAxis, height, radius, leafColor) {
        // Just update parameters
        this.rotatAngle = rotatAngle;
        this.rotatAxis = rotatAxis;
        this.height = height;
        this.radius = radius;
        
        // Only update leaf appearance if color changed
        if (this.leafColor[0] !== leafColor[0] || 
            this.leafColor[1] !== leafColor[1] || 
            this.leafColor[2] !== leafColor[2]) {
            this.leafColor = leafColor;
            this.updateLeafAppearance();
        }
    }
    
    display() {
        this.scene.pushMatrix();
        
        // Apply rotation
        if (this.rotatAxis === "x") {
            this.scene.rotate(this.rotatAngle, 1, 0, 0);
        } else if (this.rotatAxis === "z") {
            this.scene.rotate(this.rotatAngle, 0, 0, 1);
        }
        
        // Display trunk with scaling
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, -1, 0, 0);
        this.logAppearance.apply();
        this.scene.scale(this.radius, this.radius, this.height * this.TREE.TRUNK_HEIGHT_RATIO);
        this.log.display();
        this.scene.popMatrix();
        
        // Calculate how many leaf sections to show
        const numLeafSections = Math.min(Math.floor(this.height - (this.height * 0.2)), this.maxLeafSections);
        
        // Display leaf sections
        this.leafAppearance.apply();
        for (let i = 0; i < numLeafSections - 1; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, (this.height * 0.2) + i, 0);
            
            // Calculate scale for this section
            const baseScale = this.radius * this.TREE.LEAF_BASE_SCALE;
            const heightScale = (this.height * 0.9) / numLeafSections;
            this.scene.scale(baseScale, heightScale, baseScale);
            
            this.allLeaves[i].display();
            this.scene.popMatrix();
        }
        
        // Display top leaf (pyramid)
        if (numLeafSections > 0) {
            this.scene.pushMatrix();
            this.scene.translate(0, (this.height * 0.2) + numLeafSections - 1, 0);
            
            const topScale = this.radius * this.TREE.LEAF_BASE_SCALE;
            const topHeight = (this.height * this.TREE.TOP_LEAF_HEIGHT_RATIO) / numLeafSections;
            this.scene.scale(topScale, topHeight, topScale);
            
            this.topLeaf.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}