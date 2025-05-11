#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform float intensityFactor;

void main() {

    float t = timeFactor * 2.0;

    vec2 distortedCoords = vTextureCoord;
    distortedCoords.x += sin(t * 2.0 + vTextureCoord.y * 5.0) * 0.05;
    distortedCoords.y += cos(t * 2.5 + vTextureCoord.x * 5.0) * 0.01;

    vec4 textureColor = texture2D(uSampler, distortedCoords);
    
    vec3 baseColor = vec3(1.0, 0.6, 0.1); // Orange
    
    float yPos = vTextureCoord.y;
    
    vec3 colorVariation = mix(
        vec3(1.0, 0.9, 0.2),  // Yellow
        vec3(0.9, 0.2, 0.0),  // Red
        yPos
    );
    
    vec3 fireColor = mix(baseColor, colorVariation, 0.7);
        
    float brightness = (textureColor.r + textureColor.g + textureColor.b) / 3.0;
    float pulse = 0.1 * sin(t * 3.0 + vTextureCoord.y * 10.0) * brightness;
    fireColor += vec3(pulse, pulse * 0.7, pulse * 0.3);
    fireColor += textureColor.rgb * vec3(0.2, 0.1, 0.0);

    vec3 blendedColor = mix(textureColor.rgb, fireColor, 0.7);

    vec3 finalColor = blendedColor * vLightWeighting * intensityFactor;

    float alpha = textureColor.a * 0.9;
    
    gl_FragColor = vec4(finalColor, alpha);
    
}