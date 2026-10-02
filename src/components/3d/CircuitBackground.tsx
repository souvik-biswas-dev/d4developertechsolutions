'use client'

import { useEffect, useMemo, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PointerState } from './usePointerRef'

/**
 * Full-screen GLSL quad drawn behind everything: faint circuit traces made of random
 * horizontal/vertical segments with end pads, and light pulses that travel along them.
 * The pulses speed up and brighten near the cursor.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec3 uBg;
  uniform vec3 uBlue;
  uniform vec3 uViolet;
  uniform vec3 uCyan;
  varying vec2 vUv;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // One orientation of lanes. q.x runs ALONG a lane, q.y runs ACROSS lanes.
  // Returns vec3(line, pulse, pad).
  vec3 lanes(vec2 q, float perUnit, float seed, float boost) {
    float lane = floor(q.y * perUnit);
    float across = fract(q.y * perUnit) - 0.5;      // -0.5..0.5 in lane units
    float lr = hash21(vec2(lane, seed));
    float laneOn = step(0.25, lr);

    float segLen = 0.6 + hash21(vec2(lane, seed + 7.0)) * 0.9;
    float sx = q.x / segLen + lr * 40.0;
    float seg = floor(sx);
    float fx = fract(sx);
    float key = lane + seed * 13.0;
    float on   = step(0.38, hash21(vec2(seg, key)));
    float next = step(0.38, hash21(vec2(seg + 1.0, key)));
    float prev = step(0.38, hash21(vec2(seg - 1.0, key)));

    float w = 0.04;
    float line = (1.0 - smoothstep(w * 0.35, w, abs(across))) * on * laneOn;

    // comet pulse travelling along the lane
    float dir = lr > 0.62 ? -1.0 : 1.0;
    float speed = 0.35 + lr * 0.45 + boost * 0.9;
    float cycle = 7.0;
    float phase = fract(dir * uTime * speed / cycle + lr);
    float s = fract(q.x / cycle);
    float k = fract(dir * (phase - s));              // 0 at the head, grows behind it
    float pulse = exp(-k * cycle * 2.4) * line;

    // pads at segment ends
    float acrossUnits = across / perUnit;
    float dEnd = length(vec2((1.0 - fx) * segLen, acrossUnits));
    float dStart = length(vec2(fx * segLen, acrossUnits));
    float padEnd = on * (1.0 - next) * ((1.0 - smoothstep(0.0, 0.012, abs(dEnd - 0.05))) + (1.0 - smoothstep(0.0, 0.02, dEnd)));
    float padStart = on * (1.0 - prev) * (1.0 - smoothstep(0.0, 0.012, abs(dStart - 0.05)));
    float pad = (padEnd + padStart) * laneOn;

    return vec3(line, pulse, pad);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(1.0, uRes.y);
    vec2 p = vec2(uv.x * aspect, uv.y) * 6.0;
    vec2 m = vec2(uMouse.x * aspect, uMouse.y) * 6.0;
    float md = distance(p, m);
    float mouse = exp(-md * md * 0.35);

    vec3 h = lanes(p, 3.0, 1.0, mouse);
    vec3 v = lanes(vec2(p.y, p.x), 3.0, 9.0, mouse);

    vec3 base = mix(uBlue, uViolet, clamp(uv.x * 0.8 + uv.y * 0.2, 0.0, 1.0));
    vec3 col = base * (h.x + v.x) * (0.2 + mouse * 0.35);
    col += uCyan * (h.y + v.y) * (1.6 + mouse * 1.4);
    col += mix(uBlue, uCyan, 0.5) * (h.z + v.z) * (0.45 + mouse * 0.6);
    col += uViolet * mouse * 0.05;

    // fade toward the edges so the canvas blends into the page
    float fade = smoothstep(0.0, 0.2, uv.x) * (1.0 - smoothstep(0.85, 1.0, uv.x))
               * smoothstep(0.0, 0.14, uv.y) * (1.0 - smoothstep(0.86, 1.0, uv.y));

    gl_FragColor = vec4(uBg + col * fade, 1.0);
    #include <colorspace_fragment>
  }
`

interface CircuitBackgroundProps {
  pointer: MutableRefObject<PointerState>
}

export function CircuitBackground({ pointer }: CircuitBackgroundProps) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uBg: { value: new THREE.Color('#050816') },
          uBlue: { value: new THREE.Color('#2F5BEA') },
          uViolet: { value: new THREE.Color('#7B3FF2') },
          uCyan: { value: new THREE.Color('#14C8F0') },
        },
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
      }),
    []
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    const u = material.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uRes.value.set(state.size.width, state.size.height)
    // ease the mouse so the glow glides instead of jumping
    u.uMouse.value.x += (pointer.current.u - u.uMouse.value.x) * 0.08
    u.uMouse.value.y += (pointer.current.v - u.uMouse.value.y) * 0.08
  })

  return (
    <mesh renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
