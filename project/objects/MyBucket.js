import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MySphere } from '../geometry/MySphere.js';
import { MyCone } from '../geometry/MyCone.js';
import { MyCircle } from '../geometry/MyCircle.js';
import { MyCylinder } from '../geometry/MyCylinder.js';

/**
 * MyBucket 
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 */
export class MyBucket extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // Bucket constants
        this.BUCKET = {
            RADIUS: 0.8,
            HEIGHT: 1.2,
            RIM_THICKNESS_RATIO: 0.08,
            RIM_RADIUS_RATIO: 1.08,
            WATER_RADIUS_RATIO: 0.85,
            WATER_HEIGHT_RATIO: 0.2,
            HANDLE_RADIUS_RATIO: 0.8,
            HANDLE_TUBE_RATIO: 0.06,
            BOTTOM_SCALE: 1.4
        };
        
        // Animation states
        this.waterLevel = 0;
        this.bottomOpen = 0; // 0 = closed, 1 = open
        this.isEmpty = true;
        this.waterFallProgress = 0;
        this.waterSplayed = 0;
        this.waterFading = false;
        this.fadeProgress = 0;
        this.fadeProgressSplash = 0;
        
        this.initObjects();
        this.initMaterials();
    }
    
    initObjects() {
        this.sphere = new MySphere(this.scene, 20, 20);
        this.cone = new MyCone(this.scene, 20, 1, 1);
        this.circle = new MyCircle(this.scene, 30);
        this.halfCircle = new MyCircle(this.scene, 30, undefined, undefined, undefined, undefined, true);
        this.cylinder = new MyCylinder(this.scene, 20, 5);
        this.bucketCylinder = new MyCylinder(this.scene, 20, 5, 0.7);
    }
    
    initMaterials() {
        // Metal material for bucket
        this.metalMaterial = new CGFappearance(this.scene);
        this.metalMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.metalMaterial.setDiffuse(0.25, 0.25, 0.25, 1);
        this.metalMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalMaterial.setShininess(120);
        
        // Metal accents for handle
        this.metalAccentsMaterial = new CGFappearance(this.scene);
        this.metalAccentsMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.metalAccentsMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.metalAccentsMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalAccentsMaterial.setShininess(100);
        this.metalAccentsTexture = new CGFtexture(this.scene, "textures/helicopter/metal.jpg");
        this.metalAccentsMaterial.setTexture(this.metalAccentsTexture);
        this.metalAccentsMaterial.setTextureWrap('REPEAT', 'REPEAT');
        
        // Water material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.4, 0.4, 0.4, 1);
        this.waterMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.waterMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.waterMaterial.setShininess(140);
        this.waterTexture = new CGFtexture(this.scene, "textures/helicopter/water.jpg");
        this.waterMaterial.setTexture(this.waterTexture);
    }
    
    update(deltaTime) {
        // Animation logic for bucket states can be handled here
        // Currently managed by helicopter, but could be moved here for better encapsulation
    }
    
    display(ropeLength, currentRopeLength, isDropping = false) {
        if (currentRopeLength <= 0) return;
        
        // Draw rope
        this.drawRope(ropeLength, currentRopeLength);
        
        // Only draw bucket if rope is deployed enough
        if (currentRopeLength >= ropeLength * 0.25) {
            this.drawBucketBody(currentRopeLength);
            this.drawBucketRim(currentRopeLength);
            this.drawBucketHandle(currentRopeLength);
            
            if (!this.isEmpty) {
                this.drawWater(currentRopeLength);
            }
            
            if (isDropping) {
                this.drawOpeningBottom(currentRopeLength);
            } else {
                this.drawBucketBottom(currentRopeLength);
            }
        }
    }
    
    drawRope(ropeLength, currentRopeLength) {
        this.scene.pushMatrix();
        this.metalAccentsMaterial.apply();
        this.scene.translate(0, -1.25, 0); // Adjust based on helicopter body height
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, currentRopeLength - this.BUCKET.HEIGHT - 0.2);
        this.cylinder.display();
        this.scene.popMatrix();
    }
    
    drawBucketBody(currentRopeLength) {
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(this.BUCKET.RADIUS, this.BUCKET.RADIUS, this.BUCKET.RADIUS * 1.3);
        this.bucketCylinder.display();
        this.scene.popMatrix();
    }
    
    drawBucketRim(currentRopeLength) {
        const rimThickness = this.BUCKET.HEIGHT * this.BUCKET.RIM_THICKNESS_RATIO;
        const rimRadius = this.BUCKET.RADIUS * this.BUCKET.RIM_RADIUS_RATIO;
        
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(rimRadius, rimRadius, rimThickness);
        this.bucketCylinder.display();
        this.scene.popMatrix();
    }
    
    drawBucketHandle(currentRopeLength) {
        this.scene.pushMatrix();
        this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT/2 - 0.2, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(1.6, 1.6, 1.6);
        this.drawHandle();
        this.scene.popMatrix();
    }
    
    drawHandle() {
        this.scene.pushMatrix();
        this.metalAccentsMaterial.apply();
        
        const handleRadius = this.BUCKET.RADIUS * this.BUCKET.HANDLE_RADIUS_RATIO;
        const tubeRadius = this.BUCKET.RADIUS * this.BUCKET.HANDLE_TUBE_RATIO;
        const arcAngle = Math.PI;
        const arcSegments = 16;
        
        // Draw arc segments
        for (let i = 0; i < arcSegments - 1; i++) {
            const angle1 = Math.PI - (i / arcSegments) * arcAngle;
            const angle2 = Math.PI - ((i + 1) / arcSegments) * arcAngle;
            
            const x1 = handleRadius * Math.cos(angle1);
            const y1 = handleRadius * Math.sin(angle1);
            const x2 = handleRadius * Math.cos(angle2);
            const y2 = handleRadius * Math.sin(angle2);
            
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const segmentAngle = Math.atan2(y2 - y1, x2 - x1);
            const segmentLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            
            this.scene.pushMatrix();
            this.scene.translate(midX, midY, 0);
            this.scene.rotate(segmentAngle + Math.PI/2, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(tubeRadius, tubeRadius, segmentLength);
            this.cylinder.display();
            this.scene.popMatrix();
        }
        
        // Connection spheres and side connections
        this.drawHandleConnections(handleRadius, tubeRadius);
        this.scene.popMatrix();
    }
    
    drawHandleConnections(handleRadius, tubeRadius) {
        // Left and right connection spheres
        [handleRadius, -handleRadius].forEach(x => {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, 0);
            this.scene.scale(tubeRadius * 1.2, tubeRadius * 1.2, tubeRadius * 1.2);
            this.sphere.display();
            this.scene.popMatrix();
        });
        
        // Side connection cylinders
        [1, -1].forEach(side => {
            this.scene.pushMatrix();
            this.scene.translate((handleRadius - tubeRadius * 4) * side, 0, 0);
            this.scene.rotate(Math.PI/2 * side, 0, 1, 0);
            this.scene.scale(tubeRadius/2, tubeRadius, this.BUCKET.HEIGHT * 0.2);
            this.cylinder.display();
            this.scene.popMatrix();
        });
    }
    
    drawWater(currentRopeLength) {
        this.scene.pushMatrix();
        this.waterMaterial.apply();
        this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT * 0.5 - 0.25 + this.waterLevel, 0);
        this.scene.scale(
            this.BUCKET.RADIUS * this.BUCKET.WATER_RADIUS_RATIO + this.waterLevel,
            this.BUCKET.HEIGHT * this.BUCKET.WATER_HEIGHT_RATIO,
            this.BUCKET.RADIUS * this.BUCKET.WATER_RADIUS_RATIO + this.waterLevel
        );
        this.sphere.display();
        this.scene.popMatrix();
    }
    
    drawBucketBottom(currentRopeLength) {
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT * 1.15, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(
            this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE,
            this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE,
            this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE
        );
        this.circle.display();
        this.scene.popMatrix();
    }
    
    drawOpeningBottom(currentRopeLength) {
        const openingAngle = this.bottomOpen * Math.PI * 0.5;
        
        // Left and right opening halves
        [1, -1].forEach(side => {
            this.scene.pushMatrix();
            this.scene.translate(
                0,
                -Math.sin(openingAngle) * this.BUCKET.RADIUS * 0.7,
                side * ((Math.cos(openingAngle) - (1 - openingAngle)) * this.BUCKET.RADIUS * 0.7 + this.bottomOpen * 0.2)
            );
            
            this.scene.pushMatrix();
            this.metalMaterial.apply();
            this.scene.translate(0, -currentRopeLength - this.BUCKET.HEIGHT * 1.35, 0);
            this.scene.rotate(openingAngle * side, 1, 0, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            if (side === 1) this.scene.scale(1, -1, 1); // Invert texture for one side
            this.scene.scale(
                this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE,
                this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE,
                this.BUCKET.RADIUS * this.BUCKET.BOTTOM_SCALE
            );
            this.halfCircle.display();
            this.scene.popMatrix();
            
            this.scene.popMatrix();
        });
    }
    
    drawWaterFall(currentRopeLength) {
        if (this.waterFallProgress <= 0 && !this.waterFading) return;        
        const bottomY = -currentRopeLength - this.BUCKET.HEIGHT * 1.15;
        const waterStartY = bottomY;
        const waterEndY = bottomY - 12 * this.waterFallProgress;
        const startRadius = this.BUCKET.RADIUS * 0.8;
        const endRadius = this.BUCKET.RADIUS * 1.5 * this.waterFallProgress;
        
        this.waterMaterial.apply();
        
        // Draw water particles
        this.drawWaterParticles(waterStartY, waterEndY, startRadius, endRadius);
        
        // Draw main water cone
        this.scene.pushMatrix();
        const coneHeight = (waterStartY - waterEndY);
        this.scene.translate(0, waterEndY, 0);
        const fadeScale = this.waterFading ? (1 - this.fadeProgress) : 1;
        this.scene.scale(endRadius * fadeScale, coneHeight * fadeScale, endRadius * fadeScale);
        this.cone.display();
        this.scene.popMatrix();
        
        // Draw splash effect if water has reached ground
        if (this.waterFallProgress >= 1) {
            this.drawSplashEffect(waterEndY, endRadius);
        }
    }
    
    drawWaterParticles(waterStartY, waterEndY, startRadius, endRadius) {
        const numParticles = 15;
        const particleSize = this.BUCKET.RADIUS * 0.1;
        
        for (let i = 0; i < numParticles; i++) {
            const progress = i / numParticles;
            const particleY = waterStartY - (waterStartY - waterEndY) * progress * this.waterFallProgress;
            const radius = startRadius + (endRadius - startRadius) * progress * this.waterFallProgress;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const particleX = Math.cos(angle) * distance;
            const particleZ = Math.sin(angle) * distance;
            
            this.scene.pushMatrix();
            this.scene.translate(particleX, particleY, particleZ);
            const fadeScale = this.waterFading ? (1 - this.fadeProgress) : 1;
            this.scene.scale(particleSize * fadeScale, particleSize * fadeScale, particleSize * fadeScale);
            this.sphere.display();
            this.scene.popMatrix();
        }
    }
    
    drawSplashEffect(waterEndY, endRadius) {
        const splashRadius = endRadius * 1.8 * this.waterSplayed;
        
        // Ground splash
        this.scene.pushMatrix();
        this.scene.translate(0, waterEndY - 0.3, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        const fadeScale = this.waterFading ? (1 - this.fadeProgressSplash) : 1; 
        this.scene.scale(
            splashRadius * (1 + 6 * this.waterSplayed) * fadeScale,
            splashRadius * (1 + 6 * this.waterSplayed) * fadeScale,
            1 * fadeScale
        );
        this.circle.display();
        this.scene.popMatrix();
        
        // Splash droplets
        const numSplashDrops = 12;
        const dropSize = this.BUCKET.RADIUS * 0.08;
        
        for (let i = 0; i < numSplashDrops; i++) {
            const splashAngle = (i / numSplashDrops) * Math.PI * 2;
            const distanceFromCenter = splashRadius * 0.8;
            const dropX = Math.cos(splashAngle) * distanceFromCenter;
            const dropZ = Math.sin(splashAngle) * distanceFromCenter;
            const dropY = waterEndY + 0.1 + Math.random() * 0.2;
            
            this.scene.pushMatrix();
            this.scene.translate(dropX, dropY, dropZ);
            const fadeScale = this.waterFading ? (1 - this.fadeProgressSplash) : 1; 
            this.scene.scale(dropSize * fadeScale, dropSize * fadeScale, dropSize * fadeScale);
            this.sphere.display();
            this.scene.popMatrix();
        }
    }
    
    // Bucket state management
    fill() {
        this.isEmpty = false;
        this.waterLevel = 0;
    }
    
    empty() {
        this.isEmpty = true;
        this.waterLevel = 0;
        this.waterFallProgress = 0;
        this.waterSplayed = 0;
        this.bottomOpen = 0;
    }
    
    startWaterDrop() {
        this.waterFallProgress = 0;
        this.waterSplayed = 0;
        this.bottomOpen = 0;
    }
    
    updateWaterDrop(deltaTime) {
        if (this.bottomOpen < 1) {
            this.bottomOpen += 0.09;
            if (this.bottomOpen > 1) this.bottomOpen = 1;
        }

        let fireExtinguished = false;
        
        if (this.waterFallProgress < 1) {
            this.waterFallProgress += 0.03;
            this.waterLevel -= 0.015;
        } else {
            this.waterFallProgress = 1;
            if (this.waterSplayed < 1) {
                this.waterSplayed += 0.01;
            } else {
            if (!this.waterFading) {
                this.waterFading = true;
                this.fadeProgress = 0;
                this.fadeProgressSplash = 0;
                } else {
                    // First fade the cone and particles
                    if (this.fadeProgress < 1) {
                        this.fadeProgress += 0.02;
                    } else {
                        fireExtinguished = true;
                        // Then fade the splash effect
                        this.fadeProgressSplash += 0.02;
                        if (this.fadeProgressSplash >= 1) {
                            this.empty();
                            this.waterFading = false;
                            this.fadeProgress = 0;
                            this.fadeProgressSplash = 0;
                            return { waterDropComplete: true, fireExtinguished: true };; // Water drop complete
                        }
                    }
                }
            }
        }
        return { waterDropComplete: false, fireExtinguished: fireExtinguished };
    }
}