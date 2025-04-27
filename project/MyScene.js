import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyWindow } from "./MyWindow.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyTree } from "./MyTree.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";


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

    this.fovValues = {
      narrow: 0.4,  
      medium: 0.8,  
      wide: 1.2,    
      ultraWide: 1.6 
    };
    this.selectedFov = 'medium';

    this.selectedPanorama = 'field';

    this.buildingAppearanceType = 'brick';
    this.buildingWidth = 20;
    this.buildingSideFloors = 3;
    this.buildingWindowsPerFloor = 2;
    this.buildingColor = [0.9, 0.9, 0.9];

    this.showHelicopterBucket = false;
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

    this.grassTexture = new CGFtexture(this, "textures/general/grass.jpg");
    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];
    this.windowTexture = new CGFtexture(this, "textures/building/window.jpg");

    this.shader = new CGFshader(this.gl, "shaders/earth.vert", "shaders/earth.frag"),
    this.setActiveShader(this.shader);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
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
    this.heli.setPosition(0, this.building.floorHeight * 4 + this.heli.bodyHeight * 0.75, 0);
  }

  updatePanorama() {
    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];
    this.panorama.updateTexture(this.panoramaTexture);
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
    this.heli.setPosition(0, 3 * (this.buildingSideFloors + 1) + this.heli.bodyHeight * 0.75, 0);
  }

  updateHelicopterBucket() {
    this.heli.setBucket(this.showHelicopterBucket);
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
      vec3.fromValues(0, 10, 0),       
      vec3.fromValues(1, 10, 0)        
    );
  }
  checkKeys() {
    const moveAmount = 2.0;
    let keysPressed = false;
    var text = "Keys pressed: ";

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      const dir = vec3.create();
      vec3.subtract(dir, this.camera.target, this.camera.position);
      vec3.normalize(dir, dir);
      
      this.camera.position[0] += dir[0] * moveAmount;
      this.camera.position[2] += dir[2] * moveAmount;
      this.camera.target[0] += dir[0] * moveAmount;
      this.camera.target[2] += dir[2] * moveAmount;
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      const dir = vec3.create();
      vec3.subtract(dir, this.camera.target, this.camera.position);
      vec3.normalize(dir, dir);
      
      this.camera.position[0] -= dir[0] * moveAmount;
      this.camera.position[2] -= dir[2] * moveAmount; 
      this.camera.target[0] -= dir[0] * moveAmount;
      this.camera.target[2] -= dir[2] * moveAmount;

      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      
      const forward = vec3.create();
      vec3.subtract(forward, this.camera.target, this.camera.position);
      vec3.normalize(forward, forward);
      
      const up = vec3.fromValues(0, 1, 0);
      const right = vec3.create();
      vec3.cross(right, forward, up);
      vec3.normalize(right, right);
      
      this.camera.position[0] -= right[0] * moveAmount;
      this.camera.position[2] -= right[2] * moveAmount;
      this.camera.target[0] -= right[0] * moveAmount;
      this.camera.target[2] -= right[2] * moveAmount;

      keysPressed = true;
    }
    
    if (this.gui.isKeyPressed("KeyD")) {
      text += " D ";
      const forward = vec3.create();
      vec3.subtract(forward, this.camera.target, this.camera.position);
      vec3.normalize(forward, forward);
      
      const up = vec3.fromValues(0, 1, 0);
      const right = vec3.create();
      vec3.cross(right, forward, up);
      vec3.normalize(right, right);
      
      this.camera.position[0] += right[0] * moveAmount;
      this.camera.position[2] += right[2] * moveAmount;
      this.camera.target[0] += right[0] * moveAmount;
      this.camera.target[2] += right[2] * moveAmount;

        keysPressed = true;
      }
    
    if (this.gui.isKeyPressed("KeyQ")) {
      this.camera.position[1] += moveAmount;
      this.camera.target[1] += moveAmount;
      keysPressed = true;
    }
    
    if (this.gui.isKeyPressed("KeyE")) {
      this.camera.position[1] -= moveAmount;
      this.camera.target[1] -= moveAmount;
      keysPressed = true;
    }



    if (keysPressed){
      console.log(text);
      this.lights[0].setPosition(
        this.camera.position[0],
        this.camera.position[1],
        this.camera.position[2],
        1
      );
      this.lights[0].update();
    }
  }

  updateCameraFov() {
    this.camera.fov = this.fovValues[this.selectedFov];
  }

  update(t) {
    this.checkKeys();
    if (this.heli) {
      this.heli.update(t);
    }
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

    // Draw axis
    this.axis.display();

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
    this.appearance.setTexture(this.grassTexture);
    this.appearance.apply();
    this.plane.display();
    this.popMatrix();

    
    this.pushMatrix();
    this.translate(15, 0, 15);
    this.forest.display();
    this.popMatrix();
    


    // Esfera
    /*
    this.pushMatrix();
    this.appearance.apply();
    this.setActiveShader(this.shader); 
    this.translate(50, 10, 0); 
    this.scale(10, 10, 10);
    this.sphere.display();
    this.popMatrix();
    */
    

    this.setActiveShader(this.defaultShader);
  }
}
