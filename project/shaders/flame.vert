attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
varying float vVertexHeight;

void main() {
    float vertexHeight = aVertexPosition.y;
    vVertexHeight = vertexHeight;
    
    float timeOffset = timeFactor * 3.0;
    
    float waveAmplitude = 0.12 * (1.0 + vertexHeight);
    
    float xDisplacement = waveAmplitude * sin(timeOffset + aVertexPosition.x * 2.5);
    float zDisplacement = waveAmplitude * cos(timeOffset * 0.8 + aVertexPosition.z * 2.0);
    
    xDisplacement += waveAmplitude * 0.4 * sin(timeOffset * 2.3 + aVertexPosition.y * 3.0);
    zDisplacement += waveAmplitude * 0.3 * cos(timeOffset * 1.7 + aVertexPosition.x * 3.5);
    
    float heightFactor = max(0.0, vertexHeight);
    
    vec3 displacedPosition = aVertexPosition;
    displacedPosition.x += xDisplacement * heightFactor;
    displacedPosition.z += zDisplacement * heightFactor;
    
    displacedPosition.y += sin(timeOffset * 2.5 + aVertexPosition.x * 4.0) * 0.08 * heightFactor;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    
    vTextureCoord = aTextureCoord;
    
    vec3 transformedNormal = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));
    vLightWeighting = vec3(0.6, 0.6, 0.6) + transformedNormal * 0.4;
}