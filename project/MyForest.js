import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MyTree} from './MyTree.js';

/**
 * MyTForest
 * @constructor
 * @param scene - Reference to MyScene object
 * @param numRows
 * @param numCols
 * @param dist - Distance between the trees
 */
export class MyForest extends CGFobject {
    constructor(scene, numRows=5, numCols=4, dist=5) {  
        super(scene);
        this.scene = scene;
        this.numRows = numRows;
        this.numCols = numCols;
        this.dist = dist;

        this.trees = [];
        for (let i = 0; i < numRows*numCols; i++) {
            let tree = new MyTree(scene);
            this.trees.push(tree);
            //getRandomInt(min, max)
        }
    }
    

    display() {
        let i = 0;
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.scene.pushMatrix();
                this.scene.translate(this.dist*row, 0, this.dist*col);
                this.trees[i].display();
                this.scene.popMatrix();
                i++;
            }
        }
    }
}