attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uTime;
uniform float uPulseSpeed;
uniform float uMinIntensity;
uniform float uMaxIntensity;

varying vec2 vTextureCoord;
varying float vPulseIntensity;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    
    // Calculate pulse effect based on time
    vPulseIntensity = uMinIntensity + (uMaxIntensity - uMinIntensity) * 
                  (0.5 + 0.5 * sin(uTime * uPulseSpeed * 5.0));
    
}