#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

const float TAU = 6.28318;
const float segments = 6.0;

vec3 palette(float t) {
    // Warm palette: reds, oranges, golds
    vec3 a = vec3(0.5, 0.4, 0.3);   // Brightness (less blue)
    vec3 b = vec3(0.5, 0.4, 0.3);   // Contrast
    vec3 c = vec3(1.0, 1.0, 1.0);   // Frequency
    vec3 d = vec3(0.0, 0.1, 0.2);   // Phase: R leads, B lags
    return a + b * cos(TAU * (c * t + d));
}

// Pattern function to avoid repetition
float getPattern(vec2 fuv, float zr, float drift) {
    float p = sin(fuv.x * 10.0 + drift)
            * cos(fuv.y * 8.0 - drift * 0.7)
            + sin(zr * 6.0 - drift * 1.5);
    return p * 0.25 + 0.5;
}

void main() {
    // Centered, aspect-corrected coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    // Rotate canvas over time
    float rotation = u_time * 0.1;
    uv = mat2(cos(rotation), -sin(rotation),
              sin(rotation), cos(rotation)) * uv;

    // Polar coordinates
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Kaleidoscope fold
    float segmentAngle = TAU / segments;
    angle = mod(angle, segmentAngle);
    angle = min(angle, segmentAngle - angle);

    // Infinite zoom with two-layer crossfade to hide seam
    float zoomSpeed = 0.3;
    float logRadius = log2(radius + 0.001) - u_time * zoomSpeed;

    // Two layers offset by 0.5
    float f1 = fract(logRadius);
    float f2 = fract(logRadius + 0.5);

    float zoomRadius1 = pow(2.0, f1);
    float zoomRadius2 = pow(2.0, f2);

    vec2 foldedUV1 = vec2(cos(angle), sin(angle)) * zoomRadius1;
    vec2 foldedUV2 = vec2(cos(angle), sin(angle)) * zoomRadius2;

    float drift = u_time * 0.2;
    float pattern1 = getPattern(foldedUV1, zoomRadius1, drift);
    float pattern2 = getPattern(foldedUV2, zoomRadius2, drift);

    // Crossfade: layer 1 peaks at f1=0.5, layer 2 peaks at f1=0 and f1=1
    float blend = smoothstep(0.0, 0.5, f1) * smoothstep(1.0, 0.5, f1);
    float pattern = mix(pattern2, pattern1, blend);

    // Color from palette
    vec3 color = palette(pattern + radius * 0.3 + u_time * 0.05);

    // Soft vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, radius);
    color *= vignette;

    // Deepen the colors
    color = pow(color, vec3(1.2));

    gl_FragColor = vec4(color, 1.0);
}
