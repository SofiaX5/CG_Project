import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MyWindow} from './MyWindow.js';
import {MyPlane} from './MyPlane.js';
import {MyCircle} from './MyCircle.js';

/**
 * MyBuilding
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, sideFloors, windowsPerFloor, windowTexture, buildingColor, buildingAppearanceType = 'brick') {
        super(scene);
        this.scene = scene;
        

        this.totalWidth = totalWidth || 30;
        this.sideFloors = sideFloors || 3;
        this.centerFloors = this.sideFloors + 1;
        this.windowsPerFloor = windowsPerFloor || 3;
        this.floorHeight = 3;
        

        this.centerWidth = this.totalWidth * 0.4;
        this.sideWidth = this.totalWidth * 0.3; 
        
        this.centerDepth = this.centerWidth * 0.8;
        this.sideDepth = this.centerWidth * 0.6;
        //this.depth = this.centerWidth * 0.8;      
        

        this.buildingColor = buildingColor || [0.9, 0.9, 0.9];
        
        this.buildingTexture = new CGFtexture(scene, "textures/building/brick.jpg");
        this.buildingAppearanceType = buildingAppearanceType;


        this.buildingMaterials = {
            'brick': null,
            'lightGray': null
        };
        
        this.buildingMaterials.brick = new CGFappearance(scene);
        this.buildingMaterials.brick.setAmbient(this.buildingColor[0] * 0.5, this.buildingColor[1] * 0.5, this.buildingColor[2] * 0.5, 1);
        this.buildingMaterials.brick.setDiffuse(this.buildingColor[0], this.buildingColor[1], this.buildingColor[2], 1);
        this.buildingMaterials.brick.setSpecular(0.1, 0.1, 0.1, 1);
        this.buildingMaterials.brick.setShininess(10.0);
        this.buildingMaterials.brick.setTexture(this.buildingTexture);
        this.buildingMaterials.brick.setTextureWrap('REPEAT', 'REPEAT');
        
        this.buildingMaterials.lightGray = new CGFappearance(scene);
        this.buildingMaterials.lightGray.setAmbient(this.buildingColor[0] * 0.5, this.buildingColor[1] * 0.5, this.buildingColor[2] * 0.5, 1);
        this.buildingMaterials.lightGray.setDiffuse(this.buildingColor[0], this.buildingColor[1], this.buildingColor[2], 1);
        this.buildingMaterials.lightGray.setSpecular(0.1, 0.1, 0.1, 1);
        this.buildingMaterials.lightGray.setShininess(10.0);
        
        this.buildingAppearance = this.buildingMaterials[buildingAppearanceType];
        
        this.window = new MyWindow(scene, windowTexture);
        
        this.doorTexture = new CGFtexture(scene, "textures/building/door.jpg");
        this.signTexture = new CGFtexture(scene, "textures/building/bombeiros_sign.jpg");
        this.helipadTexture = new CGFtexture(scene, "textures/building/helipad.jpg");
        
        this.doorAppearance = new CGFappearance(scene);
        this.doorAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.doorAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorAppearance.setShininess(10.0);
        this.doorAppearance.setTexture(this.doorTexture);
        
        this.signAppearance = new CGFappearance(scene);
        this.signAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.signAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.signAppearance.setShininess(10.0);
        this.signAppearance.setTexture(this.signTexture);
        
        this.helipadAppearance = new CGFappearance(scene);
        this.helipadAppearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.helipadAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.helipadAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.helipadAppearance.setShininess(10.0);
        this.helipadAppearance.setTexture(this.helipadTexture);
        
        this.plane = new MyPlane(scene, 20);
        this.circle = new MyCircle(scene, 30);
    }
    
    setAppearance(appearanceType) {
        this.buildingAppearance = this.buildingMaterials[appearanceType];
    }

    display() {
        this.scene.pushMatrix();
        

        this.scene.translate(0, 0, 0);        

        this.drawLeftModule();
        this.drawCenterModule();
        this.drawRightModule();
        
        this.scene.popMatrix();
    }
    

    drawLeftModule() {
        this.scene.pushMatrix();
        
        this.scene.translate(-this.sideWidth / 2 - this.centerWidth / 2, 0, 0);
        
        this.drawModuleStructure(this.sideWidth, this.sideFloors, this.sideDepth, "LEFT");
        
        // windows
        for (let floor = 0; floor < this.sideFloors; floor++) {
            this.drawFloorWindows(this.sideWidth, floor, this.windowsPerFloor,this.sideDepth, true);
        }
        
        this.scene.popMatrix();
    }
    

    drawCenterModule() {
        this.scene.pushMatrix();
        
        this.drawModuleStructure(this.centerWidth, this.centerFloors, this.centerDepth, "CENTER");
        
        for (let floor = 1; floor < this.centerFloors; floor++) {
            this.drawFloorWindows(this.centerWidth, floor, this.windowsPerFloor,this.centerDepth, true);
        }
        
        this.drawDoor();
        this.drawSign();
        this.drawHelipad();
        
        this.scene.popMatrix();
    }
    

    drawRightModule() {
        this.scene.pushMatrix();
        
        this.scene.translate(this.sideWidth / 2 + this.centerWidth / 2, 0, 0);
        
        this.drawModuleStructure(this.sideWidth, this.sideFloors, this.sideDepth, "RIGHT");
        
        for (let floor = 0; floor < this.sideFloors; floor++) {
            this.drawFloorWindows(this.sideWidth, floor, this.windowsPerFloor,this.sideDepth, true);
        }
        
        this.scene.popMatrix();
    }
    

    drawModuleStructure(width, floors, depth, module = "CENTER") {
        const height = this.floorHeight * floors;
        
        this.buildingAppearance.apply();
        
        // Front 
        this.scene.pushMatrix();
        this.scene.translate(0, height/2, depth / 2);
        this.scene.scale(width, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        
        // Back 
        this.scene.pushMatrix();
        this.scene.translate(0, height/2, -depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(width, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        
        if(module !== "RIGHT") {
        // Left 
        this.scene.pushMatrix();
        this.scene.translate(-width / 2, height/2, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(-depth, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        }
        
        if(module !== "LEFT") {
        // Right 
        this.scene.pushMatrix();
        this.scene.translate(width / 2, height/2, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(-depth, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        }
        
        // Roof
        this.scene.pushMatrix();
        this.scene.translate(0, height, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(width, depth, 1);
        this.plane.display();
        this.scene.popMatrix();
        
    }
    

    drawFloorWindows(moduleWidth, floor, windowCount, moduleDepth, frontOnly = false) {
        const windowWidth = moduleWidth / (windowCount * 2);
        const windowHeight = this.floorHeight * 0.6;
        const windowSpacing = moduleWidth / windowCount;
        const floorY = floor * this.floorHeight + this.floorHeight / 2;        
        // Front 
        for (let i = 0; i < windowCount; i++) {
            const windowX = -moduleWidth / 2 + windowSpacing / 2 + i * windowSpacing;
            
            this.scene.pushMatrix();
            this.scene.translate(windowX, floorY, moduleDepth   / 2 + 0.05);
            this.scene.scale(windowWidth, windowHeight, 1);
            this.window.display();
            this.scene.popMatrix();
        }
        
        // Back 
        if (!frontOnly) {
            for (let i = 0; i < windowCount; i++) {
                const windowX = -moduleWidth / 2 + windowSpacing / 2 + i * windowSpacing;
                
                this.scene.pushMatrix();
                this.scene.translate(windowX, floorY, -moduleDepth   / 2 - 0.05);
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.scene.scale(windowWidth, windowHeight, 1);
                this.window.display();
                this.scene.popMatrix();
            }
        }
    }

    drawDoor() {
        const doorWidth = this.centerWidth * 0.2;
        const doorHeight = this.floorHeight * 0.8;
        const doorY = this.floorHeight / 2 - doorHeight * 0.1;
        
        this.scene.pushMatrix();
        this.scene.translate(0, doorY, this.centerDepth  / 2 + 0.05);
        this.scene.scale(doorWidth, doorHeight, 1);
        this.doorAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();
    }
    

    drawSign() {
        const signWidth = this.centerWidth * 0.3;
        const signHeight = this.floorHeight * 0.25;
        const doorHeight = this.floorHeight * 0.8;
        const signY = this.floorHeight;
        
        this.scene.pushMatrix();
        this.scene.translate(0, signY, this.centerDepth  / 2 + 0.05);
        this.scene.scale(signWidth, signHeight, 1);
        this.signAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();
    }
    

    drawHelipad() {
        const helipadSize = Math.min(this.centerWidth, this.centerDepth ) * 0.8;
        const roofY = this.floorHeight * this.centerFloors;
        
        this.scene.pushMatrix();
        this.scene.translate(0, roofY + 0.05, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(helipadSize, helipadSize, 1);
        this.helipadAppearance.apply();
        this.circle.display();
        this.scene.popMatrix();
    }
}