import {CGFobject, CGFappearance, CGFtexture, CGFshader} from '../../lib/CGF.js';
import {MyWindow} from './MyWindow.js';
import {MyPlane} from '../geometry/MyPlane.js';
import {MyCircle} from '../geometry/MyCircle.js';
import {MyCylinder} from '../geometry/MyCylinder.js';
import {MyCube} from '../geometry/MyCube.js';
import {MySphere} from '../geometry/MySphere.js';

/**
 * MyPerson
 * @constructor
* @param {CGFscene} scene - Reference to MyScene object
 */
export class MyPerson extends CGFobject {
    constructor(scene, texturePath, armsUp = false) {
        super(scene);
        this.scene = scene;
        this.texturePath = texturePath;
        this.armsUp = armsUp;

        // Person constants
        this.PERSON = {
            HEAD_SIZE: 0.15,
            TORSO_WIDTH: 0.3,
            TORSO_HEIGHT: 0.4,
            TORSO_DEPTH: 0.15,
            ARM_WIDTH: 0.1,
            ARM_HEIGHT: 0.4,
            ARM_DEPTH: 0.1,
            LEG_WIDTH: 0.12,
            LEG_HEIGHT: 0.4,
            LEG_DEPTH: 0.12
        };

        this.lastTime = 0;

        this.texture = new CGFtexture(scene, this.texturePath);

        this.plane = new MyPlane(scene, 20);
        this.circle = new MyCircle(scene, 30);
        this.cylinder = new MyCylinder(scene, 30, 1, 0.7);
        this.cube = new MyCube(scene);
        this.sphere = new MySphere(scene, 30, 30);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);        
        this.drawHead();
        this.drawBody();
        this.drawArms();
        this.drawLegs();
        this.scene.popMatrix();
    }

    update(t) {
        if (this.lastTime === 0) {
            this.lastTime = t;
            return;
        }
        this.lastTime = t;

        const timeFactor = t / 1000.0 % 1000;
    }

    drawHead() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.PERSON.TORSO_HEIGHT - this.PERSON.HEAD_SIZE / 3, 0);
        this.scene.scale(this.PERSON.HEAD_SIZE, this.PERSON.HEAD_SIZE, this.PERSON.HEAD_SIZE);
        this.sphere.display();
        this.scene.popMatrix();
    }

        
    drawBody() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.scale(this.PERSON.TORSO_WIDTH, this.PERSON.TORSO_HEIGHT, this.PERSON.TORSO_DEPTH);
        this.cube.display();
        this.scene.popMatrix();
    }

    drawArms() {
        this.scene.pushMatrix();
        this.scene.translate(-(this.PERSON.TORSO_WIDTH/2 + this.PERSON.ARM_WIDTH/2), 
                            this.PERSON.TORSO_HEIGHT/2 - this.PERSON.ARM_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.ARM_WIDTH, this.PERSON.ARM_HEIGHT, this.PERSON.ARM_DEPTH);
        if (this.armsUp) {
            this.scene.translate(0, this.PERSON.TORSO_HEIGHT + this.PERSON.ARM_HEIGHT, 0);
        }
        this.cube.display();
        this.scene.popMatrix();

        // Right arm
        this.scene.pushMatrix();
        this.scene.translate((this.PERSON.TORSO_WIDTH/2 + this.PERSON.ARM_WIDTH/2), 
                            this.PERSON.TORSO_HEIGHT/2 - this.PERSON.ARM_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.ARM_WIDTH, this.PERSON.ARM_HEIGHT, this.PERSON.ARM_DEPTH);
        if (this.armsUp) {
            this.scene.translate(0, this.PERSON.TORSO_HEIGHT + this.PERSON.ARM_HEIGHT, 0);
        }
        this.cube.display();
        this.scene.popMatrix();
    }

    drawLegs() {
        // Left leg
        this.scene.pushMatrix();
        this.scene.translate(-this.PERSON.LEG_WIDTH/2, -this.PERSON.LEG_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.LEG_WIDTH, this.PERSON.LEG_HEIGHT, this.PERSON.LEG_DEPTH);
        this.cube.display();
        this.scene.popMatrix();

        // Right leg
        this.scene.pushMatrix();
        this.scene.translate(this.PERSON.LEG_WIDTH/2, -this.PERSON.LEG_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.LEG_WIDTH, this.PERSON.LEG_HEIGHT, this.PERSON.LEG_DEPTH);
        this.cube.display();
        this.scene.popMatrix();
    }
        
    getLastTime() {
        return this.lastTime;
    }

    setLastTime(t) {
        this.lastTime = t;
    }


}