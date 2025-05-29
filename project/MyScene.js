import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./geometry/MyPlane.js";
import { MySphere } from "./geometry/MySphere.js";
import { MyPanorama } from "./objects/MyPanorama.js";
import { MyBuilding } from "./objects/MyBuilding.js";
import { MyForest } from "./objects/MyForest.js";
import { MyHeli } from "./objects/MyHeli.js";
import { MyFire } from "./objects/MyFire.js";
import { MyLake } from "./objects/MyLake.js";
import { MyPerson } from "./objects/MyPerson.js";


/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.texture = null;
    this.panoramaTexture = null;
    this.windowTexture = null;
		this.appearance = null;
    this.lastTime = 0;

    this.fovValues = {
      narrow: 0.4,  
      medium: 0.8,  
      wide: 1.2,    
      ultraWide: 1.6 
    };
    this.selectedFov = 'medium';

    this.selectedPanorama = 'field';

    this.displayAxis = true;

    this.buildingAppearanceType = 'brick';
    this.buildingWidth = 20;
    this.buildingSideFloors = 3;
    this.buildingWindowsPerFloor = 2;
    this.buildingColor = [0.9, 0.9, 0.9];

    this.showHelicopterBucket = true;
    this.speedFactor = 1.0;
    this.heliportHeight = 0;
    this.cruisingHeight = 6.0;

    this.fireEnabled = true;
    this.fireSize = 5;
    this.fireIntensity = 1.0;
    this.fires = [];
 
    this.showSpecialMode = false;

    this.dianaPosition = [12, 1, 15];
    this.sofiaPosition = [-40, 0, 20];
  }
  
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();
    

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);

    this.earthTexture = new CGFtexture(this, "textures/general/earth.jpg");
    this.appearance.setTexture(this.earthTexture);

    this.panoramaTextures = {
      'field': new CGFtexture(this, "textures/panoramas/field.jpg"),
      'city': new CGFtexture(this, "textures/panoramas/city.jpg")
    };

    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];
    this.windowTexture = new CGFtexture(this, "textures/building/window.jpg");

    this.shader = new CGFshader(this.gl, "shaders/earth.vert", "shaders/earth.frag"),
    this.setActiveShader(this.shader);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.sphere = new MySphere(this, 20, 20, false);
    this.panorama = new MyPanorama(this, this.panoramaTexture);
    this.forest = new MyForest(this);
    this.building = new MyBuilding(
      this,               
      20,                 // total width
      3,                  // side floors
      2,                  // windows per floor
      this.windowTexture, 
      [0.9, 0.9, 0.9]     // building color 
    );
    this.heli = new MyHeli(this);
    this.updateHeliportPosition();
    this.fires = [
      new MyFire(this, [15, 0, 15], this.fireSize, 15),
      new MyFire(this, [30, 0, 30], this.fireSize * 1.2, 20)
    ];
    this.planeLake = new MyLake(this);
    this.diana = new MyPerson(this, "textures/people/cloth_diana.jpg", true);
    this.sofia = new MyPerson(this, "textures/people/cloth_sofia.jpg", true);
  }

  constrainCamera() {
    const maxDistance = this.panorama.radius * 0.95; 
    const cameraPos = this.camera.position;
    
    const distance = Math.sqrt(
        cameraPos[0] * cameraPos[0] + 
        cameraPos[1] * cameraPos[1] + 
        cameraPos[2] * cameraPos[2]
    );
    
    if (distance > maxDistance) {
        const scale = maxDistance / distance;
        this.camera.position[0] = cameraPos[0] * scale;
        this.camera.position[1] = cameraPos[1] * scale;
        this.camera.position[2] = cameraPos[2] * scale;
        
        const targetOffset = vec3.create();
        vec3.subtract(targetOffset, this.camera.target, this.camera.position);
        vec3.add(this.camera.target, this.camera.position, targetOffset);
        
    }

    if (this.camera.position[1] < 0.2) {
        this.camera.position[1] = 0.2;
    }
}

  updatePanorama() {
    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];
    this.panorama.updateTexture(this.panoramaTexture);
  }

  updateFireState() {
    console.log("Fire state updated:", this.fireEnabled);
  }

  updateBuildingAppearance() {
    this.building.setAppearance(this.buildingAppearanceType);
  }

  updateBuilding = function() {
    this.building = new MyBuilding(
      this,
      this.buildingWidth,
      this.buildingSideFloors,
      this.buildingWindowsPerFloor,
      this.windowTexture,
      this.buildingColor,
      this.buildingAppearanceType
    )
    this.updateHeliportPosition();
    //this.heli.setPosition(0, 3 * (this.buildingSideFloors + 1) + this.heli.bodyHeight * 0.75, 0);
  }

  updateHelicopterBucket() {
    this.heli.setBucket(this.showHelicopterBucket);
  }
  updateHelicopterSpeedFactor() {
    this.heli.setSpeedFactor(this.speedFactor);
  }
  updateHelicopterCruisingHeight() {
    this.heli.setCruisingHeight(this.cruisingHeight);
  }

  updateHeliportPosition() {
    const buildingHeight = this.building.floorHeight * (this.buildingSideFloors + 1);
    this.heliportHeight = buildingHeight;
    
    this.heli.setHeliportPosition(0, buildingHeight + this.heli.bodyHeight * 0.75, 0);
}

  updateSpecialMode() {
    this.heli.setSpecialMode(this.showSpecialMode);
  }

  initLights() {
    this.lights[0].setPosition(0, 0, 0, 1);
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      this.fovValues[this.selectedFov], 
      0.1,                            
      1000,                            
      vec3.fromValues(0, 15, 30),       
      vec3.fromValues(1, 10, 0)        
    );
  }
  checkKeys() {
    const moveAmount = 2.0;
    let keysPressed = false;
    var text = "Keys pressed: ";
    this.constrainCamera();

    const heliTurnFactor = 0.05 * this.speedFactor;
    const heliAccelFactor = 0.02 * this.speedFactor;

    if (this.gui.isKeyPressed("KeyW")) {
        text += " W ";
        if (this.heli.state === "flying") {
            this.heli.accelerate(heliAccelFactor);
        }
        keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
        text += " S ";
        if (this.heli.state === "flying") {
            this.heli.accelerate(-0.2*heliAccelFactor);
        }
        keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyA")) {
        text += " A ";
        if (this.heli.state === "flying") {
            this.heli.turn(heliTurnFactor);
        }
        keysPressed = true;
    }
    
    if (this.gui.isKeyPressed("KeyD")) {
        text += " D ";
        if (this.heli.state === "flying") {
            this.heli.turn(-heliTurnFactor);
        }
        keysPressed = true;
    }
    
    if (this.gui.isKeyPressed("KeyR")) {
        text += " R ";
        this.heli.reset();
        keysPressed = true;
    }
    
    if (this.gui.isKeyPressed("KeyP") && !this.pKeyActive) {
      text += " P ";
      this.heli.takeOff();
      this.pKeyActive = true;
      keysPressed = true;
    } else if (!this.gui.isKeyPressed("KeyP")) {
        this.pKeyActive = false;
    }

    if (this.gui.isKeyPressed("KeyL") && !this.lKeyActive) {
        text += " L ";
        this.heli.land();
        this.lKeyActive = true;
        keysPressed = true;
    } else if (!this.gui.isKeyPressed("KeyL")) {
        this.lKeyActive = false;
    }

    if (this.gui.isKeyPressed("KeyO") && !this.oKeyActive) {
        text += " O ";
        this.heli.put_fire();
        this.oKeyActive = true;
        keysPressed = true;
    } else if (!this.gui.isKeyPressed("KeyO")) {
        this.oKeyActive = false;
    }

    if (keysPressed){
        console.log(text);
        this.lights[0].update();
    }
}

  updateCameraFov() {
    this.camera.fov = this.fovValues[this.selectedFov];
  }

   update(t) {
    this.building.update(t);
    this.checkKeys();
    if (this.heli) {
      if (this.lastTime === 0) {
        this.lastTime = t;
      } else {
        const deltaTime = t - this.lastTime;
        this.heli.update(deltaTime);
        this.lastTime = t;
      }
    }
    if (this.fireEnabled) {
      for (let i = 0; i < this.fires.length; i++) {
        this.fires[i].update(t);
      }
    }

    this.planeLake.update(t);
    this.constrainCamera();
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();
    
    this.pushMatrix();
    this.panorama.display();
    this.building.display();
    this.popMatrix();
    
    this.pushMatrix();
    this.heli.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(400, 1, 400);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.planeLake.display();
    this.popMatrix();

    
    this.pushMatrix();
    this.translate(15, 0, 15);
    this.forest.display();
    this.popMatrix();
    
    if (this.fireEnabled && this.heli.isFireOn) {
      this.pushMatrix();
      for(let i = 0; i < this.fires.length; i++) {
        this.fires[i].display();
      }
      this.popMatrix();
    }

      this.pushMatrix();
      this.translate(this.dianaPosition[0], this.dianaPosition[1], this.dianaPosition[2]);
      this.rotate(-Math.PI/2, 0, 1, 0);
      this.scale(2.5, 2.5, 2.5);
      this.diana.display();
      this.popMatrix();

      this.pushMatrix();
      this.translate(this.sofiaPosition[0], this.sofiaPosition[1], this.sofiaPosition[2]);
      this.rotate(Math.PI/2, 0, 1, 0);
      this.scale(2.5, 2.5, 2.5);
      this.sofia.display();
      this.popMatrix();
    

    this.setActiveShader(this.defaultShader);
  }
}
