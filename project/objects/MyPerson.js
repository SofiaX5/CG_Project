import {CGFobject, CGFappearance, CGFtexture, CGFshader} from '../../lib/CGF.js';
import {MyWindow} from './MyWindow.js';
import {MyPlane} from '../geometry/MyPlane.js';
import {MyCircle} from '../geometry/MyCircle.js';
import {MyCylinder} from '../geometry/MyCylinder.js';
import {MyCube} from '../geometry/MyCube.js';
import {MySphere} from '../geometry/MySphere.js';

/**
 * MyPerson
 * @constructor
* @param {CGFscene} scene - Reference to MyScene object
 */
export class MyPerson extends CGFobject {
    constructor(scene, texturePath, armsUp = false) {
        super(scene);
        this.scene = scene;
        this.texturePath = texturePath;
        this.armsUp = armsUp;

        this.celebrating = false;
        this.celebrationStartTime = 0;
        this.celebrationDuration = 5000; // 5 seconds
        this.particles = [];
        this.maxParticles = 50;
        this.particleColors = [
            [1.0, 0.0, 0.0], // Red
            [0.0, 1.0, 0.0], // Green
            [0.0, 0.0, 1.0], // Blue
            [1.0, 1.0, 0.0], // Yellow
            [1.0, 0.0, 1.0], // Magenta
            [0.0, 1.0, 1.0], // Cyan
            [1.0, 0.5, 0.0], // Orange
            [0.5, 0.0, 1.0]  // Purple
        ];

        // Person constants
        this.PERSON = {
            HEAD_SIZE: 0.15,
            TORSO_WIDTH: 0.3,
            TORSO_HEIGHT: 0.4,
            TORSO_DEPTH: 0.15,
            ARM_WIDTH: 0.1,
            ARM_HEIGHT: 0.4,
            ARM_DEPTH: 0.1,
            LEG_WIDTH: 0.12,
            LEG_HEIGHT: 0.4,
            LEG_DEPTH: 0.12
        };

        this.lastTime = 0;


        this.plane = new MyPlane(scene, 20);
        this.circle = new MyCircle(scene, 30);
        this.cylinder = new MyCylinder(scene, 30, 1, 0.7);
        this.cube = new MyCube(scene);
        this.sphere = new MySphere(scene, 30, 30);

        this.clothTexture = new CGFtexture(scene, this.texturePath);
        this.clothAppearance = new CGFappearance(scene);
        this.clothAppearance.setTexture(this.clothTexture);
        this.clothAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.faceTexture = new CGFtexture(scene, "textures/people/face.jpg");
        this.faceAppearance = new CGFappearance(scene);
        this.faceAppearance.setTexture(this.faceTexture);
        this.faceAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.bodyTexture = new CGFtexture(scene, "textures/people/body.jpg");
        this.bodyAppearance = new CGFappearance(scene);
        this.bodyAppearance.setTexture(this.bodyTexture);
        this.bodyAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.initParticles();
    
        

    }

    display() {
        this.scene.pushMatrix();
        
        // Add jumping animation only before and during celebration (not after)
        if (this.armsUp || this.celebrating) {
            const jumpHeight = 0.1; // Maximum jump height
            const jumpSpeed = 3.0;   // Jump frequency
            const currentTime = Date.now() / 1000.0; // Convert to seconds
            const jumpOffset = Math.abs(Math.sin(currentTime * jumpSpeed)) * jumpHeight;
            
            this.scene.translate(0, jumpOffset, 0);
        }
        
        this.drawHead();
        this.drawBody();
        this.drawArms();
        this.drawLegs();
        
        // Render particles on top
        this.renderParticles();
        
        this.scene.popMatrix();
    }

    update(t) {
        if (this.lastTime === 0) {
            this.lastTime = t;
            return;
        }
        
        const deltaTime = t - this.lastTime;
        this.lastTime = t;
        
        // Update celebration system
        if (this.celebrating) {
            const currentTime = Date.now();
            if (currentTime - this.celebrationStartTime >= this.celebrationDuration) {
                // End celebration
                this.celebrating = false;
                this.armsUp = false; // Put arms down
                
                // Deactivate all particles
                for (let particle of this.particles) {
                    particle.active = false;
                }
            } else {
                this.updateParticles(deltaTime);
            }
        }
        
        const timeFactor = t / 1000.0 % 1000;
    }

    drawHead() {
        this.scene.pushMatrix();
        this.faceAppearance.apply(); 
        this.scene.translate(0, this.PERSON.TORSO_HEIGHT - this.PERSON.HEAD_SIZE / 3, 0);
        this.scene.scale(this.PERSON.HEAD_SIZE, this.PERSON.HEAD_SIZE, this.PERSON.HEAD_SIZE);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.sphere.display();
        this.scene.popMatrix();
    }

        
    drawBody() {
        this.scene.pushMatrix();
        this.clothAppearance.apply();
        this.scene.translate(0, 0, 0);
        this.scene.scale(this.PERSON.TORSO_WIDTH, this.PERSON.TORSO_HEIGHT, this.PERSON.TORSO_DEPTH);
        this.cube.display();
        this.scene.popMatrix();
    }

