#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uLakeMap;
uniform float timeFactor;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 filter = texture2D(uLakeMap, vTextureCoord);

	if (filter.r < 0.1 && filter.g < 0.1 && filter.b < 0.1) {
        gl_FragColor = color;
    } else {
        discard;
    }
}