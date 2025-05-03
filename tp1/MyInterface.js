import {CGFinterface, dat} from '../lib/CGF.js';

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

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'showDiamond').name('show Diamond');
        this.gui.add(this.scene, 'showTriangle').name('show Triangle');
        this.gui.add(this.scene, 'showParallelogram').name('show Parallelogram');
        this.gui.add(this.scene, 'showSmallTriangle').name('show Small Triangle');
        this.gui.add(this.scene, 'showBigTriangle').name('show Big Triangle');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        return true;
    }
}