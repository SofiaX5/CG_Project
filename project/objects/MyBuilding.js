import {CGFobject, CGFappearance, CGFtexture, CGFshader} from '../../lib/CGF.js';
import {MyWindow} from './MyWindow.js';
import {MyPlane} from '../geometry/MyPlane.js';
import {MyCircle} from '../geometry/MyCircle.js';
import {MyCylinder} from '../geometry/MyCylinder.js';

/**
 * MyBuilding
 * @constructor
* @param {Object} scene - Reference to MyScene object
 * @param {number} [totalWidth] - Total width of the building (default: 30)
 * @param {number} [sideFloors] - Number of floors in side modules (default: 3)
 * @param {number} [windowsPerFloor] - Windows per floor in each module (default: 3)
 * @param {CGFtexture} [windowTexture] - Texture for windows
 * @param {Array} [buildingColor] - RGB color array for building [r,g,b] (default: [0.9, 0.9, 0.9])
 * @param {string} [buildingAppearanceType] - Material type: 'brick' or 'lightGray' (default: 'brick')
 */
export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, sideFloors, windowsPerFloor, windowTexture, buildingColor, buildingAppearanceType = 'brick') {
        super(scene);
        this.scene = scene;

        // Building constants
        this.BUILDING = {
            TOTAL_WIDTH: 30,
            SIDE_FLOORS: 3,
            WINDOWS_PER_FLOOR: 3,
            FLOOR_HEIGHT: 3,
            CENTER_WIDTH_RATIO: 0.4,
            SIDE_WIDTH_RATIO: 0.3,
            CENTER_DEPTH_RATIO: 0.8,
            SIDE_DEPTH_RATIO: 0.6,
            DOOR_WIDTH_RATIO: 0.2,
            DOOR_HEIGHT_RATIO: 0.8,
            SIGN_WIDTH_RATIO: 0.3,
            SIGN_HEIGHT_RATIO: 0.25,
            HELIPAD_SIZE_RATIO: 0.8
        };

        // Window constants
        this.WINDOW = {
            HEIGHT_RATIO: 0.6,
            SPACING_FROM_WALL: 0.05
        };


        // Calculate derived dimensions from input parameters
        this.totalWidth = totalWidth || this.BUILDING.TOTAL_WIDTH;
        this.sideFloors = sideFloors || this.BUILDING.SIDE_FLOORS;
        this.centerFloors = this.sideFloors + 1;
        this.windowsPerFloor = windowsPerFloor || this.BUILDING.WINDOWS_PER_FLOOR;
        this.floorHeight = this.BUILDING.FLOOR_HEIGHT;
        

        this.centerWidth = this.totalWidth * this.BUILDING.CENTER_WIDTH_RATIO;
        this.sideWidth = this.totalWidth * this.BUILDING.SIDE_WIDTH_RATIO; 
        this.centerDepth = this.centerWidth * this.BUILDING.CENTER_DEPTH_RATIO;
        this.sideDepth = this.centerWidth * this.BUILDING.SIDE_DEPTH_RATIO;
        
        this.lastTime = 0;
        

        this.buildingColor = buildingColor || [0.9, 0.9, 0.9];
        
        this.buildingTexture = new CGFtexture(scene, "textures/building/brick.jpg");
        this.buildingAppearanceType = buildingAppearanceType;


        // Create building materials (brick and light gray)
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
                        
        this.doorTexture = new CGFtexture(scene, "textures/building/door.jpg");
        this.signTexture = new CGFtexture(scene, "textures/building/bombeiros_sign.jpg");
        this.helipadTexture = new CGFtexture(scene, "textures/building/helipad.jpg");
        this.helipadUpTexture = new CGFtexture(scene, "textures/building/helipad_up.jpg");
        this.helipadDownTexture = new CGFtexture(scene, "textures/building/helipad_down.jpg");

        this.buildingAppearance = this.buildingMaterials[buildingAppearanceType];
        
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

        this.maneuverLightsAppearence = new CGFappearance(scene);
        this.maneuverLightsAppearence.setAmbient(1.0, 1.0,0.0, 1);
        this.maneuverLightsAppearence.setDiffuse(1.0, 1.0,0.0, 1);
        
        // Create animated shader for helipad maneuvering lights
        this.maneuverLightShader = new CGFshader(scene.gl, 
        "shaders/maneuverLight.vert", 
        "shaders/maneuverLight.frag");
        this.maneuverLightShader.setUniformsValues({
            uBaseColor: [1.0, 1.0, 0.0], 
            uPulseSpeed: 10.0,        
            uMinIntensity: 0.3,          
            uMaxIntensity: 3           
        });

        this.plane = new MyPlane(scene, 20);
        this.circle = new MyCircle(scene, 30);
        this.window = new MyWindow(scene, windowTexture);
        this.cylinder = new MyCylinder(scene, 30, 1, 0.7);
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

    // Update time for helipad maneuver lights
    update(t) {
        if (this.lastTime === 0) {
            this.lastTime = t;
            return;
        }
        this.lastTime = t;

        const timeFactor = t / 1000.0 % 1000;
        this.maneuverLightShader.setUniformsValues({ uTime: timeFactor });
    }
    
    setHelipadTexture(textureType) {
        switch(textureType) {
            case 'up':
                this.helipadAppearance.setTexture(this.helipadUpTexture);
                break;
            case 'down':
                this.helipadAppearance.setTexture(this.helipadDownTexture);
                break;
            default:
                this.helipadAppearance.setTexture(this.helipadTexture);
        }
    }

    // Draw left side module with windows
    drawLeftModule() {
        this.scene.pushMatrix();
        
        this.scene.translate(-this.sideWidth / 2 - this.centerWidth / 2, 0, 0);
        
        this.drawModuleStructure(this.sideWidth, this.sideFloors, this.sideDepth, "LEFT");
        
        for (let floor = 0; floor < this.sideFloors; floor++) {
            this.drawFloorWindows(this.sideWidth, floor, this.windowsPerFloor,this.sideDepth, true);
        }
        
        this.scene.popMatrix();
    }
    

    // Draw center module with door, sign, helipad and windows  
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
    

    // Draw right side module with windows
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
        
        // Front wall
        this.scene.pushMatrix();
        this.scene.translate(0, height/2, depth / 2);
        this.scene.scale(width, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        
        // Back wall
        this.scene.pushMatrix();
        this.scene.translate(0, height/2, -depth / 2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(width, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        
        if(module !== "RIGHT") {
        // Left wall
        this.scene.pushMatrix();
        this.scene.translate(-width / 2, height/2, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(-depth, height, 1);
        this.plane.display();
        this.scene.popMatrix();
        }
        
        if(module !== "LEFT") {
        // Right wall
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
    

    drawFloorWindows(moduleWidth, floor, windowCount, moduleDepth) {
        // Calculate window dimensions and spacing
        const windowWidth = moduleWidth / (windowCount * 2);
        const windowHeight = this.floorHeight * this.WINDOW.HEIGHT_RATIO;
        const windowSpacing = moduleWidth / windowCount;
        const floorY = floor * this.floorHeight + this.floorHeight / 2;        

        // Draw windows on front face
        for (let i = 0; i < windowCount; i++) {
            const windowX = -moduleWidth / 2 + windowSpacing / 2 + i * windowSpacing;
            
            this.scene.pushMatrix();
            this.scene.translate(windowX, floorY, moduleDepth   / 2 + this.WINDOW.SPACING_FROM_WALL);
            this.scene.scale(windowWidth, windowHeight, 1);
            this.window.display();
            this.scene.popMatrix();
        }
    }

    drawDoor() {
        const doorWidth = this.centerWidth * this.BUILDING.DOOR_WIDTH_RATIO;
        const doorHeight = this.floorHeight * this.BUILDING.DOOR_HEIGHT_RATIO;
        const doorY = this.floorHeight / 2 - doorHeight * 0.1;
        
        this.scene.pushMatrix();
        this.scene.translate(0, doorY, this.centerDepth  / 2 + this.WINDOW.SPACING_FROM_WALL);
        this.scene.scale(doorWidth, doorHeight, 1);
        this.doorAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();
    }
    

    drawSign() {
        const signWidth = this.centerWidth * this.BUILDING.SIGN_WIDTH_RATIO;
        const signHeight = this.floorHeight * this.BUILDING.SIGN_HEIGHT_RATIO;
        const signY = this.floorHeight;
        
        this.scene.pushMatrix();
        this.scene.translate(0, signY, this.centerDepth  / 2 + 0.05);
        this.scene.scale(signWidth, signHeight, 1);
        this.signAppearance.apply();
        this.plane.display();
        this.scene.popMatrix();
    }
    

    drawHelipad() {
        const helipadSize = Math.min(this.centerWidth, this.centerDepth) * this.BUILDING.HELIPAD_SIZE_RATIO;
        const roofY = this.floorHeight * this.centerFloors;
        
        // Draw helipad base
        this.scene.pushMatrix();
        this.scene.translate(0, roofY + 0.05, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(helipadSize, helipadSize, 1);
        this.helipadAppearance.apply();
        this.circle.display();
        this.scene.popMatrix();

        // Check if helicopter is maneuvering 
        const isManeuvering = this.scene.heli && 
                            (this.scene.heli.state === "taking_off" || 
                            this.scene.heli.state === "landing" || 
                            this.scene.heli.state === "bucket_deploy" || 
                            this.scene.heli.state === "bucket_retract");
        
        // Define positions for maneuver lights
        const lightPositions = [
            { x:  helipadSize/2, z:  helipadSize/2 }, 
            { x: -helipadSize/2, z:  helipadSize/2 }, 
            { x:  helipadSize/2, z: -helipadSize/2 }, 
            { x: -helipadSize/2, z: -helipadSize/2 }  
        ];

        lightPositions.forEach(pos => {
            this.scene.pushMatrix();
            
            // Apply pulsing shader to maneuver lights if helicopter is maneuvering
            if (isManeuvering) {
                this.scene.setActiveShader(this.maneuverLightShader);
                this.maneuverLightShader.setUniformsValues({
                    uTime: this.scene.globalTime, 
                    uBaseColor: [0.3, 0.3, 0.0],  
                    uPulseSpeed: 1.0,           
                    uMinIntensity: 1.5,          
                    uMaxIntensity: 5.0          
                });
            } else {
                // Static yellow lights when not maneuvering
                this.maneuverLightsAppearence.apply();
            }
            
            // Draw lights
            this.scene.translate(pos.x, roofY + 0.05, pos.z);
            
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.scale(0.2, 0.2, 0.5);
            this.cylinder.display();
            
            this.scene.translate(0, 0, 1);
            this.scene.scale(1.4, 1.4, 1);
            this.circle.display();
            
            this.scene.popMatrix();
            
            this.scene.setActiveShader(this.scene.defaultShader);
        });
    }
}