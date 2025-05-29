import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import {MyTree} from './MyTree.js';
import {getRandomFloat, getRandomInt, getRandomOrient, getRandomColorLeaf} from '../Utils.js';

/**
 * MyForest
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {number} [numRows=5] - Number of tree rows in the forest
 * @param {number} [numCols=4] - Number of tree columns in the forest
 * @param {number} [dist=6] - Distance between tree positions in the grid
 */

export class MyForest extends CGFobject {
    constructor(scene, numRows=5, numCols=4, dist=6) {  
        super(scene);

        // Forest constants
        this.FOREST = {
            // Tree height variation
            HEIGHT_VARIATION_MIN: -0.2,
            HEIGHT_VARIATION_MAX: 0.2,
            
            // Tree crown parameters
            CROWN_LEVELS_MIN: 3,
            CROWN_LEVELS_MAX: 8,
            CROWN_SCALE_MIN: 0.2,
            CROWN_SCALE_MAX: 0.7,
            
            // Position randomization
            OFFSET_BUFFER: 1 // Minimum distance from grid edge
        };

        this.scene = scene;
        this.numRows = numRows;
        this.numCols = numCols;
        this.dist = dist;

        // Array to store tree objects and their random offsets
        this.trees = [];
        this.offsets = [];

        this.tree = new MyTree(this.scene);

        this.generateTrees();
        this.generateOffsets();
    }

    generateTrees() {
        const totalTrees = this.numRows * this.numCols;
        for (let i = 0; i < totalTrees; i++) {
            let tree = [getRandomFloat(this.FOREST.HEIGHT_VARIATION_MIN, this.FOREST.HEIGHT_VARIATION_MAX), 
                        getRandomOrient(),
                        getRandomInt(this.FOREST.CROWN_LEVELS_MIN, this.FOREST.CROWN_LEVELS_MAX), 
                        getRandomFloat(this.FOREST.CROWN_SCALE_MIN, this.FOREST.CROWN_SCALE_MAX), 
                        getRandomColorLeaf()];
            this.trees.push(tree);
        }
    }


    generateOffsets() {
        const totalTrees = this.numRows * this.numCols;
        const maxOffset = this.dist / 2 - this.FOREST.OFFSET_BUFFER;
        
        for (let i = 0; i < totalTrees; i++) {
            const offsetX = getRandomFloat(-maxOffset, maxOffset);
            const offsetZ = getRandomFloat(-maxOffset, maxOffset);
            this.offsets.push([offsetX, offsetZ]);
        }
    }
    

    display() {
        let treeIndex = 0;
        // Iterate through grid positions
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.scene.pushMatrix();

                // Calculate base grid position with random offset
                const baseX = this.dist * row + this.offsets[treeIndex][0];
                const baseZ = this.dist * col + this.offsets[treeIndex][1];

                this.scene.translate(baseX, 0, baseZ);
                this.tree.update(this.trees[treeIndex][0], this.trees[treeIndex][1], this.trees[treeIndex][2], this.trees[treeIndex][3], this.trees[treeIndex][4]);
                this.tree.display();
                this.scene.popMatrix();
                treeIndex += 1;
            }
        }
    }
}