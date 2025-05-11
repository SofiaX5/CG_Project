import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

/**
 * MyFire
 * @constructor
 * @param scene - Reference to MyScene object
 * @param position - Position of the fire [x, y, z]
 * @param size - Size of the fire
 * @param flameCount - Number of flame triangles to generate
 */
export class MyFire extends CGFobject {
    constructor(scene, position = [0, 0, 0], size = 5, flameCount = 15) {
        super(scene);
        
        this.position = position;
        this.size = size;
        this.flameCount = flameCount;
        
        this.lastTime = 0;
        this.flames = [];
        
        this.initMaterials();
        this.initShaders();
        this.createFlames();
    }

    initMaterials() {
        this.fireAppearance = new CGFappearance(this.scene);
        this.fireAppearance.setAmbient(0.6, 0.3, 0.1, 1.0);
        this.fireAppearance.setDiffuse(0.8, 0.4, 0.1, 1.0);
        this.fireAppearance.setSpecular(1.0, 0.5, 0.0, 1.0);
        this.fireAppearance.setEmission(0.9, 0.3, 0.0, 1.0);
        this.fireAppearance.setShininess(120);
        
        this.fireTexture = new CGFtexture(this.scene, "textures/fire/flame.jpg");
        this.fireAppearance.setTexture(this.fireTexture);
        this.fireAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }
    

    initShaders() {
        this.flameShader = new CGFshader(
            this.scene.gl, 
            "shaders/flame.vert", 
            "shaders/flame.frag"
        );
        
        this.flameShader.setUniformsValues({
            timeFactor: 0,
            intensityFactor: 1.0,
            particleSize: 8,
            uSampler: 0
        });
    }
    

    createFlames() {
        for (let i = 0; i < this.flameCount; i++) {
            const triangle = new MyTriangle(this.scene);
            
            const flame = {
                triangle: triangle,
                height: this.getRandomValue(0.6, 1.0) * this.size,
                width: this.getRandomValue(0.3, 0.7) * this.size,
                angle: this.getRandomValue(0, Math.PI * 2),
                phase: this.getRandomValue(0, Math.PI * 2),
                speed: this.getRandomValue(0.5, 2.0),
                offsetX: this.getRandomValue(-this.size/2, this.size/2),
                offsetZ: this.getRandomValue(-this.size/2, this.size/2),
                offsetY: this.getRandomValue(-0.2, 0.2) * this.size,
                colorVariation: this.getRandomValue(0.7, 1.3)
            };
            
            this.flames.push(flame);
        }
                /*
        const smallFlameCount = Math.floor(this.flameCount / 3);
        for (let i = 0; i < smallFlameCount; i++) {
            const triangle = new MyTriangle(this.scene);
            
            const flame = {
                triangle: triangle,
                height: this.getRandomValue(0.3, 0.6) * this.size,  
                width: this.getRandomValue(0.2, 0.4) * this.size,    
                angle: this.getRandomValue(0, Math.PI * 2),
                phase: this.getRandomValue(0, Math.PI * 2),
                speed: this.getRandomValue(0.5, 1.5),
                offsetX: this.getRandomValue(-this.size/2.5, this.size/2.5),
                offsetZ: this.getRandomValue(-this.size/2.5, this.size/2.5),
                offsetY: this.getRandomValue(-0.4, -0.1) * this.size, 
                colorVariation: this.getRandomValue(1.0, 1.8)        
            };
            
            this.flames.push(flame);
        }*/
    }

    update(t) {
        if (this.lastTime === 0) {
            this.lastTime = t;
            return;
        }
        
        const elapsed = (t - this.lastTime) / 1000.0; 
        this.lastTime = t;
        
        const timeFactor = t / 1000.0 % 1000;
        this.flameShader.setUniformsValues({ timeFactor: timeFactor });
    }
    

    display() {
        this.scene.pushMatrix();
        
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        
        this.scene.setActiveShader(this.flameShader);
        this.fireTexture.bind(0);
        this.fireAppearance.apply();
        
        for (let i = 0; i < this.flames.length; i++) {
            const flame = this.flames[i];
            
            this.scene.pushMatrix();
            this.scene.translate(flame.offsetX, 0, flame.offsetZ);
            this.scene.rotate(flame.angle, 0, 1, 0);
            this.scene.scale(flame.width, flame.height, 1);
            flame.triangle.display();
            this.scene.popMatrix();
        }
        
        this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
    

    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }
}