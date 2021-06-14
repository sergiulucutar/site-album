attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uOffset;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // vUv = uv;
  vUv =  vec2(uv.x + uOffset * 0.2, uv.y);
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
