#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
varying float vVertexHeight;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform float intensityFactor;
uniform float particleSize;

void main() {
    float t = timeFactor * 2.5;
    
    vec2 distortedCoords = vTextureCoord;
    distortedCoords.x += sin(t * 1.2 + vTextureCoord.y * 8.0) * 0.06;
    distortedCoords.y += cos(t * 1.5 + vTextureCoord.x * 7.0) * 0.03;
    
    vec4 textureColor = texture2D(uSampler, distortedCoords);
    
    vec3 baseColor = vec3(1.0, 0.5, 0.1); // Deep orange
    vec3 tipColor = vec3(1.0, 0.9, 0.2);  // Yellow
    vec3 rootColor = vec3(0.8, 0.2, 0.0); // Deep red
    
    float yPos = vTextureCoord.y;
    vec3 colorVariation = mix(
        rootColor,
        tipColor,
        pow(yPos, 0.7)
    );
    
    vec3 fireColor = mix(baseColor, colorVariation, 0.7);
    
    float flicker = sin(t * 4.0 + vTextureCoord.y * 10.0) * 0.15;
    flicker += cos(t * 3.2 + vTextureCoord.x * 8.0) * 0.1;
    fireColor += vec3(flicker, flicker * 0.6, flicker * 0.3);
    
    vec3 blendedColor = mix(fireColor, textureColor.rgb, 0.4);
    
    vec3 finalColor = blendedColor * vLightWeighting * intensityFactor;
    
    float noisePattern = sin(vTextureCoord.x * 70.0 + t * 1.9) * 
                         cos(vTextureCoord.y * 60.0 + t * 1.5) * 
                         sin((vTextureCoord.x + vTextureCoord.y) * 45.0) * 
                         cos(vTextureCoord.x * 25.0 - vTextureCoord.y * 15.0 + t);
    
    float gapThreshold = 0.6 + 0.3 * yPos + 
                    0.2 * sin(vTextureCoord.x * 35.0 + t) +
                    0.15 * cos(vTextureCoord.y * 25.0 - t * 0.7);
    
    float gapFactor = smoothstep(gapThreshold - 0.05 * particleSize, 
                         gapThreshold + 0.05 * particleSize, 
                         noisePattern);
    
    float heightFactor = 1.0 - pow(yPos, 2.0); 
    float alpha = textureColor.a * heightFactor * (1.0 - gapFactor * yPos);
    
    gl_FragColor = vec4(finalColor, alpha);
}