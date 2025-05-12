attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;

uniform float swayAmplitude;
uniform float swayFrequency;
uniform float riseSpeed;
uniform float twistFactor;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
varying float vVertexHeight;

void main() {
float vertexHeight = aVertexPosition.y;
    vVertexHeight = vertexHeight;

    float flameTime = timeFactor * riseSpeed;
    
    float normalizedHeight = clamp(vertexHeight, 0.0, 1.0);

    float bandSize = 0.2; 
    int bandIndex = int(floor(vertexHeight / bandSize));
    
    float directionMultiplier = mod(float(bandIndex), 2.0) == 0.0 ? 1.0 : -1.0;

    float oscillation = sin(flameTime * swayFrequency + vertexHeight * 10.0);
    float swayX = swayAmplitude * oscillation * directionMultiplier;
    float swayZ = swayAmplitude * cos(flameTime * swayFrequency + vertexHeight * 7.0) * directionMultiplier * 0.5;

    float twist = sin(flameTime * twistFactor + vertexHeight * 4.0) * 0.15 * normalizedHeight;
    float tipMovement = smoothstep(0.7, 1.0, normalizedHeight);
    
    vec3 displacedPosition = aVertexPosition;
    displacedPosition.x += (swayX + twist + tipMovement * sin(flameTime * 3.0) * 0.1);
    displacedPosition.z += (swayZ - twist + tipMovement * cos(flameTime * 2.7) * 0.1);

    float verticalWave = sin(flameTime * 2.0 + vertexHeight * 5.0) * 0.2;
    displacedPosition.y += verticalWave * normalizedHeight * 0.3;


    if (vertexHeight <= 0.01) {
        displacedPosition.y = aVertexPosition.y;
        displacedPosition.x = aVertexPosition.x;
        displacedPosition.z = aVertexPosition.z;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    
    vTextureCoord = aTextureCoord;
    vec3 transformedNormal = normalize(vec3(uNMatrix * vec4(aVertexNormal, 0.0)));
    vLightWeighting = vec3(1.0, 1.0, 1.0); 
}