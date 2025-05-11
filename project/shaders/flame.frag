#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform float intensityFactor;

void main() {
    vec4 textureColor = texture2D(uSampler, vTextureCoord);
    
    float t = timeFactor * 2.0;
    
    vec3 baseColor = vec3(1.0, 0.6, 0.1); // Orange
    
    float yPos = vTextureCoord.y;
    
    vec3 colorVariation = mix(
        vec3(1.0, 0.9, 0.2),  // Yellow
        vec3(0.9, 0.2, 0.0),  // Red
        yPos
    );
    
    vec3 fireColor = mix(baseColor, colorVariation, 0.7);
    
    float pulse = 0.1 * sin(t * 3.0 + vTextureCoord.y * 10.0);
    fireColor += vec3(pulse, pulse * 0.7, pulse * 0.3);
    
    vec3 finalColor = fireColor * vLightWeighting * intensityFactor;
    
    float alpha = textureColor.a * 0.9;
    
    gl_FragColor = vec4(finalColor, alpha);
}