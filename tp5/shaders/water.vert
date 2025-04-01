attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uWaterMap;
uniform float timeFactor;

void main() {
	vTextureCoord = aTextureCoord;

	vec4 filter = texture2D(uWaterMap, vec2(0.0,0.1)+vTextureCoord+vec2(timeFactor*0.007,timeFactor*0.007)); // multplicar pela normal
	vec3 offset=vec3(.0,0.0,+filter.b*0.1);
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