    drawArms() {
        this.scene.pushMatrix();
        this.bodyAppearance.apply(); 
        this.scene.translate(-(this.PERSON.TORSO_WIDTH/2 + this.PERSON.ARM_WIDTH/2), 
                            this.PERSON.TORSO_HEIGHT/2 - this.PERSON.ARM_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.ARM_WIDTH, this.PERSON.ARM_HEIGHT, this.PERSON.ARM_DEPTH);
        if (this.armsUp) {
            this.scene.translate(0, this.PERSON.TORSO_HEIGHT + this.PERSON.ARM_HEIGHT, 0);
        }
        this.cube.display();
        this.scene.popMatrix();

        // Right arm
        this.scene.pushMatrix();
        this.scene.translate((this.PERSON.TORSO_WIDTH/2 + this.PERSON.ARM_WIDTH/2), 
                            this.PERSON.TORSO_HEIGHT/2 - this.PERSON.ARM_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.ARM_WIDTH, this.PERSON.ARM_HEIGHT, this.PERSON.ARM_DEPTH);
        if (this.armsUp) {
            this.scene.translate(0, this.PERSON.TORSO_HEIGHT + this.PERSON.ARM_HEIGHT, 0);
        }
        this.cube.display();
        this.scene.popMatrix();
    }

    drawLegs() {
        // Left leg
        this.scene.pushMatrix();
        this.bodyAppearance.apply(); 
        this.scene.translate(-this.PERSON.LEG_WIDTH/2, -this.PERSON.LEG_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.LEG_WIDTH, this.PERSON.LEG_HEIGHT, this.PERSON.LEG_DEPTH);
        this.cube.display();
        this.scene.popMatrix();

        // Right leg
        this.scene.pushMatrix();
        this.bodyAppearance.apply(); 
        this.scene.translate(this.PERSON.LEG_WIDTH/2, -this.PERSON.LEG_HEIGHT/2, 0);
        this.scene.scale(this.PERSON.LEG_WIDTH, this.PERSON.LEG_HEIGHT, this.PERSON.LEG_DEPTH);
        this.cube.display();
        this.scene.popMatrix();
    }
        
    getLastTime() {
        return this.lastTime;
    }

    setLastTime(t) {
        this.lastTime = t;
    }

    initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                life: 0,
                maxLife: Math.random() * 2000 + 1000, // 1-3 seconds
                color: this.particleColors[Math.floor(Math.random() * this.particleColors.length)],
                size: Math.random() * 0.05 + 0.02, // 0.02-0.07
                active: false
            });
        }
    }

    startCelebration() {
        if (!this.celebrating) {
            this.celebrating = true;
            this.celebrationStartTime = Date.now();
            this.armsUp = true; // Keep arms up during celebration
            
            // Activate particles
            for (let i = 0; i < this.maxParticles; i++) {
                this.resetParticle(i);
            }
        }
    }

    resetParticle(index) {
        const particle = this.particles[index];
        particle.position = [
            (Math.random() - 0.5) * 0.2, // Random around person
            this.PERSON.TORSO_HEIGHT * 0.8, // Start from chest level
            (Math.random() - 0.5) * 0.2
        ];
        particle.velocity = [
            (Math.random() - 0.5) * 0.003, // X velocity
            Math.random() * 0.005 + 0.003, // Upward Y velocity
            (Math.random() - 0.5) * 0.003  // Z velocity
        ];
        particle.life = 0;
        particle.maxLife = Math.random() * 2000 + 1000;
        particle.color = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
        particle.size = Math.random() * 0.05 + 0.02;
        particle.active = true;
    }

    updateParticles(deltaTime) {
        if (!this.celebrating) return;
        
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            // Update particle life
            particle.life += deltaTime;
            
            // Update position
            particle.position[0] += particle.velocity[0] * deltaTime;
            particle.position[1] += particle.velocity[1] * deltaTime;
            particle.position[2] += particle.velocity[2] * deltaTime;
            
            // Apply gravity
            particle.velocity[1] -= 0.000005 * deltaTime;
            
            // Check if particle should be reset or deactivated
            if (particle.life >= particle.maxLife) {
                const currentTime = Date.now();
                if (currentTime - this.celebrationStartTime < this.celebrationDuration) {
                    // Reset particle if still celebrating
                    this.resetParticle(i);
                } else {
                    // Deactivate particle if celebration is over
                    particle.active = false;
                }
            }
        }
    }

    // NEW: Render particles
    renderParticles() {
        if (!this.celebrating) return;
        
        // Disable depth writing for particles to avoid sorting issues
        this.scene.gl.depthMask(false);
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE);
        
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            // Calculate alpha based on life
            const alpha = 1.0 - (particle.life / particle.maxLife);
            
            this.scene.pushMatrix();
            this.scene.translate(...particle.position);
            this.scene.scale(particle.size, particle.size, particle.size);
            
            // Set particle color
            this.scene.setAmbient(...particle.color, alpha);
            this.scene.setDiffuse(...particle.color, alpha);
            this.scene.setSpecular(1.0, 1.0, 1.0, alpha);
            this.scene.setEmission(...particle.color, alpha * 0.3);
            
            // Use sphere for particle (efficient single geometry)
            this.sphere.display();
            this.scene.popMatrix();
        }
        
        // Re-enable depth writing
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }



}