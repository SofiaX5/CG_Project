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
    vec4 filter = texture2D(uLakeMap, vTextureCoord);
    
    float frequency = 10.0;
    float amplitude = 0.5;
    float speed = 0.2;

    float wave = sin((aTextureCoord.x + timeFactor * speed) * frequency)
               * cos((aTextureCoord.y + timeFactor * speed) * frequency);

    vec3 wavePosition = aVertexPosition + vec3(0.0, 0.0, wave * amplitude);

    gl_Position = uPMatrix * uMVMatrix * vec4(wavePosition, 1.0);

    if (filter.r < 0.1 && filter.g < 0.1 && filter.b < 0.1) {
        gl_Position = uPMatrix * uMVMatrix * vec4(wavePosition, 1.0);
    } else {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
}
