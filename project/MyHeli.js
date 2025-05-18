import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import {MySphere} from './MySphere.js';
import {MyCone} from './MyCone.js';
import {MyPlane} from './MyPlane.js';
import {MyCircle} from './MyCircle.js';
import {MyPyramid} from './MyPyramid.js';
import {MyCylinder} from './MyCustomCylinder.js';
import {MyCustomCube} from './MyCustomCube.js';
import {MyCustomParallelogram} from './MyCustomParallelogram.js';
import {MyHalfCircle} from './MyHalfCircle.js';

/**
 * MyHeli - Helicopter model for firefighting
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene, posX=0, posY=0, posZ=0, angleYY=0, speed=0.01, speedFactor = 1, cruisingHeight = 5, hasBucket = true) {
        super(scene);
        
        // Dimensions
        this.bodyLength = 6;
        this.bodyWidth = 2.5;
        this.bodyHeight = 2.5;
        
        this.tailLength = 8;
        this.tailRadius = 0.4;
        
        this.mainRotorRadius = 5;
        this.tailRotorRadius = 3;
        
        this.bucketRadius = 0.8;
        this.bucketHeight = 1.2;
        
        // Animation variables
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;
        this.mainRotorSpeed = 0;
        this.tailRotorSpeed = 0;
        this.maxRotorSpeed = 0.01;
        this.ropeLength = 5;
        this.currentRopeLength = 0;
        this.ropeSpeed = 0.05;
        this.waterLevel = 0;
        this.hasBucket = hasBucket;
        this.bucketDeployed = false;
        this.bucketDeploymentComplete = false;
        this.bucketRetracting = false;
        this.bucketRetracted = true;

        this.isOverLake = false; 
        this.isOverFire = false; 
        this.isBucketEmpty = false;  //ALTERAR
        this.isFireOn = true;

        // Position and Movement
        this.x = posX;
        this.y = posY;
        this.z = posZ;
        this.angleYY = angleYY;
        this.speed = speed;
        this.speedFactor = speedFactor;
        this.velocity = [0, 0, 0];

        // Tilt parameters
        this.tiltAngleX = 0;      
        this.maxTiltAngle = 0.15; 
        this.tiltSpeed = 0.005;   

        // Heli State
        this.state = "resting";
        this.cruisingHeight = cruisingHeight;
        this.cruisingAltitude = cruisingHeight + posY;
        this.initialHeight = posY;
        this.heliportX = 0;
        this.heliportZ = 0;
        this.landingAnimationTime = 0;
        this.takeoffAnimationTime = 0;
        this.animationDuration = 3000; // 3 secs for takeoff/landing
        this.takeoffProgress = 0;

        this.bottomOpen = 0; // 0 = close, 1 = open
        
        this.initObjects();
        this.initMaterials();
    }
    
    initObjects() {
        this.sphere = new MySphere(this.scene, 20, 20);
        this.cone = new MyCone(this.scene, 20, 1, 1);
        this.plane = new MyPlane(this.scene, 1);
        this.circle = new MyCircle(this.scene, 30);
        this.cylinder = new MyCylinder(this.scene, 20, 5); 
        this.bucketCylinder = new MyCylinder(this.scene, 20, 5, 0.7); 
        this.pyramid = new MyPyramid(this.scene, 4, 1, 1);
        this.cube = new MyCustomCube(this.scene, 5, 3, 2);
        this.parallelogram = new MyCustomParallelogram(this.scene, 7, 3, 2, 3);
        this.halfCircle = new MyHalfCircle(this.scene);
    }
    
    initMaterials() {
        // Body 
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(0.3, 0.05, 0.05, 1);    
        this.bodyMaterial.setDiffuse(0.7, 0.1, 0.1, 1);     
        this.bodyMaterial.setSpecular(1.0, 0.9, 0.9, 1);    
        this.bodyMaterial.setShininess(200);                
        this.bodyTexture = new CGFtexture(this.scene, "textures/helicopter/body.jpg");
        this.bodyMaterial.setTexture(this.bodyTexture);
        this.bodyMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Tail 
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.3, 0.05, 0.05, 1);    
        this.tailMaterial.setDiffuse(0.7, 0.1, 0.1, 1);     
        this.tailMaterial.setSpecular(1.0, 0.9, 0.9, 1);    
        this.tailMaterial.setShininess(200);                

        // Glass
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.2, 0.2, 0.3, 1.0);
        this.glassMaterial.setDiffuse(0.1, 0.2, 0.3, 1.0); 
        this.glassMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.glassMaterial.setShininess(200);
        
        // Metal Accents
        this.metalAccentsMaterial = new CGFappearance(this.scene);
        this.metalAccentsMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.metalAccentsMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.metalAccentsMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalAccentsMaterial.setShininess(100);
        this.metalAccentsTexture = new CGFtexture(this.scene, "textures/helicopter/metal.jpg");
        this.metalAccentsMaterial.setTexture(this.metalAccentsTexture);
        this.metalAccentsMaterial.setTextureWrap('REPEAT', 'REPEAT');
        
        // Meta
        this.metalMaterial = new CGFappearance(this.scene);
        this.metalMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.metalMaterial.setDiffuse(0.25, 0.25, 0.25, 1);
        this.metalMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.metalMaterial.setShininess(120);
        
        // Water
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.0, 0.1, 0.3, 0.8);
        this.waterMaterial.setDiffuse(0.0, 0.4, 0.8, 0.8);
        this.waterMaterial.setSpecular(0.2, 0.8, 1.0, 0.8);
        this.waterMaterial.setShininess(120);
        this.waterTexture = new CGFtexture(this.scene, "textures/helicopter/water.jpg");
        this.waterMaterial.setTexture(this.waterTexture);
    }
    
    update(deltaTime) {
        this.updateTilt(deltaTime);
        switch (this.state) {
            case "resting":
                this.mainRotorSpeed = Math.max(0, this.mainRotorSpeed - 0.0001 * deltaTime);
                this.tailRotorSpeed = Math.max(0, this.tailRotorSpeed - 0.0002 * deltaTime);
                break;
                
            case "taking_off":
                this.takeoffProgress += 0.5;
                this.mainRotorSpeed = this.maxRotorSpeed * Math.min(this.takeoffProgress * 2, 1);
                this.tailRotorSpeed = this.maxRotorSpeed * 2 * Math.min(this.takeoffProgress * 2, 1);
                this.y += 0.05;
                if (this.y >= this.cruisingAltitude) {
                    this.y = this.cruisingAltitude;
                    if(this.hasBucket) {
                        this.state = "bucket_deploy";
                    } else {
                        this.state = "flying";
                    }
                }
                break;
    
            case "bucket_deploy":
                this.mainRotorSpeed = this.maxRotorSpeed;
                this.tailRotorSpeed = this.maxRotorSpeed * 2;
                
                if (this.hasBucket && this.currentRopeLength < this.ropeLength) {
                    console.log("BUCKET DEPLOYYYYYYY")
                    this.currentRopeLength += this.ropeSpeed ;
                    if (this.currentRopeLength >= this.ropeLength) {
                        this.currentRopeLength = this.ropeLength; 
                        this.bucketDeployed = true;
                        this.bucketRetracted = false;
                        this.state = "flying";
                    }
                } else {
                    this.state = "flying";
                }
                break;

            case "bucket_retract":
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
                break;
    
            case "flying":
                this.mainRotorSpeed = this.maxRotorSpeed;
                this.tailRotorSpeed = this.maxRotorSpeed * 2;

                this.currentRopeLength = this.ropeLength;
                
                const timeStep = deltaTime % 100;
                this.x += this.velocity[0] * timeStep;
                this.z += this.velocity[2] * timeStep;
                console.log(`Timestep: [${timeStep},`);
                console.log(`Position: [${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}]`);

          
                if (this.x > -30 && this.x < -15 && this.z > 15 && this.z < 38) {
                    // && this.velocity[0] == 0 && this.velocity[2] == 0) {
                    console.log(`Above lake`);
                    this.isOverLake = true;
                } else {
                    this.isOverLake = false;
                }
               
                //if ((this.x > 15 && this.x < 18 && this.z > 15 && this.z < 19) || 
                //    (this.x > 29 && this.x < 34 && this.z > 30 && this.z < 34)){
                if (this.x > 9 && this.x < 40 && this.z > 14 && this.z < 35) {
                    console.log(`Above fire`);
                    this.isOverFire = true;
                } else {
                    this.isOverFire = false;
                }
                    
                
                break;
                
            case "landing":
                const movingSpace = 0.2;
                
                const initialAltitude = this.cruisingAltitude;
                const altitudeRange = initialAltitude - this.initialHeight;
                const landingProgress = Math.max(0, (this.y - this.initialHeight) / altitudeRange);
                
                this.mainRotorSpeed = this.maxRotorSpeed * landingProgress;
                this.tailRotorSpeed = this.maxRotorSpeed * 2 * landingProgress;
                
                const xDiff = this.heliportX - this.x;
                const zDiff = this.heliportZ - this.z;
                const distanceToTarget = Math.sqrt(xDiff*xDiff + zDiff*zDiff);
                
                if (distanceToTarget > movingSpace) {
                    const moveX = xDiff / distanceToTarget * movingSpace;
                    const moveZ = zDiff / distanceToTarget * movingSpace;
                
                    this.velocity[0] = moveX * 0.5; 
                    this.velocity[2] = moveZ * 0.5;
                    
                    this.x += moveX;
                    this.z += moveZ;
                    
                    const targetAngle = Math.atan2(-moveZ, moveX);
                    let angleDiff = targetAngle - this.angleYY;
                    
                    angleDiff = angleDiff - Math.PI*2 * Math.floor((angleDiff + Math.PI) / (Math.PI*2));
                    
                    this.angleYY += angleDiff * 0.1;
                    this.angleYY = this.angleYY - Math.PI*2 * Math.floor((this.angleYY + Math.PI) / (Math.PI*2));
                } else {
                    this.x = this.heliportX;
                    this.z = this.heliportZ;
                    this.velocity = [0, 0, 0]; 
                }
                
                if (distanceToTarget <= movingSpace*5) {
                    if (this.y > this.initialHeight) {
                        const descentFactor = 1 - distanceToTarget/(movingSpace*5);
                        this.y -= movingSpace * descentFactor;
                        
                        if (this.hasBucket && this.currentRopeLength > 0 && !this.bucketRetracting) {
                            this.state = "bucket_retract";
                            this.bucketRetracting = true;
                            return; 
                        }
                        
                        if (this.y <= this.initialHeight) {
                            this.y = this.initialHeight;
                            this.state = "resting";
                            this.velocity = [0, 0, 0];
                            this.mainRotorSpeed = 0;
                            this.tailRotorSpeed = 0;
                        }
                    }
                }
                break;
                            
            case "filling":
                console.log(`FILLING`);
                this.mainRotorSpeed = this.maxRotorSpeed;
                this.tailRotorSpeed = this.maxRotorSpeed * 2;

                this.currentRopeLength = this.ropeLength;
                
                if (this.y > 6) {
                    this.y -= 0.3;
                }

                break;


            case "rise_after_fill":
                console.log(`RISING`);
                this.mainRotorSpeed = this.maxRotorSpeed;
                this.tailRotorSpeed = this.maxRotorSpeed * 2;

                this.currentRopeLength = this.ropeLength;
                this.y += 0.3;
                
                if (this.y >= this.cruisingAltitude) {
                    this.y = this.cruisingAltitude;
                    this.velocity = [0, 0, 0];
                    this.state = "flying";  
                }

                break;

            case "put_fire":
                if (this.bottomOpen < 1) {
                    this.bottomOpen += 0.01;
                    if (this.bottomOpen > 1) this.bottomOpen = 1;
                }

                break;
        }
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
            const xDiff = this.heliportX - this.x;
            const zDiff = this.heliportZ - this.z;
            const distanceToTarget = Math.sqrt(xDiff*xDiff + zDiff*zDiff);
            
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
        
        let targetTilt = 0;
        if (Math.abs(forwardVelocity) > 0.001) {
            targetTilt = forwardVelocity > 0 
                ? -this.maxTiltAngle * Math.min(Math.abs(forwardVelocity) / (this.speed * this.speedFactor), 1) 
                : this.maxTiltAngle * Math.min(Math.abs(forwardVelocity) / (this.speed * this.speedFactor), 1);
        }
        
        const tiltDiff = targetTilt - this.tiltAngleX;
        this.tiltAngleX += tiltDiff * Math.min(this.tiltSpeed * deltaTime, 1);
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

    }
    
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
            //this.scene.scale(1.3, 1.3, 1.3);
            this.drawBucket();
            this.scene.popMatrix();
        }
        
        this.scene.popMatrix();
    }
    
    drawBody() {
        // Main body 
        this.scene.pushMatrix();
        
        this.bodyMaterial.apply();
        this.scene.scale(this.bodyLength/2.5, this.bodyHeight/2, this.bodyWidth/2);
        this.sphere.display();
        
        this.scene.translate(this.bodyLength/9, -this.bodyHeight/8 , 0);
        this.scene.scale(this.bodyLength/9, this.bodyHeight/5, this.bodyWidth/4);
        this.sphere.display();
        
        this.scene.popMatrix();
        
        // Cockpit
        this.scene.pushMatrix();
        this.glassMaterial.apply();
        this.scene.translate(this.bodyLength/5.5, this.bodyHeight/15, 0);
        this.scene.scale(this.bodyLength/4, this.bodyHeight/3, this.bodyWidth/2.5);
        this.sphere.display();
        this.scene.popMatrix();
    }
    
    drawMainRotor() {
        this.scene.pushMatrix();
        
        // Rotor hub
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/8, this.bodyHeight/3 , 0);
        this.scene.scale(0.4, 0.4, 0.4);
        this.cube.display();

        this.metalAccentsMaterial.apply();
        this.scene.translate(0, this.bodyHeight/2 , 0);
        this.sphere.display();

        

        // Rotor blades
        this.metalMaterial.apply();
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        
        // First blade
        this.scene.pushMatrix();
        this.scene.rotate(0, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Second blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Third blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        // Fourth blade
        this.scene.pushMatrix();
        this.scene.rotate(3*Math.PI/2, 0, 1, 0);
        this.scene.translate(this.mainRotorRadius/2, 0, 0);
        this.scene.scale(this.mainRotorRadius, 0.1, 0.5);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
    
    drawTail() {
        // Tail boom
        this.scene.pushMatrix();
        this.tailMaterial.apply();
        this.scene.translate(-this.bodyLength/3+1, this.bodyHeight/5, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(this.tailRadius, this.tailLength, this.tailRadius);
        this.cone.display();
        this.scene.popMatrix();
        
        // Tail fin
        this.scene.pushMatrix();
        this.bodyMaterial.apply();
        this.scene.translate(-this.bodyLength/2 - this.tailLength/1.2 + 2, this.bodyHeight/2-0.02, 0);
        this.scene.rotate(-Math.PI/6, 0, 0, 1);
        this.scene.scale(0.3, 0.2, 0.2);
        this.parallelogram.display();
        this.scene.popMatrix();

        // Tail rotor hub and blades 
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
        
        // First tail blade
        this.scene.pushMatrix();
        this.scene.translate(0, this.tailRotorRadius/2, 0);
        this.scene.scale(0.2, this.tailRotorRadius, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        
        // Second tail blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, this.tailRotorRadius/2, 0);
        this.scene.scale(0.2, this.tailRotorRadius, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
    
    drawLandingGear() {
        // Landing gear struts - left side
        this.scene.pushMatrix();
        this.metalMaterial.apply();

        //left front
        this.scene.pushMatrix();
        this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, this.bodyWidth/2 - 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();
        
        //left back
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, this.bodyWidth/2 - 0.2);
        this.scene.rotate(Math.PI/2, 1, 0, -Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //left connector
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bodyHeight/1.5, this.bodyWidth/2);
        this.scene.rotate(0, 1, 0, Math.PI/3);
        this.scene.scale(0.9, 0.05, 0.2);
        this.cube.display();
        this.scene.popMatrix();

        //right front
        this.scene.pushMatrix();
        this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, -this.bodyWidth/2 + 0.2);
        this.scene.rotate(Math.PI/2, -1, 0, Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //right back
        this.scene.pushMatrix();
        this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, -this.bodyWidth/2 + 0.2);
        this.scene.rotate(Math.PI/2, -1, 0, -Math.PI/3);
        this.scene.scale(0.05, 0.04, 0.6);
        this.cube.display();
        this.scene.popMatrix();

        //right connector
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bodyHeight/1.5, -this.bodyWidth/2);
        this.scene.rotate(0, -1, 0, Math.PI/3);
        this.scene.scale(0.9, 0.05, 0.2);
        this.cube.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawBucket() {
        if (!this.hasBucket || this.currentRopeLength <= 0) {
            return;
        }
        
        // Rope
        this.scene.pushMatrix();
        this.metalAccentsMaterial.apply();
        this.scene.translate(0, -this.bodyHeight/2, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, this.currentRopeLength-this.bucketHeight-0.2);
        this.cylinder.display();
        this.scene.popMatrix();
        
        if (this.currentRopeLength >= this.ropeLength * 0.25) {
            // Bucket body 
            this.scene.pushMatrix();
            this.metalMaterial.apply();
            this.scene.translate(0, - this.currentRopeLength - this.bucketHeight/2, 0);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(this.bucketRadius, this.bucketRadius, this.bucketRadius*1.3);
            this.bucketCylinder.display(); 
            this.scene.popMatrix();

            // Rim top bucket
            const rimThickness = this.bucketHeight * 0.08;
            const rimRadius = this.bucketRadius * 1.08;
            this.scene.pushMatrix();
            this.metalMaterial.apply();
            this.scene.translate(0, -this.currentRopeLength - this.bucketHeight/2, 0);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(rimRadius, rimRadius, rimThickness);
            this.bucketCylinder.display();
            this.scene.popMatrix();

           // Handle bucket
           this.scene.pushMatrix();
           this.scene.translate(0, -this.currentRopeLength - this.bucketHeight/2 -0.2, 0);
           this.scene.rotate(Math.PI/2, 0, 1, 0);
           this.scene.scale(1.6, 1.6, 1.6);
           this.drawHandleBucket();
           this.scene.popMatrix();

            
            if (!this.isBucketEmpty) {
                // Water
                this.scene.pushMatrix();
                this.waterMaterial.apply();
                this.scene.translate(0, this.waterLevel, 0); // this.waterLevel-0.4 ir descendo
                this.scene.scale(this.bucketRadius*0.85, this.bucketHeight*0.2, this.bucketRadius*0.85);
                this.sphere.display();
                this.scene.popMatrix();
            }
            
           
            if (this.state == "put_fire" && this.bottomOpen > 0) {
                this.drawOpeningBottom();

            } else {
                this.drawOpeningBottom();
                // Bucket bottom
                /*
                this.scene.pushMatrix();
                this.metalMaterial.apply();
                this.scene.translate(0, - this.currentRopeLength - this.bucketHeight*1.15, 0);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(this.bucketRadius*1.4, this.bucketRadius*1.4, this.bucketRadius*1.4);
                this.circle.display();
                this.scene.popMatrix();
                */
            }
        }
    }


    drawOpeningBottom() {
        //this.bottomOpen = 0.7;
        const openingAngle = this.bottomOpen * Math.PI * 0.5;
        
        // Left circle
        this.scene.pushMatrix();
        this.scene.translate(0, -Math.sin(openingAngle)*this.bucketRadius*0.7, (Math.cos(openingAngle)-(1-openingAngle))*this.bucketRadius*0.7);
            this.scene.pushMatrix();
            this.metalMaterial.apply();
            this.scene.translate(0, - this.currentRopeLength - this.bucketHeight*1.35, 0);
            this.scene.rotate(-openingAngle, 1, 0, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(1, -1, 1);     // Invert side - texture
            this.scene.scale(this.bucketRadius*0.7, this.bucketRadius*0.7, this.bucketRadius*0.7);
            this.halfCircle.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
        
        // Right circle
        this.scene.pushMatrix();
        this.scene.translate(0, -Math.sin(openingAngle)*this.bucketRadius*0.7, -(Math.cos(openingAngle)-(1-openingAngle))*this.bucketRadius*0.7);   
            this.scene.pushMatrix();
            this.metalMaterial.apply();
            this.scene.translate(0, - this.currentRopeLength - this.bucketHeight*1.35, 0);
            this.scene.rotate(openingAngle, 1, 0, 0);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(this.bucketRadius*0.7, this.bucketRadius*0.7, this.bucketRadius*0.7);
            this.halfCircle.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    drawHandleBucket() {
        this.scene.pushMatrix();
        this.metalAccentsMaterial.apply();
        
        const handleRadius = this.bucketRadius * 0.8;
        const tubeRadius = this.bucketRadius * 0.06;   // Thickness of the handle
        const arcAngle = Math.PI;
        const arcSegments = 16;
        
        // Arc drawing
        for (let i = 0; i < arcSegments-1; i++) {
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
        
        // Spheres connections
        this.scene.pushMatrix();    // Left
            this.scene.translate(handleRadius, 0, 0);
            this.scene.scale(tubeRadius * 1.2, tubeRadius * 1.2, tubeRadius * 1.2);
            this.sphere.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    // Right
            this.scene.translate(-handleRadius, 0, 0);
            this.scene.scale(tubeRadius * 1.2, tubeRadius * 1.2, tubeRadius * 1.2);
            this.sphere.display();
        this.scene.popMatrix();
        
        
        // Side connections
        this.scene.pushMatrix();    // Left
            this.scene.translate(handleRadius - tubeRadius * 4, 0, 0);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(tubeRadius/2, tubeRadius, this.bucketHeight * 0.2);
            this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();    // Right
            this.scene.translate(-handleRadius + tubeRadius * 4, 0, 0);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.scale(tubeRadius/2, tubeRadius, this.bucketHeight * 0.2);
            this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
    
    
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
    }
    
    takeOff() {
        if (this.state === "resting") {
            console.log("Taking off from resting state");
            this.state = "taking_off";
            this.takeoffAnimationTime = 0;
        } else if (this.state === "filling") {
            console.log("Taking off from filling state");
            this.isBucketEmpty = false;
            this.waterLevel = - this.currentRopeLength - this.bucketHeight*0.5 - 0.25;
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
}