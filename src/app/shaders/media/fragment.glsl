precision highp float;

uniform sampler2D uTexture;
uniform vec2 uTextureScale;

varying vec2 vUv;
varying vec3 vNormal;

vec2 scaleUV(vec2 uv,float scale) {
  float center = 0.5;
  return ((uv - center) * scale) + center;
}

void main() {
  vec2 newUv = (vUv - 0.5) / uTextureScale + 0.5;
  // vec2 newUv = vUv * uTextureOffset
  vec3 texture = texture2D(uTexture,scaleUV(newUv, 1.0)).rgb;

  gl_FragColor = vec4(texture, 1.0);
}
