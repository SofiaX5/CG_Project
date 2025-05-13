attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;


uniform sampler2D uSampler;
uniform sampler2D uLakeMap;
uniform float timeFactor;

void main() {
    vTextureCoord = aTextureCoord;
    float frequency = 10.0;
    float amplitude = 0.2;
    float speed = 0.2;

    float wave = sin((aTextureCoord.x + timeFactor * speed) * frequency)
               * cos((aTextureCoord.y + timeFactor * speed) * frequency);

    vec3 wavePosition = aVertexPosition + vec3(0.0, 0.0, wave * amplitude);

    gl_Position = uPMatrix * uMVMatrix * vec4(wavePosition, 1.0);
}
