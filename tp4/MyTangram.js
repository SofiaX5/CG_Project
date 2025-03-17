import { CGFobject, CGFappearance } from "../lib/CGF.js";

import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

export class MyTangram extends CGFobject {
  constructor(scene) {
    super(scene);
    
    this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);

    this.texCoordsTS1 = [0, 0, 0, 0.5, 0.25, 0.25];
    this.texCoordsTS2 = [0.25, 0.75, 0.75, 0.75, 0.5, 0.5];
    this.texCoordsTB1 = [0, 0, 1, 0, 0.5, 0.5];
    this.texCoordsTB2 = [1, 0, 1, 1, 0.5, 0.5];
    this.triangleSmall1 = new MyTriangleSmall(scene, this.texCoordsTS1);
    this.triangleSmall2 = new MyTriangleSmall(scene, this.texCoordsTS2);
    this.triangleBig1 = new MyTriangleBig(scene, this.texCoordsTB1);
    this.triangleBig2 = new MyTriangleBig(scene, this.texCoordsTB2);

  }

  display() {
    // Diamond
    this.scene.pushMatrix();
    this.scene.translate(4, 1, 0);
    
    this.diamond.display();
    this.scene.popMatrix();

    // Big Triangle 1
    this.scene.pushMatrix();
    this.scene.translate(2, 0, 0);
    this.triangleBig1.display();
    this.scene.popMatrix();

    // Small Triangle 1
    this.scene.pushMatrix();
    this.scene.translate(5, 0, 0);
    this.triangleSmall1.display();
    this.scene.popMatrix();

    // Big Triangle 2
    this.scene.pushMatrix();
    this.scene.translate(1.4, -1.4, 0);
    this.scene.rotate(Math.PI / 4, 0, 0, 1);
    this.triangleBig2.display();
    this.scene.popMatrix();

    // Small Triangle 2
    this.scene.pushMatrix();
    this.scene.translate(0, -3.8, 0);
    this.triangleSmall2.display();
    this.scene.popMatrix();

    // Triangle
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 0, 1);
    this.scene.translate(-1, 1, 0);
    this.triangle.display();
    this.scene.popMatrix();

    // Parallelogram
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.rotate(0.75 * Math.PI, 0, 0, 1);
    this.scene.translate(1.6, -1.23, 0);
    this.parallelogram.display();
    this.scene.popMatrix();
  }

  enableNormalViz(){
    this.diamond.enableNormalViz()
    this.triangle.enableNormalViz()
    this.triangleBig1.enableNormalViz()
    this.triangleBig2.enableNormalViz()
    this.triangleSmall1.enableNormalViz()
    this.triangleSmall2.enableNormalViz()
    this.parallelogram.enableNormalViz()
  };

  disableNormalViz(){
    this.diamond.disableNormalViz()
    this.triangle.disableNormalViz()
    this.triangleBig1.disableNormalViz()
    this.triangleBig2.disableNormalViz()
    this.triangleSmall1.disableNormalViz()
    this.triangleSmall2.disableNormalViz()
    this.parallelogram.disableNormalViz()
  };

  updateBuffers(complexity){
  }
}
