import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import {MySphere} from '../geometry/MySphere.js';
import {MyCone} from '../geometry/MyCone.js';
import {MyPlane} from '../geometry/MyPlane.js';
import {MyCircle} from '../geometry/MyCircle.js';
import {MyCylinder} from '../geometry/MyCylinder.js';
import {MyCube} from '../geometry/MyCube.js';
import {MyCustomParallelogram} from '../geometry/MyParallelogram.js';
import {MyMustache} from '../objects/MyMustache.js';
import {MyBucket} from '../objects/MyBucket.js';

/**
 * MyHeli - Helicopter model for firefighting
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene, posX=0, posY=0, posZ=0, angleYY=0, speed=0.01, speedFactor = 1, cruisingHeight = 5, hasBucket = true, specialMode = false) {
        super(scene);
        
        // Helicopter constants
        this.HELI = {
            // Physical dimensions
            BODY_LENGTH: 6,
            BODY_WIDTH: 2.5,
            BODY_HEIGHT: 2.5,
            TAIL_LENGTH: 8,
            TAIL_RADIUS: 0.4,
            MAIN_ROTOR_RADIUS: 5,
            TAIL_ROTOR_RADIUS: 3,
            BUCKET_RADIUS: 0.8,
            BUCKET_HEIGHT: 1.2,
            
            // Animation parameters
            MAX_ROTOR_SPEED: 0.01,
            ROPE_LENGTH: 5,
            ROPE_SPEED: 0.05,
            TAKE_OFF_AND_LAND_SPEED: 0.1,
            
            // Movement parameters
            MAX_TILT_ANGLE: 0.15,
            TILT_SPEED: 0.005,
            HEIGHT_ADJUSTMENT_SPEED: 0.05,
            LANDING_MOVEMENT_SPACE: 0.2,
            
            // Animation durations
            ANIMATION_DURATION: 3000, // 3 seconds for takeoff/landing
            
            // Area boundaries
            LAKE_BOUNDS: { minX: -56, maxX: -28, minZ: 14, maxZ: 48 },
            FIRE_BOUNDS: { minX: 9, maxX: 40, minZ: 14, maxZ: 35 }
        };
        
        // Initialize properties
        this.initDimensions();
        this.initAnimationVariables();
        this.initPositionAndMovement(posX, posY, posZ, angleYY, speed, speedFactor);
        this.initTiltParameters();
        this.initHeliState(cruisingHeight, posY);
        this.initSpecialMode(specialMode);
        this.initBucketSystem(hasBucket);
        
        this.initObjects();
        this.initMaterials();
    }
    
    // ===== INITIALIZATION METHODS =====
    
    initDimensions() {
        this.bodyLength = this.HELI.BODY_LENGTH;
        this.bodyWidth = this.HELI.BODY_WIDTH;
        this.bodyHeight = this.HELI.BODY_HEIGHT;
        this.tailLength = this.HELI.TAIL_LENGTH;
        this.tailRadius = this.HELI.TAIL_RADIUS;
        this.mainRotorRadius = this.HELI.MAIN_ROTOR_RADIUS;
        this.tailRotorRadius = this.HELI.TAIL_ROTOR_RADIUS;
        this.bucketRadius = this.HELI.BUCKET_RADIUS;
        this.bucketHeight = this.HELI.BUCKET_HEIGHT;
    }
    
    initAnimationVariables() {
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.mainRotorSpeed = 0;
        this.tailRotorSpeed = 0;
        this.maxRotorSpeed = this.HELI.MAX_ROTOR_SPEED;
        this.ropeLength = this.HELI.ROPE_LENGTH;
        this.currentRopeLength = 0;
        this.ropeSpeed = this.HELI.ROPE_SPEED;
    }
    
    initPositionAndMovement(posX, posY, posZ, angleYY, speed, speedFactor) {
        this.x = posX;
        this.y = posY;
        this.z = posZ;
        this.angleYY = angleYY;
        this.speed = speed;
        this.speedFactor = speedFactor;
        this.velocity = [0, 0, 0];
    }
    
    initTiltParameters() {
        this.tiltAngleX = 0;
        this.maxTiltAngle = this.HELI.MAX_TILT_ANGLE;
        this.tiltSpeed = this.HELI.TILT_SPEED;
    }
    
    initHeliState(cruisingHeight, posY) {
        this.previousState = "resting";
        this.state = "resting";
        this.cruisingHeight = cruisingHeight;
        this.cruisingAltitude = cruisingHeight + posY;
        this.initialHeight = posY;
        this.heightAdjustmentSpeed = this.HELI.HEIGHT_ADJUSTMENT_SPEED;
        this.heliportX = 0;
        this.heliportZ = 0;
        this.landingAnimationTime = 0;
        this.takeoffAnimationTime = 0;
        this.animationDuration = this.HELI.ANIMATION_DURATION;
        this.takeoffProgress = 0;
    }
    
    initSpecialMode(specialMode) {
        this.specialMode = specialMode;
    }
    
    initBucketSystem(hasBucket) {
        this.hasBucket = hasBucket;
        this.bucketDeployed = false;
        this.bucketDeploymentComplete = false;
        this.bucketRetracting = false;
        this.bucketRetracted = true;
        this.isOverLake = false;
        this.isOverFire = false;
        this.isBucketEmpty = true;
        this.isFireOn = true;
    }
    
    initObjects() {
        this.sphere = new MySphere(this.scene, 20, 20);
        this.cone = new MyCone(this.scene, 20, 1, 1);
        this.plane = new MyPlane(this.scene, 1);
        this.circle = new MyCircle(this.scene, 30);
        this.cylinder = new MyCylinder(this.scene, 20, 5); 
        this.bucketCylinder = new MyCylinder(this.scene, 20, 5, 0.7); 
        this.cube = new MyCube(this.scene, 5, 3, 2);
        this.parallelogram = new MyCustomParallelogram(this.scene, 7, 3, 2, 3);
        this.halfCircle = new MyCircle(this.scene, 30, undefined, undefined, undefined, undefined, true);
        this.mustache = new MyMustache(this.scene, 24);
        this.bucket = new MyBucket(this.scene);
    }
    
    initMaterials() {
        this.initBodyMaterial();
        this.initTailMaterial();
        this.initGlassMaterial();
        this.initMetalMaterials();
        this.initWaterMaterial();
    }
    
    initBodyMaterial() {
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(0.3, 0.05, 0.05, 1);    
        this.bodyMaterial.setDiffuse(0.7, 0.1, 0.1, 1);     
        this.bodyMaterial.setSpecular(1.0, 0.9, 0.9, 1);    
        this.bodyMaterial.setShininess(200);                
        this.bodyTexture = new CGFtexture(this.scene, "textures/helicopter/body.jpg");
        this.bodyMaterial.setTexture(this.bodyTexture);
        this.bodyMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    initTailMaterial() {
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.3, 0.05, 0.05, 1);    
        this.tailMaterial.setDiffuse(0.7, 0.1, 0.1, 1);     
        this.tailMaterial.setSpecular(1.0, 0.9, 0.9, 1);    
        this.tailMaterial.setShininess(200);
    }
    
    initGlassMaterial() {
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.glassMaterial.setShininess(200);

        if(this.specialMode) {
            this.glassMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
            this.glassMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
            this.glassTexture = new CGFtexture(this.scene, "textures/helicopter/glass.jpg");
            this.glassMaterial.setTexture(this.glassTexture);
            this.glassMaterial.setTextureWrap('REPEAT', 'REPEAT');
        } else {
            this.glassMaterial.setAmbient(0.2, 0.2, 0.3, 1.0);
            this.glassMaterial.setDiffuse(0.1, 0.2, 0.3, 1.0);
        }
    }
    
    initMetalMaterials() {
        // Metal Accents
        this.metalAccentsMaterial = new CGFappearance(this.scene);
        this.metalAccentsMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.metalAccentsMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.metalAccentsMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalAccentsMaterial.setShininess(100);
        this.metalAccentsTexture = new CGFtexture(this.scene, "textures/helicopter/metal.jpg");
        this.metalAccentsMaterial.setTexture(this.metalAccentsTexture);
        this.metalAccentsMaterial.setTextureWrap('REPEAT', 'REPEAT');
        
        // Metal
        this.metalMaterial = new CGFappearance(this.scene);
        this.metalMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.metalMaterial.setDiffuse(0.25, 0.25, 0.25, 1);
        this.metalMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalMaterial.setShininess(120);
    }
    
    initWaterMaterial() {
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.4, 0.4, 0.4, 1);
        this.waterMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
        this.waterMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.waterMaterial.setShininess(140);
        this.waterTexture = new CGFtexture(this.scene, "textures/helicopter/water.jpg");
        this.waterMaterial.setTexture(this.waterTexture);
    }
    
    // ===== UPDATE METHODS =====
    
    update(deltaTime) {
        if (this.state !== this.previousState) {
            this.handleStateChange(this.previousState, this.state);
            this.previousState = this.state;
        }
        
        this.updateTilt(deltaTime);
        this.updateByState(deltaTime);
        this.updateRotorAnimation(deltaTime);
    }
    
    updateByState(deltaTime) {
        switch (this.state) {
            case "resting":
                this.updateRestingState(deltaTime);
                break;
            case "taking_off":
                this.updateTakingOffState();
                break;
            case "bucket_deploy":
                this.updateBucketDeployState();
                break;
            case "bucket_retract":
                this.updateBucketRetractState();
                break;
            case "adjusting_height":
                this.updateAdjustingHeightState();
                break;
            case "flying":
                this.updateFlyingState(deltaTime);
                break;
            case "landing":
                this.updateLandingState();
                break;
            case "filling":
                this.updateFillingState();
                break;
            case "rise_after_fill":
                this.updateRiseAfterFillState();
                break;
            case "put_fire":
                this.updatePutFireState(deltaTime);
                break;
        }
    }
    
    updateRestingState(deltaTime) {
        this.mainRotorSpeed = Math.max(0, this.mainRotorSpeed - 0.0001 * deltaTime);
        this.tailRotorSpeed = Math.max(0, this.tailRotorSpeed - 0.0002 * deltaTime);
    }
    
    updateTakingOffState() {
        console.log("TAKING OFF");
        this.takeoffProgress += 0.5;
        this.mainRotorSpeed = this.maxRotorSpeed * Math.min(this.takeoffProgress * 2, 1);
        this.tailRotorSpeed = this.maxRotorSpeed * 2 * Math.min(this.takeoffProgress * 2, 1);
        this.y += this.HELI.TAKE_OFF_AND_LAND_SPEED;
        
        if (this.y >= this.cruisingAltitude) {
            this.y = this.cruisingAltitude;
            this.state = this.hasBucket ? "bucket_deploy" : "flying";
        }
    }
    
    updateBucketDeployState() {
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        
        if (this.hasBucket && this.currentRopeLength < this.ropeLength) {
            console.log("BUCKET DEPLOY");
            this.currentRopeLength += this.ropeSpeed;
            if (this.currentRopeLength >= this.ropeLength) {
                this.currentRopeLength = this.ropeLength;
                this.bucketDeployed = true;
                this.bucketRetracted = false;
                this.state = "flying";
            }
        } else {
            this.state = "flying";
        }
    }
    
    updateBucketRetractState() {
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        
        if (this.hasBucket && this.currentRopeLength > 0) {
            this.currentRopeLength -= this.ropeSpeed;
            if (this.currentRopeLength <= 0) {
                this.currentRopeLength = 0;
                this.bucketDeployed = false;
                this.bucketRetracting = false;
                this.bucketRetracted = true;
                this.state = "landing";
            }
        } else {
            this.bucketRetracting = false;
            this.state = "landing";
        }
    }
    
    updateAdjustingHeightState() {
        console.log("ADJUSTING HEIGHT");
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        
        const heightDiff = this.cruisingAltitude - this.y;

        console.log(`Current Height: ${this.y} Height Diff: ${heightDiff}, cruisingAltitude: ${this.cruisingAltitude}`);
        
        if (Math.abs(heightDiff) > 0.1) {
            this.y += heightDiff > 0 ? this.heightAdjustmentSpeed : -this.heightAdjustmentSpeed;
        } else {
            this.y = this.cruisingAltitude;
            this.state = "flying";
            console.log(`Height adjustment complete at ${this.y}`);
        }
    }
    
    updateFlyingState(deltaTime) {
        console.log("FLYING");
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        this.currentRopeLength = this.ropeLength;
        
        if (Math.abs(this.cruisingAltitude - this.y) > 0.1) {
            this.state = "adjusting_height";
            return;
        }
        
        this.updatePosition(deltaTime);
        this.updateAreaDetection();
    }
    
    updatePosition(deltaTime) {
        const timeStep = deltaTime % 1000;
        this.x += this.velocity[0] * timeStep;
        this.z += this.velocity[2] * timeStep;
        console.log(`Timestep: [${timeStep}]`);
        console.log(`Position: [${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}]`);
    }
    
    updateAreaDetection() {
        const { LAKE_BOUNDS, FIRE_BOUNDS } = this.HELI;
        
        // Check if over lake
        this.isOverLake = (
            this.x > LAKE_BOUNDS.minX && this.x < LAKE_BOUNDS.maxX &&
            this.z > LAKE_BOUNDS.minZ && this.z < LAKE_BOUNDS.maxZ
        );
        
        // Check if over fire
        this.isOverFire = (
            this.x > FIRE_BOUNDS.minX && this.x < FIRE_BOUNDS.maxX &&
            this.z > FIRE_BOUNDS.minZ && this.z < FIRE_BOUNDS.maxZ
        );
        
        if (this.isOverLake) console.log("Above lake");
        if (this.isOverFire) console.log("Above fire");
    }
    
    updateLandingState() {
        const movingSpace = this.HELI.LANDING_MOVEMENT_SPACE;
        const initialAltitude = this.cruisingAltitude;
        const altitudeRange = initialAltitude - this.initialHeight;
        const landingProgress = Math.max(0, (this.y - this.initialHeight) / altitudeRange);
        
        this.mainRotorSpeed = this.maxRotorSpeed * landingProgress;
        this.tailRotorSpeed = this.maxRotorSpeed * 2 * landingProgress;
        
        this.updateLandingMovement(movingSpace);
    }
    
    updateLandingMovement(movingSpace) {
        const xDiff = this.heliportX - this.x;
        const zDiff = this.heliportZ - this.z;
        const distanceToTarget = Math.sqrt(xDiff * xDiff + zDiff * zDiff);
        
        if (distanceToTarget > movingSpace) {
            this.moveTowardsHeliport(xDiff, zDiff, distanceToTarget, movingSpace);
        } else {
            this.finalizePosition();
        }
        
        if (distanceToTarget <= movingSpace * 5) {
            this.handleLandingDescent(distanceToTarget, movingSpace);
        }
    }
    
    moveTowardsHeliport(xDiff, zDiff, distanceToTarget, movingSpace) {
        const moveX = xDiff / distanceToTarget * movingSpace;
        const moveZ = zDiff / distanceToTarget * movingSpace;
        
        this.velocity[0] = moveX * this.HELI.TAKE_OFF_AND_LAND_SPEED;
        this.velocity[2] = moveZ * this.HELI.TAKE_OFF_AND_LAND_SPEED;
        
        this.x += moveX;
        this.z += moveZ;
        
        this.updateLandingOrientation(moveX, moveZ);
    }
    
    updateLandingOrientation(moveX, moveZ) {
        const targetAngle = Math.atan2(-moveZ, moveX);
        let angleDiff = targetAngle - this.angleYY;
        angleDiff = angleDiff - Math.PI * 2 * Math.floor((angleDiff + Math.PI) / (Math.PI * 2));
        this.angleYY += angleDiff * 0.1;
        this.angleYY = this.angleYY - Math.PI * 2 * Math.floor((this.angleYY + Math.PI) / (Math.PI * 2));
    }
    
    finalizePosition() {
        this.x = this.heliportX;
        this.z = this.heliportZ;
        this.velocity = [0, 0, 0];
    }
    
    handleLandingDescent(distanceToTarget, movingSpace) {
        if (this.y > this.initialHeight) {
            this.y -= this.HELI.TAKE_OFF_AND_LAND_SPEED;
            
            if (this.hasBucket && this.currentRopeLength > 0 && !this.bucketRetracting) {
                this.state = "bucket_retract";
                this.bucketRetracting = true;
                return;
            }
            
            if (this.y <= this.initialHeight) {
                this.completeLanding();
            }
        }
    }
    
    completeLanding() {
        this.y = this.initialHeight;
        this.state = "resting";
        this.velocity = [0, 0, 0];
        this.mainRotorSpeed = 0;
        this.tailRotorSpeed = 0;
    }
    
    updateFillingState() {
        console.log("FILLING");
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        this.currentRopeLength = this.ropeLength;
        
        if (this.y > 5) {
            this.y -= 0.3;
        }
    }
    
    updateRiseAfterFillState() {
        console.log("RISING");
        this.bucket.fill();
        this.isBucketEmpty = false;
        
        this.mainRotorSpeed = this.maxRotorSpeed;
        this.tailRotorSpeed = this.maxRotorSpeed * 2;
        this.currentRopeLength = this.ropeLength;
        this.y += 0.3;
        
        if (this.y >= this.cruisingAltitude) {
            this.y = this.cruisingAltitude;
            this.velocity = [0, 0, 0];
            this.state = "flying";
        }
    }
    
    updatePutFireState(deltaTime) {
        const isWaterDropComplete = this.bucket.updateWaterDrop(deltaTime);
        console.log(`WATER: ${this.bucket.waterFallProgress}`);
        
        if (isWaterDropComplete) {
            this.isFireOn = false;
            this.state = "flying";
        }
    }
    
    updateRotorAnimation(deltaTime) {
        this.mainRotorAngle += deltaTime * this.mainRotorSpeed;
        this.tailRotorAngle += deltaTime * this.tailRotorSpeed;
    }
    
    updateTilt(deltaTime) {
        if (this.state !== "flying" && this.state !== "landing") {
            this.tiltAngleX = 0;
            return;
        }
        
        const forwardX = Math.cos(this.angleYY);
        const forwardZ = -Math.sin(this.angleYY);
        const forwardVelocity = this.velocity[0] * forwardX + this.velocity[2] * forwardZ;
        
        if (this.state === "landing") {
            this.updateLandingTilt(forwardX, forwardZ, forwardVelocity, deltaTime);
            return;
        }
        
        this.updateFlightTilt(forwardVelocity, deltaTime);
    }
    
    updateLandingTilt(forwardX, forwardZ, forwardVelocity, deltaTime) {
        const xDiff = this.heliportX - this.x;
        const zDiff = this.heliportZ - this.z;
        const distanceToTarget = Math.sqrt(xDiff * xDiff + zDiff * zDiff);
        
        if (distanceToTarget > 0.1) {
            const dirX = xDiff / distanceToTarget;
            const dirZ = zDiff / distanceToTarget;
            const movingTowardPad = (dirX * forwardX + dirZ * forwardZ) > 0;
            
            if (movingTowardPad) {
                const targetTilt = -this.maxTiltAngle * 0.5;
                const tiltDiff = targetTilt - this.tiltAngleX;
                this.tiltAngleX += tiltDiff * Math.min(this.tiltSpeed * deltaTime, 1);
                return;
            }
        }
    }
    
    updateFlightTilt(forwardVelocity, deltaTime) {
        let targetTilt = 0;
        if (Math.abs(forwardVelocity) > 0.001) {
            const maxSpeedFactor = this.speed * this.speedFactor;
            const velocityRatio = Math.min(Math.abs(forwardVelocity) / maxSpeedFactor, 1);
            targetTilt = forwardVelocity > 0 
                ? -this.maxTiltAngle * velocityRatio
                : this.maxTiltAngle * velocityRatio;
        }
        
        const tiltDiff = targetTilt - this.tiltAngleX;
        this.tiltAngleX += tiltDiff * Math.min(this.tiltSpeed * deltaTime, 1);
    }
    
    // ===== STATE MANAGEMENT =====
    
    handleStateChange(oldState, newState) {
        if (!this.scene.building) return;

        if (newState === "rise_after_fill") {
            this.bucket.fill();
            this.isBucketEmpty = false;
        }
        
        if (oldState === "put_fire" && newState === "flying") {
            this.isBucketEmpty = true;
        }

        this.updateHelipadTexture(newState);
    }
    
    updateHelipadTexture(newState) {
        const textureMap = {
            "taking_off": "up",
            "bucket_deploy": "up",
            "landing": "down",
            "bucket_retract": "down",
            "resting": "normal",
            "flying": "normal"
        };
        
        const texture = textureMap[newState] || "normal";
        this.scene.building.setHelipadTexture(texture);
    }
    
    // ===== DISPLAY METHODS =====
    
    display() {
        this.scene.pushMatrix();
        
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.angleYY, 0, 1, 0);
        this.scene.rotate(this.tiltAngleX, 0, 0, 1);

        this.drawBody();
        this.drawMainRotor();
        this.drawTail();
        this.drawLandingGear();
        
        if (this.hasBucket) {
            this.scene.pushMatrix();
            this.drawBucket();
            this.scene.popMatrix();
        }

        if (this.state === "put_fire") {
            this.bucket.drawWaterFall(this.currentRopeLength);
        }
        
        this.scene.popMatrix();
    }
    
    drawBody() {
        // Main body 
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.scale(this.bodyLength/2.5, this.bodyHeight/2, this.bodyWidth/2);
        this.sphere.display();
        
        this.scene.translate(this.bodyLength/9, -this.bodyHeight/8, 0);
        this.scene.scale(this.bodyLength/9, this.bodyHeight/5, this.bodyWidth/4);
        this.sphere.display();
        this.scene.popMatrix();
        
        this.drawCockpit();
        this.drawSpecialFeature();
    }
    
    drawCockpit() {
        this.scene.pushMatrix();
        this.glassMaterial.apply();
        this.scene.translate(this.bodyLength/5.5, this.bodyHeight/15, 0);
        this.scene.scale(this.bodyLength/4, this.bodyHeight/3, this.bodyWidth/2.5);
        this.sphere.display();
        this.scene.popMatrix();
    }
    
    drawSpecialFeature() {
        if (this.specialMode) {
            this.scene.pushMatrix();
            this.scene.translate(this.bodyLength/2.2, 0, 0);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(10, 10, 10);
            this.mustache.display();
            this.scene.popMatrix();
        }
    }
    
    drawMainRotor() {
        this.scene.pushMatrix();
        
        this.drawRotorHub();
        this.drawMainRotorBlades();
        
        this.scene.popMatrix();
    }
    
    drawRotorHub() {
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/8, this.bodyHeight/3, 0);
        this.scene.scale(0.4, 0.4, 0.4);
        this.cube.display();

        this.metalAccentsMaterial.apply();
        this.scene.translate(0, this.bodyHeight/2, 0);
        this.sphere.display();
    }
    
        drawMainRotorBlades() {
        this.metalMaterial.apply();
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        
        const bladeAngles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
        
        bladeAngles.forEach(angle => {
            this.scene.pushMatrix();
            this.scene.rotate(angle, 0, 1, 0);
            this.scene.translate(this.mainRotorRadius/2, 0, 0);
            this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
            this.cube.display();
            this.scene.popMatrix();
        });
    }
    
    drawTail() {
        this.drawTailBoom();
        this.drawTailFin();
        this.drawTailRotor();
    }
    
    drawTailBoom() {
        this.scene.pushMatrix();
        this.tailMaterial.apply();
        this.scene.translate(-this.bodyLength/3+1, this.bodyHeight/5, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(this.tailRadius, this.tailLength, this.tailRadius);
        this.cone.display();
        this.scene.popMatrix();
    }
    
    drawTailFin() {
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/2 - this.tailLength/1.2 + 2, this.bodyHeight/2-0.02, 0);
        this.scene.rotate(-Math.PI/6, 0, 0, 1);
        this.scene.scale(0.3, 0.2, 0.2);
        this.parallelogram.display();
        this.scene.popMatrix();
    }
    
    drawTailRotor() {
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/2 - this.tailLength/1.2 + 2, this.bodyHeight/2-0.02, 0);
        
        // Rotor hub
        this.metalAccentsMaterial.apply();
        this.scene.translate(0.65, 0, 0.2);

        this.scene.scale(0.15, 0.1, 0.1);
        this.sphere.display();
        
        // Tail rotor blades
        this.metalMaterial.apply();
        this.scene.rotate(this.tailRotorAngle, 0, 0, 1);
        this.drawTailRotorBlades();
        this.scene.popMatrix();

    }
    
    drawTailRotorBlades() {
        const bladeAngles = [0, Math.PI];
        
        bladeAngles.forEach(angle => {
            this.scene.pushMatrix();
            this.scene.rotate(angle, 0, 0, 1);
            this.scene.translate(0, this.tailRotorRadius/2, 0);
            this.scene.scale(0.2, this.tailRotorRadius, 0.2);
            this.cube.display();
            this.scene.popMatrix();
        });
    }
    
    drawLandingGear() {
        this.scene.pushMatrix();
        this.metalMaterial.apply();
        
        this.drawLandingGearSide('left');
        this.drawLandingGearSide('right');
        
        this.scene.popMatrix();
    }
    
    drawLandingGearSide(side) {
        const zPos = side === 'left' ? this.bodyWidth/2 : -this.bodyWidth/2;
        const rotationSign = side === 'left' ? 1 : -1;
        
        // Front strut
        this.scene.pushMatrix();
        this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, zPos - 0.2 * rotationSign);
        this.scene.rotate(Math.PI/2, rotationSign, 0, Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();
        
        // Back strut
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, zPos - 0.2 * rotationSign);
        this.scene.rotate(Math.PI/2, rotationSign, 0, -Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();
        
        // Connector
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bodyHeight/1.5, zPos);
        this.scene.rotate(0, rotationSign, 0, Math.PI/3);
        this.scene.scale(0.9, 0.05, 0.2);
        this.cube.display();
        this.scene.popMatrix();
    }
    
    drawBucket() {
        if (!this.hasBucket || this.currentRopeLength <= 0) {
            return;
        }
        
        const isDropping = (this.state === "put_fire");
        this.bucket.display(this.ropeLength, this.currentRopeLength, isDropping);
    }
    
    // ===== CONTROL METHODS =====
    
    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    turn(v) {
        this.angleYY += v;
        
        const currentSpeed = Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[2] * this.velocity[2]);
        this.velocity[0] = Math.cos(this.angleYY) * currentSpeed;
        this.velocity[2] = -Math.sin(this.angleYY) * currentSpeed;
    }
    
    accelerate(v) {
        console.log(`State: ${this.state}`);
        if (this.state !== "flying" && v > 0) return;
       
        const currentSpeed = Math.sqrt(this.velocity[0] * this.velocity[0] + this.velocity[2] * this.velocity[2]);
        const maxSpeed = this.speedFactor * this.speed;
        
        const forwardX = Math.cos(this.angleYY);
        const forwardZ = -Math.sin(this.angleYY);
        const currentDirection = (currentSpeed > 0) ? 
            (this.velocity[0] * forwardX + this.velocity[2] * forwardZ) / currentSpeed : 
            1; 
        
        let newSpeed = currentSpeed * Math.sign(currentDirection) + v;
        newSpeed = Math.max(-maxSpeed, Math.min(maxSpeed, newSpeed));
        
        console.log(`Speed: ${Math.abs(newSpeed)}, Direction: ${newSpeed >= 0 ? 'forward' : 'backward'}`);
           
        this.updateVelocity(forwardX, forwardZ, currentSpeed, currentDirection, newSpeed);
    }
    
    updateVelocity(forwardX, forwardZ, currentSpeed, currentDirection, newSpeed) {
        if (currentSpeed > 0) {
            if (Math.sign(currentDirection) !== Math.sign(newSpeed)) {
                this.velocity[0] = forwardX * newSpeed;
                this.velocity[2] = forwardZ * newSpeed;
            } else {
                const factor = Math.abs(newSpeed) / currentSpeed;
                this.velocity[0] *= factor;
                this.velocity[2] *= factor;
                
                if (newSpeed < 0 && currentDirection > 0) {
                    this.velocity[0] = -this.velocity[0];
                    this.velocity[2] = -this.velocity[2];
                }
            }
        } else {
            this.velocity[0] = forwardX * newSpeed;
            this.velocity[2] = forwardZ * newSpeed;
        }
           
        console.log(`Velocity: [${this.velocity[0].toFixed(4)}, ${this.velocity[2].toFixed(4)}], Speed: ${Math.abs(newSpeed).toFixed(4)}`);
    }
    
    reset() {
        this.x = this.heliportX;
        this.y = this.initialHeight;
        this.z = this.heliportZ;
        this.angleYY = 0;
        this.velocity = [0, 0, 0];
        this.state = "resting";
        this.mainRotorSpeed = 0;
        this.tailRotorSpeed = 0;
        this.landingAnimationTime = 0;
        this.takeoffAnimationTime = 0;
        this.currentRopeLength = 0;
        this.bucketDeployed = false;
        this.bucketRetracting = false;
        this.isBucketEmpty = true;
        
        if (this.hasBucket) {
            this.bucket.empty();
        }
        if (this.scene.building) {
            this.scene.building.setHelipadTexture('normal');
        }
    }
    
    takeOff() {
        if (this.state === "resting") {
            console.log("Taking off from resting state");
            this.state = "taking_off";
            this.takeoffAnimationTime = 0;
        } else if (this.state === "filling") {
            console.log("Taking off from filling state");
            this.isBucketEmpty = false;
            this.state = "rise_after_fill";
        }
    }
    
    land() {
        if (this.state === "flying") {            
            if (this.isOverLake && this.isBucketEmpty) {
                this.state = "filling";
            } else {
                this.state = "landing";
                this.landingAnimationTime = 0;
                this.bucketRetracting = false; 
            }
        }
    }
    
    put_fire() {
        if (this.state === "flying" && !this.isBucketEmpty && this.isOverFire) {
            this.state = "put_fire";
            this.velocity = [0, 0, 0];
            this.bucket.startWaterDrop();
        }
    }
    
    setHeliportPosition(x, y, z) {
        this.heliportX = x;
        this.heliportZ = z;
        this.initialHeight = y;
        if (this.state === "resting") {
            this.x = x;
            this.y = y;
            this.z = z;
            this.cruisingAltitude = this.cruisingHeight + y;
        }
    }
    
    setBucket(hasBucket) {
        this.hasBucket = hasBucket;
        if (!hasBucket) {
            this.currentRopeLength = 0;
            this.bucketDeployed = false;
        }
    }
    
    setSpeedFactor(speedFactor) {
        this.speedFactor = speedFactor;
    }
    
    setCruisingHeight(cruisingHeight) {
        this.cruisingHeight = cruisingHeight;
        this.cruisingAltitude = cruisingHeight + this.initialHeight;
        
        if (this.state === "flying") {
            console.log(`Adjusting height from ${this.y} to ${this.cruisingAltitude}`);
        }
    }
    
    setSpecialMode(specialMode) {
        this.specialMode = specialMode;
        this.initGlassMaterial();
    }
}