#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uLakeMap;
uniform float timeFactor;

void main() {
    vec2 lakeCoords = (vTextureCoord - vec2(0.5)) * 2.5 + vec2(0.5); // Scaling

    vec4 colorLake = texture2D(uSampler, lakeCoords);
    vec4 colorGrass = texture2D(uGrassSampler, vTextureCoord);
	vec4 filter = texture2D(uLakeMap, vTextureCoord);

	if (filter.r < 0.1 && filter.g < 0.1 && filter.b < 0.1) {
        gl_FragColor = colorLake;
    } else {
        gl_FragColor = colorGrass;
    }
}