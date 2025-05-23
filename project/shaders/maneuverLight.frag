#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vPulseIntensity;

uniform vec3 uBaseColor;

void main() {
    // Apply pulsating emission to the base color
    vec3 finalColor = uBaseColor * vPulseIntensity;
    
    // Output final color with full opacity
    gl_FragColor = vec4(finalColor, 1.0);
}