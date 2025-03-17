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
    this.triangleSmall1 = new MyTriangleSmall(scene);
    this.triangleSmall2 = new MyTriangleSmall(scene);
    this.triangleBig1 = new MyTriangleBig(scene);
    this.triangleBig2 = new MyTriangleBig(scene);

    this.initMaterials();
  }

  initMaterials() {
    this.materials = {
      diamond: new CGFappearance(this.scene),
      triangle: new CGFappearance(this.scene),
      parallelogram: new CGFappearance(this.scene),
      triangleSmall1: new CGFappearance(this.scene),
      triangleSmall2: new CGFappearance(this.scene),
      triangleBig1: new CGFappearance(this.scene),
      triangleBig2: new CGFappearance(this.scene),
    };
    this.materials.diamond.setAmbient(0, 1, 0, 1.0);
    this.materials.diamond.setDiffuse(0, 1, 0, 1.0);
    this.materials.diamond.setSpecular(1, 1, 1, 1.0);
    this.materials.diamond.setShininess(100);

    this.materials.triangleBig1.setAmbient(0, 0.5, 1, 1.0);
    this.materials.triangleBig1.setDiffuse(0, 0.5, 1, 1.0);
    this.materials.triangleBig1.setSpecular(1, 1, 1, 1.0);
    this.materials.triangleBig1.setShininess(100);

    this.materials.triangleSmall1.setAmbient(0.67, 0.3, 0.76, 1.0);
    this.materials.triangleSmall1.setDiffuse(0.67, 0.3, 0.76, 1.0);
    this.materials.triangleSmall1.setSpecular(1, 1, 1, 1.0);
    this.materials.triangleSmall1.setShininess(100);

    this.materials.triangleBig2.setAmbient(1, 0.5, 0, 1.0);
    this.materials.triangleBig2.setDiffuse(1, 0.5, 0, 1.0);
    this.materials.triangleBig2.setSpecular(1, 1, 1, 1.0);
    this.materials.triangleBig2.setShininess(100);

    this.materials.triangleSmall2.setAmbient(1, 0.08, 0.08, 1.0);
    this.materials.triangleSmall2.setDiffuse(1, 0.08, 0.08, 1.0);
    this.materials.triangleSmall2.setSpecular(1, 1, 1, 1.0);
    this.materials.triangleSmall2.setShininess(100);

    this.materials.triangle.setAmbient(1, 0.5, 0.82, 1.0);
    this.materials.triangle.setDiffuse(1, 0.5, 0.82, 1.0);
    this.materials.triangle.setSpecular(1, 1, 1, 1.0);
    this.materials.triangle.setShininess(100);

    this.materials.parallelogram.setAmbient(1, 1, 0, 1.0);
    this.materials.parallelogram.setDiffuse(1, 1, 0, 1.0);
    this.materials.parallelogram.setSpecular(1, 1, 1, 1.0);
    this.materials.parallelogram.setShininess(100);
  }
  


  display() {
    // Diamond
    this.scene.pushMatrix();
    this.scene.translate(4, 1, 0);
    this.materials.diamond.apply();
    if(this.scene.selectedMaterial == 3) this.scene.customMaterial.apply();
    this.diamond.display();
    this.scene.popMatrix();

    // Big Triangle 1
    this.scene.pushMatrix();
    this.scene.translate(2, 0, 0);
    this.materials.triangleBig1.apply();
    this.triangleBig1.display();
    this.scene.popMatrix();

    // Small Triangle 1
    this.scene.pushMatrix();
    this.scene.translate(5, 0, 0);
    this.materials.triangleSmall1.apply();
    this.triangleSmall1.display();
    this.scene.popMatrix();

    // Big Triangle 2
    this.scene.pushMatrix();
    this.scene.translate(1.4, -1.4, 0);
    this.scene.rotate(Math.PI / 4, 0, 0, 1);
    this.materials.triangleBig2.apply();
    this.triangleBig2.display();
    this.scene.popMatrix();

    // Small Triangle 2
    this.scene.pushMatrix();
    this.scene.translate(0, -3.8, 0);
    this.materials.triangleSmall2.apply();
    this.triangleSmall2.display();
    this.scene.popMatrix();

    // Triangle
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 0, 1);
    this.scene.translate(-1, 1, 0);
    this.materials.triangle.apply();
    this.triangle.display();
    this.scene.popMatrix();

    // Parallelogram
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.rotate(0.75 * Math.PI, 0, 0, 1);
    this.scene.translate(1.6, -1.23, 0);
    this.materials.parallelogram.apply();
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
