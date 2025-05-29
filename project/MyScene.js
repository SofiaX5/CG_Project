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
 * Main scene class that manages all objects, lighting, cameras, and user interactions
 */
export class MyScene extends CGFscene {
  constructor() {
    super();

    // Scene constants
    this.SCENE = {
      UPDATE_PERIOD: 50,
      CAMERA_MIN_HEIGHT: 0.2,
      CAMERA_CONSTRAIN_FACTOR: 0.95,
      LAKE_SCALE: 400,
      FOREST_OFFSET: [15, 0, 15],
      DIANA_SCALE: 2.5,
      SOFIA_SCALE: 2.5
    };

    // Input handling state
    this.pKeyActive = false;
    this.lKeyActive = false;
    this.oKeyActive = false;
    this.lastTime = 0;

    this.initDefaultValues();
    
    // Initialize textures and appearances
    this.texture = null;
    this.panoramaTexture = null;
    this.windowTexture = null;
    this.appearance = null;
  }


  initDefaultValues() {
    // Camera field of view options
    this.fovValues = {
      narrow: 0.4,  
      medium: 0.8,  
      wide: 1.2,    
      ultraWide: 1.6 
    };
    this.selectedFov = 'medium';

    // Panorama settings
    this.selectedPanorama = 'field';

    // Display options
    this.displayAxis = true;

    // Building configuration
    this.buildingAppearanceType = 'brick';
    this.buildingWidth = 20;
    this.buildingSideFloors = 3;
    this.buildingWindowsPerFloor = 2;
    this.buildingColor = [0.9, 0.9, 0.9];

    // Helicopter configuration
    this.showHelicopterBucket = true;
    this.speedFactor = 1.0;
    this.heliportHeight = 0;
    this.cruisingHeight = 6.0;

    // Forest configuration
    this.forestRow = 5;
    this.forestCol = 4;
    this.forestDist = 6;
    this.forestText = 'Texture 1';

    // Fire configuration
    this.fireEnabled = true;
    this.fireSize = 5;
    this.fireIntensity = 1.0;
    this.fires = [];

    this.showSpecialMode = false;

    // People positions
    this.dianaPosition = [12, 1, 15];
    this.sofiaPosition = [-40, 0, 20];
  }
  
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();
    this.initRenderer();
    this.initTextures();
    this.initShaders();
    this.initSceneObjects();

