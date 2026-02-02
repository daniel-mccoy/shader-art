# Shader Art Project

## Overview
GLSL fragment shaders for visual art, designed for glslViewer on macOS.

## Running Shaders
```bash
./scripts/run.sh                    # runs shaders/main.frag at 1280x720
glslviewer shaders/myshader.frag    # run a specific shader
```
glslViewer hot-reloads on file save.

## GLSL Conventions for This Project

### Standard Uniforms (provided by glslViewer)
- `u_resolution` (vec2) - viewport size in pixels
- `u_time` (float) - elapsed time in seconds
- `u_mouse` (vec2) - mouse position in pixels

### Coordinate System
Always normalize coordinates early in main():
```glsl
vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
```
This centers the origin and maintains aspect ratio.

### File Structure
- `shaders/` - all .frag files live here
- `shaders/main.frag` - primary working shader
- `shaders/lib/` - reusable functions (noise, SDFs, etc.) when we build them

### Code Style
- Use descriptive variable names: `dist` not `d`, `angle` not `a`
- Comment sections of complex math
- Group related functions together
- Prefer `mix()` over manual lerp math
- Use `const` for fixed values

### Common Patterns

**Soft circles (SDF style):**
```glsl
float circle = smoothstep(0.01, 0.0, length(uv) - radius);
```

**Palette cycling:**
```glsl
vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}
```

**Polar coordinates:**
```glsl
float angle = atan(uv.y, uv.x);
float radius = length(uv);
```

### Aesthetic Direction
Target: ambient, organic, slowly evolving visuals suitable for music visualization.
Prefer: smooth gradients, subtle motion, deep colors, cosmic/natural themes.
Avoid: harsh edges, strobing, high-contrast flicker.

## Future: Audio Reactivity
Will add OSC input from Ableton via Max for Live. Uniforms like `u_bass`, `u_mid`, `u_high` will drive visual parameters.
