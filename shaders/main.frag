#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Attempt 1: ambient, cosmic swirl

vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
    // Centered, aspect-corrected coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    // Polar coordinates
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Slow spiral distortion
    float spiral = angle + radius * 3.0 - u_time * 0.3;

    // Layered waves for organic feel
    float wave1 = sin(spiral * 3.0) * 0.5 + 0.5;
    float wave2 = sin(radius * 8.0 - u_time * 0.5) * 0.5 + 0.5;
    float pattern = mix(wave1, wave2, 0.5);

    // Color from palette, shifted by position and time
    vec3 color = palette(pattern + u_time * 0.1);

    // Soft vignette
    float vignette = 1.0 - smoothstep(0.3, 0.9, radius);
    color *= vignette;

    // Deepen the colors
    color = pow(color, vec3(1.2));

    gl_FragColor = vec4(color, 1.0);
}
