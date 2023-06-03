 export const basicFragmentShader: string = 
`#version 300 es

// set the floating point precision to medium
precision mediump float;
uniform vec4 uColor;

out vec4 fragColor;

void main() {
fragColor = uColor;
} 
 `