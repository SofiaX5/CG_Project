#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
varying float vVertexHeight;

uniform sampler2D uSampler;
uniform float timeFactor;
uniform float intensityFactor;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return vec2(mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y,
                random(st + vec2(timeFactor * 0.1)));
}

void main() {
    vec2 distortedCoord = vTextureCoord;
    
    float distortionStrength = 0.1 + 0.2 * vVertexHeight;
    
    float timeScale = timeFactor * 2.0;
    
    distortedCoord.x += sin(distortedCoord.y * 10.0 + timeScale) * 0.03 * distortionStrength;
    
    distortedCoord.y += sin(distortedCoord.x * 8.0 + timeScale * 0.7) * 0.02 * distortionStrength;
    
    vec2 noiseVec = noise(distortedCoord * 5.0 + timeScale * vec2(0.5, 1.0));
    distortedCoord += noiseVec * distortionStrength * 0.1;
    
    vec4 textureColor = texture2D(uSampler, distortedCoord);
    
    vec3 baseColor = vec3(1.0, 0.9, 0.5);
    vec3 midColor = vec3(1.0, 0.9, 0.5); 
    vec3 tipColor = vec3(1.0, 0.3, 0.0); 
    
    vec3 colorModifier;
    if (vVertexHeight < 0.4) {
        float t = vVertexHeight / 0.4;
        colorModifier = mix(baseColor, midColor, t);
    } else {
        float t = (vVertexHeight - 0.4) / 0.6;
        colorModifier = mix(midColor, tipColor, t);
    }
        
    float flicker = sin(timeFactor * 10.0 + vVertexHeight * 15.0) * 0.05 + 
                    sin(timeFactor * 7.3 + vVertexHeight * 20.0) * 0.03 +
                    sin(timeFactor * 18.7 + vVertexHeight * 25.0) * 0.02;
    
    vec3 flameColor = textureColor.rgb * colorModifier;
    
    float brightness = 1.2 + flicker - 0.5 * (1.0 - vVertexHeight);

    flameColor = mix(flameColor, textureColor.rgb * brightness, 0.8);
    
    flameColor *= brightness * intensityFactor * vLightWeighting;
    
    float alpha = textureColor.a * (0.3 + vVertexHeight * 0.7);


    alpha *= 0.8 + 0.3 * noiseVec.x;
    
    gl_FragColor = vec4(flameColor, alpha);
}