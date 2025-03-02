import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyQuad} from "./MyQuad.js";
import { MyUnitCubeQuad} from "./MyUnitCubeQuad.js";
import { MyUnitCube } from "./MyUnitCube.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.diamond = new MyDiamond(this);
    this.triangle = new MyTriangle(this);
    this.parallelogram = new MyParallelogram(this);
    this.triangleSmall1 = new MyTriangleSmall(this);
    this.triangleSmall2 = new MyTriangleSmall(this);
    this.triangleBig1 = new MyTriangleBig(this);
    this.triangleBig2 = new MyTriangleBig(this);
    this.unitCube = new MyUnitCube(this);
    this.quad = new MyQuad(this);
    this.unitCubeQuad = new MyUnitCubeQuad(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.showTriangle = true;
    this.showDiamond = true;
    this.showParallelogram = true;
    this.scaleFactor = 1;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
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
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    var tDiamond = [1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    4, 1, 0, 1,
                  ];

    this.multMatrix(sca);

    // 2. Tangram Exercise
    //this.translate(3.5, -3, 0.1);
    // Diamond
    this.pushMatrix();
    this.multMatrix(tDiamond);
    this.setDiffuse(0, 1, 0, 1.0);
    this.diamond.display();
    this.popMatrix();

    // Big Triangle 1
    this.pushMatrix();
    this.translate(2, 0, 0);
    this.setDiffuse(0, 0.5, 1, 1.0);
    this.triangleBig1.display();
    this.popMatrix();

    // Small Triangle 1
    this.pushMatrix();
    this.translate(5, 0, 0);
    this.setDiffuse(0.67, 0.3, 0.76, 1.0);
    this.triangleSmall1.display();
    this.popMatrix();

    // Big Triangle 2
    this.pushMatrix();
    this.translate(1.4, -1.4, 0);
    this.rotate(Math.PI / 4, 0, 0, 1);
    this.setDiffuse(1, 0.5, 0, 1.0);
    this.triangleBig2.display();
    this.popMatrix();

    // Small Triangle 2
    this.pushMatrix();
    this.translate(0, -3.8, 0);
    this.setDiffuse(1, 0.08, 0.08, 1.0);
    this.triangleSmall2.display();
    this.popMatrix();

    // Triangle
    this.pushMatrix();
    this.rotate(Math.PI / 2, 0, 0, 1);
    this.translate(-1, 1, 0);
    this.setDiffuse(1, 0.5, 0.82, 1.0);
    this.triangle.display();
    this.popMatrix();

    // Parallelogram 
    this.pushMatrix();
    this.rotate(Math.PI, 1, 0, 0);
    this.rotate(0.75 * Math.PI, 0, 0, 1); 
    this.translate(1.6, -1.23, 0);
    this.setDiffuse(1, 1, 0, 1.0);
    this.parallelogram.display();
    this.popMatrix();

    // 3. Unit Cube
    /*this.pushMatrix();
    this.translate(1.5, -1, -0.6);
    this.scale(10, 8, 1);
    this.setDiffuse(1, 1, 1, 1.0);
    this.unitCube.display();
    this.popMatrix();*/

    // 4. Unit Cube Quad
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.unitCubeQuad.display();
  }
}
