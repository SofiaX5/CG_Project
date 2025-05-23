import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../../lib/CGF.js';
import { MyTaperedTriangle } from '../geometry/MyTaperedTriangle.js'; 
import {getRandomValue} from '../Utils.js';


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

        // Fire constants
        this.FIRE= {
            FLAME_HEIGHT_MIN: 0.6,
            FLAME_HEIGHT_MAX: 1.0,
            FLAME_WIDTH_MIN: 0.3,
            FLAME_WIDTH_MAX: 0.7,
            SPEED_MIN: 0.5,
            SPEED_MAX: 2.0,
            SWAY_AMPLITUDE_MIN: 0.1,
            SWAY_AMPLITUDE_MAX: 0.3,
            SWAY_FREQUENCY_MIN: 1.0,
            SWAY_FREQUENCY_MAX: 3.0,
            COLOR_VARIATION_MIN: 0.7,
            COLOR_VARIATION_MAX: 1.3,
            SMALL_FLAME_RATIO: 1/3,
            SMALL_FLAME_HEIGHT_RATIO: 0.5,
            SMALL_FLAME_WIDTH_RATIO: 0.6,
            RISE_SPEED_MIN: 0.5,
            RISE_SPEED_MAX: 1.5,
            TWIST_FACTOR_MIN: 0.5,
            TWIST_FACTOR_MAX: 2.0,
            SMALL_HEIGHT_MIN: 0.3,
            SMALL_HEIGHT_MAX: 0.6,
            SMALL_WIDTH_MIN: 0.2,
            SMALL_WIDTH_MAX: 0.4,
            SMALL_COLOR_VAR_MIN: 1.0,
            SMALL_COLOR_VAR_MAX: 1.8  
        };
        
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
        const triangle = new MyTaperedTriangle(this.scene);
        
        const flame = {
            triangle: triangle,
            height: getRandomValue(this.FIRE.FLAME_HEIGHT_MIN, this.FIRE.FLAME_HEIGHT_MAX) * this.size,
            width: getRandomValue(this.FIRE.FLAME_WIDTH_MIN, this.FIRE.FLAME_WIDTH_MAX) * this.size,
            angle: getRandomValue(0, Math.PI * 2),
            phase: getRandomValue(0, Math.PI * 2),
            speed: getRandomValue(this.FIRE.SPEED_MIN, this.FIRE.SPEED_MAX),
            offsetX: getRandomValue(-this.size/2, this.size/2),
            offsetZ: getRandomValue(-this.size/2, this.size/2),
            offsetY: getRandomValue(-0.2, 0.2) * this.size,
            colorVariation: getRandomValue(this.FIRE.COLOR_VARIATION_MIN, this.FIRE.COLOR_VARIATION_MAX),

            swayAmplitude: getRandomValue(this.FIRE.SWAY_AMPLITUDE_MIN,this.FIRE.SWAY_AMPLITUDE_MAX),
            swayFrequency: getRandomValue(this.FIRE.SWAY_FREQUENCY_MIN, this.FIRE.SWAY_FREQUENCY_MAX),
            riseSpeed: getRandomValue(this.FIRE.RISE_SPEED_MIN, this.FIRE.RISE_SPEED_MAX),
            twistFactor: getRandomValue(this.FIRE.TWIST_FACTOR_MIN, this.FIRE.TWIST_FACTOR_MAX)
        };
        
        this.flames.push(flame);
    }

                
        const smallFlameCount = Math.floor(this.flameCount * this.FIRE.SMALL_FLAME_RATIO);
        for (let i = 0; i < smallFlameCount; i++) {
            const triangle = new MyTaperedTriangle(this.scene);
            
            const flame = {
                triangle: triangle,
                height: getRandomValue(this.FIRE.SMALL_HEIGHT_MIN, this.FIRE.SMALL_HEIGHT_MAX) * this.size,  
                width: getRandomValue(this.FIRE.SMALL_WIDTH_MIN, this.FIRE.SMALL_WIDTH_MAX) * this.size,   
                angle: getRandomValue(0, Math.PI * 2),
                phase: getRandomValue(0, Math.PI * 2),
                speed: getRandomValue(0.5, 1.5),
                offsetX: getRandomValue(-this.size/2.5, this.size/2.5),
                offsetZ: getRandomValue(-this.size/2.5, this.size/2.5),
                offsetY: getRandomValue(-0.4, -0.1) * this.size, 
                colorVariation: getRandomValue(this.FIRE.SMALL_COLOR_VAR_MIN, this.FIRE.SMALL_COLOR_VAR_MAX)      
            };
            
            this.flames.push(flame);
        }
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
            
            this.flameShader.setUniformsValues({
            swayAmplitude: flame.swayAmplitude,
            swayFrequency: flame.swayFrequency,
            riseSpeed: flame.riseSpeed,
            twistFactor: flame.twistFactor
        });

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
    

}