#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform float intensityFactor;

uniform float particleSize;
uniform float randomSeed;  

void main() {

    float t = timeFactor * 2.0;

    vec2 distortedCoords = vTextureCoord;
distortedCoords.x += sin(t * 1.0 + vTextureCoord.y * 5.0) * 0.05;
distortedCoords.y += cos(t * 1.2 + vTextureCoord.x * 5.0) * 0.01;

    vec4 textureColor = texture2D(uSampler, distortedCoords);
    
    vec3 baseColor = vec3(1.0, 0.6, 0.1); // Orange
    
    float yPos = vTextureCoord.y;
    
    vec3 colorVariation = mix(
        vec3(1.0, 0.9, 0.2),  // Yellow
        vec3(0.9, 0.2, 0.0),  // Red
        yPos
    );
    
    //vec3 fireColor = mix(baseColor, colorVariation, 0.7);
    vec3 colorTint = mix(baseColor, colorVariation, 0.7);
    vec3 blendedColor = mix(colorTint, textureColor.rgb, 0.85);

    float brightness = (textureColor.r + textureColor.g + textureColor.b) / 3.0;
    float pulse = 0.1 * sin(t * 3.0 + vTextureCoord.y * 10.0) * brightness;
    //fireColor += vec3(pulse, pulse * 0.7, pulse * 0.3);
    //fireColor += textureColor.rgb * vec3(0.2, 0.1, 0.0);
    blendedColor += vec3(pulse, pulse * 0.5, pulse * 0.2);
    //vec3 blendedColor = mix(textureColor.rgb, fireColor, 0.7);

    vec3 finalColor = blendedColor * vLightWeighting * intensityFactor;

    float noisePattern = sin(vTextureCoord.x * 65.0 + t * 1.7) * 
                        cos(vTextureCoord.y * 55.0 + t * 1.3) * 
                        sin((vTextureCoord.x + vTextureCoord.y) * 40.0 + randomSeed) *
                        cos(vTextureCoord.x * 22.0 - vTextureCoord.y * 13.0 + t * 0.9);

    float gapThreshold = 0.55 + 0.35 * yPos + 
                        0.15 * sin(vTextureCoord.x * 40.0 + t) +
                        0.1 * cos(vTextureCoord.y * 30.0 - randomSeed * 0.5);
    float gapFactor = smoothstep(gapThreshold - 0.05 * particleSize, 
                        gapThreshold + 0.05 * particleSize, 
                        noisePattern);

    float baseAlpha = textureColor.a;
    float heightFactor = 1.0 - pow(yPos, 1.5); // Higher = more transparent
    float alpha = baseAlpha * heightFactor * (1.0 - gapFactor * yPos);
    
    gl_FragColor = vec4(finalColor, alpha);
    
}