    this.setUpdatePeriod(this.SCENE.UPDATE_PERIOD);
  }

  /**
   * Initialize WebGL renderer settings
   */
  initRenderer() {
    // Background color
    this.gl.clearColor(0, 0, 0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);
  }

  /**
   * Initialize all textures and appearances
   */
  initTextures() {
    // Default appearance
    this.appearance = new CGFappearance(this);
    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.appearance.setShininess(120);

    // Earth texture
    this.earthTexture = new CGFtexture(this, "textures/general/earth.jpg");
    this.appearance.setTexture(this.earthTexture);

    // Panorama textures
    this.panoramaTextures = {
      'field': new CGFtexture(this, "textures/panoramas/field.jpg"),
      'city': new CGFtexture(this, "textures/panoramas/city.jpg")
    };
    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];

    // Building textures
    this.windowTexture = new CGFtexture(this, "textures/building/window.jpg");
  }

  /**
   * Initialize shaders
   */
  initShaders() {
    this.shader = new CGFshader(this.gl, "shaders/earth.vert", "shaders/earth.frag");
    this.setActiveShader(this.shader);
  }

  /**
   * Initialize all scene objects
   */
  initSceneObjects() {
    // Basic geometry and environment
    this.axis = new CGFaxis(this, 20, 1);
    this.sphere = new MySphere(this, 20, 20, false);
    this.panorama = new MyPanorama(this, this.panoramaTexture);
    this.planeLake = new MyLake(this);

    // Buildings and structures
    this.building = new MyBuilding(
      this,               
      20,                 // total width
      3,                  // side floors
      2,                  // windows per floor
      this.windowTexture, 
      [0.9, 0.9, 0.9]     // building color 
    );

    // Helicopter
    this.heli = new MyHeli(this);
    this.updateHeliportPosition();

    //Forest
    this.forest = new MyForest(this);
    
    // Fire objects
    this.fires = [
      new MyFire(this, [15, 0, 15], this.fireSize, 15),
      new MyFire(this, [30, 0, 30], this.fireSize * 1.2, 20)
    ];

    // People
    this.diana = new MyPerson(this, "textures/people/cloth_diana.jpg", true);
    this.sofia = new MyPerson(this, "textures/people/cloth_sofia.jpg", true);
  }

  /**
   * Initialize camera system
   */
  initCameras() {
    this.camera = new CGFcamera(
      this.fovValues[this.selectedFov], 
      0.1,                            
      1000,                            
      vec3.fromValues(40, 22, 80),   //    (0, 15, 50)
      vec3.fromValues(1, 10, 0)        
    );
  }

  /**
   * Initialize lighting system
   */
  initLights() {
    this.lights[0].setPosition(0, 0, 0, 1);
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  // =============================================
  // CAMERA MANAGEMENT
  // =============================================

  /**
   * Constrain camera within panorama boundaries and minimum height
   */
  constrainCamera() {
    const maxDistance = this.panorama.radius * this.SCENE.CAMERA_CONSTRAIN_FACTOR; 
    const cameraPos = this.camera.position;
    
    // Constrain to panorama sphere
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

    // Constrain minimum height
    if (this.camera.position[1] < this.SCENE.CAMERA_MIN_HEIGHT) {
        this.camera.position[1] = this.SCENE.CAMERA_MIN_HEIGHT;
    }
  }

  /**
   * Update camera field of view
   */
  updateCameraFov() {
    this.camera.fov = this.fovValues[this.selectedFov];
  }

  // =============================================
  // INPUT HANDLING
  // =============================================

  /**
   * Handle keyboard input for helicopter control
   */
  checkKeys() {
    const moveAmount = 2.0;
    let keysPressed = false;
    var text = "Keys pressed: ";
    this.constrainCamera();

    const heliTurnFactor = 0.05 * this.speedFactor;
    const heliAccelFactor = 0.02 * this.speedFactor;

    // Helicopter movement controls
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
    
    // Helicopter state controls
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

  // =============================================
  // UPDATE METHODS FOR GUI CONTROLS
  // =============================================

  /**
   * Update panorama texture based on selection
   */
  updatePanorama() {
    this.panoramaTexture = this.panoramaTextures[this.selectedPanorama];
    this.panorama.updateTexture(this.panoramaTexture);
  }

  /**
   * Update fire system state
   */
  updateFireState() {
    console.log("Fire state updated:", this.fireEnabled);
  }

  /**
   * Update building appearance material
   */
  updateBuildingAppearance() {
    this.building.setAppearance(this.buildingAppearanceType);
  }

  /**
   * Rebuild building with new parameters
   */
  updateBuilding() {
    this.building = new MyBuilding(
      this,
      this.buildingWidth,
      this.buildingSideFloors,
      this.buildingWindowsPerFloor,
      this.windowTexture,
      this.buildingColor,
      this.buildingAppearanceType
    );
    this.updateHeliportPosition();
  }

  /**
   * Update forest configuration
   */
  updateForest() {
    let leafTexture;
    if (this.forestText == 'Texture 1') {leafTexture = "leaf.jpg"}
    else {leafTexture = "leaf2.jpg"}
    this.forest.update(this.forestRow, this.forestCol, this.forestDist, leafTexture);
  }

  /**
   * Update helicopter bucket visibility
   */
  updateHelicopterBucket() {
    this.heli.setBucket(this.showHelicopterBucket);
  }

  /**
   * Update helicopter speed factor
   */
  updateHelicopterSpeedFactor() {
    this.heli.setSpeedFactor(this.speedFactor);
  }

  /**
   * Update helicopter cruising height
   */
  updateHelicopterCruisingHeight() {
    this.heli.setCruisingHeight(this.cruisingHeight);
  }

  /**
   * Update heliport position based on building height
   */
  updateHeliportPosition() {
    const buildingHeight = this.building.floorHeight * (this.buildingSideFloors + 1);
    this.heliportHeight = buildingHeight;
    this.heli.setHeliportPosition(0, buildingHeight + this.heli.bodyHeight * 0.75, 0);
  }

  /**
   * Update special mode for helicopter
   */
  updateSpecialMode() {
    this.heli.setSpecialMode(this.showSpecialMode);
  }

  // =============================================
  // ANIMATION AND UPDATES
  // =============================================

  /**
   * Main update loop for all animated objects
   */
  update(t) {
    // Update building animations
    this.building.update(t);
    
    // Handle input
    this.checkKeys();
    
    // Update helicopter
    if (this.heli) {
      if (this.lastTime === 0) {
        this.lastTime = t;
      } else {
        const deltaTime = t - this.lastTime;
        this.heli.update(deltaTime);
        this.lastTime = t;
      }
    }
    
    // Update fires if enabled
    if (this.fireEnabled) {
      for (let i = 0; i < this.fires.length; i++) {
        this.fires[i].update(t);
      }
    }

    // Update lake animation
    this.planeLake.update(t);
    
    // Constrain camera
    this.constrainCamera();
  }

  // =============================================
  // RENDERING
  // =============================================

  /**
   * Set default material appearance
   */
  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  /**
   * Main display method - renders all scene objects
   */
  display() {
    // Initialize rendering
    this.initializeFrame();

    // Render coordinate axis if enabled
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();
    
    // Render main scene objects
    this.renderEnvironment();
    //this.renderHelicopter();
    this.renderLake();
    this.renderForest();
    //this.renderFires();
    //this.renderPeople();
    
    // Reset to default shader
    this.setActiveShader(this.defaultShader);
  }

  /**
   * Initialize frame rendering
   */
  initializeFrame() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();
  }

  /**
   * Render environment objects (panorama and building)
   */
  renderEnvironment() {
    this.pushMatrix();
    this.panorama.display();
    this.building.display();
    this.popMatrix();
  }

  /**
   * Render helicopter
   */
  renderHelicopter() {
    this.pushMatrix();
    this.heli.display();
    this.popMatrix();
  }

  /**
   * Render lake surface
   */
  renderLake() {
    this.pushMatrix();
    this.scale(this.SCENE.LAKE_SCALE, 1, this.SCENE.LAKE_SCALE);
    this.rotate(-Math.PI / 2, 1, 0, 0);
    this.planeLake.display();
    this.popMatrix();
  }

  /**
   * Render forest
   */
  renderForest() {
    this.pushMatrix();
    this.translate(...this.SCENE.FOREST_OFFSET);
    this.forest.display();
    this.popMatrix();
  }

  /**
   * Render fire effects if enabled
   */
  renderFires() {
    if (this.fireEnabled && this.heli.isFireOn) {
      this.pushMatrix();
      for(let i = 0; i < this.fires.length; i++) {
        this.fires[i].display();
      }
      this.popMatrix();
    }
  }

  /**
   * Render people models
   */
  renderPeople() {
    // Render Diana
    this.pushMatrix();
    this.translate(...this.dianaPosition);
    this.rotate(-Math.PI/2, 0, 1, 0);
    this.scale(this.SCENE.DIANA_SCALE, this.SCENE.DIANA_SCALE, this.SCENE.DIANA_SCALE);
    this.diana.display();
    this.popMatrix();

    // Render Sofia
    this.pushMatrix();
    this.translate(...this.sofiaPosition);
    this.rotate(Math.PI/2, 0, 1, 0);
    this.scale(this.SCENE.SOFIA_SCALE, this.SCENE.SOFIA_SCALE, this.SCENE.SOFIA_SCALE);
    this.sofia.display();
    this.popMatrix();
  }
}