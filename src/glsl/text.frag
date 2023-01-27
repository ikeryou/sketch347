uniform sampler2D t;
uniform bool useMask;
uniform vec3 c;
uniform vec2 bp;
uniform vec2 ma;
uniform vec2 mb;
uniform vec2 mc;
uniform float line;
uniform float time;

varying vec2 vUv;

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
  return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

void main(void) {
  vec3 p = vec3(vUv, 0.0);

  vec3 v1 = vec3(ma, 0.0);
  vec3 v2 = vec3(mb, 0.0);
  vec3 v3 = vec3(mc, 0.0);

  vec3 pA = cross(v2 - v1, p - v1);
  vec3 pB = cross(v3 - v2, p - v2);
  vec3 pC = cross(v1 - v3, p - v3);

  float dotA = dot(pA, pB);
  float dotB = dot(pA, pC);

  vec4 dest = texture2D(t, vUv);
  dest.rgb *= c;


  float lineScale = 10.0;
  if((dotA > 0.0 && dotB > 0.0) || useMask) {
    dest.rgb *= 2.0;
    lineScale *= 0.2;
    // dest.a = 0.0;
  }

  vec2 v = (vUv.xy + vec2(time * 0.0, time * 0.1)) * lineScale;
  // v = mix(vUv, v, map(distance(bp, vUv), 0.0, 0.5, 0.0, 2.0));
  // v = mix(vUv, v, map(distance(bp, vUv), 0.0, 0.5, 0.0, 2.0));
  float f = sin(v.x + v.y) + cos(v.x + v.y) * 0.75;
  float aa = smoothstep(line * 1.0, abs(f) * -1.0, distance(bp, vUv) * 1.5);
  dest.a *= pow(aa, 0.75);
  // dest.a = clamp(dest.a, 0.0, 1.0);
  dest.rgb *= pow(aa, 0.75) * 20.0;

  dest.rgb *= dest.rgb;
  dest.rgb *= dest.rgb;
  // dest.rgb *= dest.rgb;

  // dest.rgb = 1.0 - dest.rgb;

  // float contrast = 1.0;
  // dest.rgb = (dest.rgb - 0.5) / (1.0 - contrast) + 0.5;
  // dest.a += 0.1;
  // dest.a *= smoothstep(abs(f), line, map(distance(bp, vUv), 0.0, 0.5, 0.0, 10.0));

  gl_FragColor = dest;

  // if((dotA > 0.0 && dotB > 0.0) || useMask) {
  //   vec4 dest = texture2D(t, vUv);
  //   dest.rgb = c;
  //   // dest.rgb = mix(c, 1.0 - c, dest.a);
  //   // dest.a = 1.0;

  //   float lineScale = 10.0;
  //   vec2 v = vUv.xy * lineScale;
  //   float f = sin(v.x + v.y);
  //   // dest.a *= 1.0 - step(abs(f), line);

  //   gl_FragColor = dest;
  // } else {
  //   gl_FragColor = texture2D(t, vUv);
  //   gl_FragColor.rgb = vec3(1.0, 0.0, 0.0);
  //   // discard;
  // }
}
