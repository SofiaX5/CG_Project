#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uLakeMap;
uniform float timeFactor;

void main() {
    vec2 lakeCoords = (vTextureCoord - vec2(0.5)) * 3.0 + vec2(0.5); // Zoom para a água
    vec4 colorLake = texture2D(uSampler, lakeCoords);
    vec4 colorGrass = texture2D(uGrassSampler, vTextureCoord);
    vec4 filter = texture2D(uLakeMap, vTextureCoord);

    float lakeStrength = 1.0 - length(filter.rgb); // Assume preto = lago
    float smoothEdge = smoothstep(0.1, 0.2, lakeStrength); // Transição suave

    // Transição da relva para a água
    vec4 finalColor = mix(colorGrass, colorLake, smoothEdge);

    // 🌑 Escurecer borda se for "cinzento" (entre preto e branco)
    if (filter.r < 0.9 && filter.g < 0.9 && filter.b < 0.9 &&
        filter.r > 0.7 && filter.g > 0.7 && filter.b > 0.7) {
        finalColor.rgb *= 0.9; // Mais escuro (podes usar 0.7, 0.3, etc.)
    }

    gl_FragColor = finalColor;
}
