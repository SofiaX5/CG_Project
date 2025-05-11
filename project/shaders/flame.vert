attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main() {

    float vertexHeight = aVertexPosition.y;
    
    float waveAmplitude = 0.08 * vertexHeight;
    float waveFrequency = 2.0;
    
    float timeOffset = timeFactor * 5.0;
    
    float displacement = waveAmplitude * sin(timeOffset + aVertexPosition.x * waveFrequency);
    
    float noiseX = sin(timeOffset * 0.7 + aVertexPosition.y * 3.0) * 0.05;
    float noiseY = cos(timeOffset * 0.9 + aVertexPosition.x * 2.5) * 0.05;
    
    float heightFactor = aVertexPosition.y > 0.0 ? aVertexPosition.y : 0.0;
    
    vec3 displacedPosition = aVertexPosition;
    displacedPosition.x += displacement + noiseX * heightFactor;
    displacedPosition.z += (displacement * 0.7) + (noiseY * heightFactor);
    
    displacedPosition.y += sin(timeOffset * 3.0 + aVertexPosition.x * 5.0) * 0.05 * heightFactor;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    
    vTextureCoord = aTextureCoord;
    
    vec3 normal = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));
    
    vLightWeighting = vec3(0.7, 0.7, 0.7) + normal * 0.3;
}