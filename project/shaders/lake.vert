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

    /*if (filter.r < 0.5 && filter.g < 0.5 && filter.b < 0.5) {
        gl_Position = uPMatrix * uMVMatrix * vec4(wavePosition, 1.0);
    } else if (filter.r < 0.9 && filter.g < 0.9 && filter.b < 0.9) {
        float borderHeight = smoothstep(0.2, 0.5, filter.r) * 3.0;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0, 0.0, borderHeight), 1.0);
    } else {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }*/
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
