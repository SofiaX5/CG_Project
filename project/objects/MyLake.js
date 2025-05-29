import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../../lib/CGF.js';
import { MyPlane } from "../geometry/MyPlane.js";

/**
 * MyLake
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Lake constants
        this.LAKE = {
            SIDE: 200,
            PLANE_DIVISIONS: 64,
            INTENSITY_FACTOR: 1.0,
            SHININESS: 10.0
        };

        this.side = this.LAKE.SIDE;
        this.lastTime = 0;

        this.plane = new MyPlane(this.scene, this.LAKE.PLANE_DIVISIONS);

        // Initialize materials and shaders
        this.initMaterials();
        this.initShaders();
    }

    initMaterials() {
        // Create textures
        this.lakeTexture = new CGFtexture(this.scene, "textures/lake/lake_text.jpg");
        this.grassTexture = new CGFtexture(this.scene, "textures/general/grass.jpg");
        this.rockTexture = new CGFtexture(this.scene, "textures/general/rock.jpg");
        this.lakeMap = new CGFtexture(this.scene, "textures/lake/lake_map.jpg");

        // Create lake appearance
        this.lakeAppearance = new CGFappearance(this.scene);
        this.lakeAppearance.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.lakeAppearance.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.lakeAppearance.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.lakeAppearance.setShininess(this.LAKE.SHININESS);
        this.lakeAppearance.setEmission(0.9, 0.3, 0.0, 1.0);
    }

    initShaders() {
        this.lakeShader = new CGFshader(
            this.scene.gl,
            "shaders/lake.vert",
            "shaders/lake.frag"
        );
        this.lakeShader.setUniformsValues({
            timeFactor: 0,
            intensityFactor: this.LAKE.INTENSITY_FACTOR,
            uSampler: 0,
            uLakeMap: 1,
            uGrassSampler: 2,
            uRockSampler: 3
        });
    }

    display() {
        this.scene.pushMatrix();
        
        this.lakeAppearance.apply();
        this.scene.setActiveShader(this.lakeShader);
        
        this.lakeTexture.bind(0);
        this.lakeMap.bind(1);
        this.grassTexture.bind(2);
        this.rockTexture.bind(3);
       
        this.plane.display();
        
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }

    update(t) {
        if (this.lastTime === 0) {
            this.lastTime = t;
            return;
        }
        this.lastTime = t;
       
        const timeFactor = t / 1000.0 % 1000;
        this.lakeShader.setUniformsValues({ timeFactor: timeFactor });
    }
}