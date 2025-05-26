import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        //FOV
        const fovFolder = this.gui.addFolder('Camera Field of View');
        fovFolder.add(this.scene, 'selectedFov', ['narrow', 'medium', 'wide', 'ultraWide'])
            .name('FOV Setting')
            .onChange(() => this.scene.updateCameraFov());

        //Panorama
        const environmentFolder = this.gui.addFolder('Environment');
        environmentFolder.add(this.scene, 'displayAxis').name('Display Axis');
        environmentFolder.add(this.scene, 'selectedPanorama', ['field', 'city'])
            .name('Panorama Background')
            .onChange(() => this.scene.updatePanorama());

        environmentFolder.add(this.scene, 'fireEnabled')
            .name('Enable Fires')
            .onChange(() => this.scene.updateFireState());
        
        //Building
        const buildingFolder = this.gui.addFolder('Building');
        buildingFolder.add(this.scene, 'buildingAppearanceType', ['brick', 'lightGray'])
            .name('Building Material')
            .onChange(() => this.scene.updateBuildingAppearance());

            buildingFolder.add(this.scene, 'buildingWidth', 10, 40).step(1)
            .name('Width')
            .onChange(() => this.scene.updateBuilding());
        
        buildingFolder.add(this.scene, 'buildingSideFloors', 1, 6).step(1)
            .name('Floors')
            .onChange(() => this.scene.updateBuilding());
        
        buildingFolder.add(this.scene, 'buildingWindowsPerFloor', 1, 5).step(1)
            .name('Windows Per Floor')
            .onChange(() => this.scene.updateBuilding());
        
        // Color controllers 
        const colorFolder = buildingFolder.addFolder('Building Color');
        colorFolder.add(this.scene.buildingColor, '0', 0, 1).step(0.05)
            .name('Red')
            .onChange(() => this.scene.updateBuilding());
        
        colorFolder.add(this.scene.buildingColor, '1', 0, 1).step(0.05)
            .name('Green')
            .onChange(() => this.scene.updateBuilding());
        
        colorFolder.add(this.scene.buildingColor, '2', 0, 1).step(0.05)
            .name('Blue')
            .onChange(() => this.scene.updateBuilding());

        //Helicopter
        const helicopterFolder = this.gui.addFolder('Helicopter');
        helicopterFolder.add(this.scene, 'showHelicopterBucket')
            .name('Bucket')
            .onChange(() => this.scene.updateHelicopterBucket());

        //CruisingHeight
        helicopterFolder.add(this.scene, 'cruisingHeight', 5, 15).step(0.1)
        .name('Cruising Height')
        .onChange(() => this.scene.updateHelicopterCruisingHeight());

        //speedFactor
        helicopterFolder.add(this.scene, 'speedFactor', 0.1, 3).step(0.1)
            .name('Speed Factor')
            .onChange(() => this.scene.updateHelicopterSpeedFactor());

        //SpecialMode
         const specialFolder = this.gui.addFolder('Special Mode');
        specialFolder.add(this.scene, 'showSpecialMode')
            .name('special mode')
            .onChange(() => this.scene.updateSpecialMode());

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}