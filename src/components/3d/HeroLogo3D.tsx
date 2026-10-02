'use client'

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import gsap from 'gsap'
import { D_PATH, FOUR_PATH, LOGO_CENTER, LOGO_HEIGHT, RING_NODE } from './logoData'
import type { PointerState } from './usePointerRef'

/* ───────────────────────── constants ───────────────────────── */

const DEPTH = 26 // extrusion depth in SVG units (logo is ~224 wide)
const BEVEL_T = 3
const LOGO_SCALE = 3.4 / LOGO_HEIGHT // logo is ~3.4 world units tall
const FRONT_Z = DEPTH + BEVEL_T // z of the front face after bevel

const D_COLORS: [string, string] = ['#1E40AF', '#7C3AED'] // top-left -> bottom-right
const FOUR_COLORS: [string, string] = ['#06B6D4', '#3B82F6'] // bottom-left -> top-right

/* ───────────────────────── geometry helpers ───────────────────────── */

/**
 * Extrudes one filled SVG path. SVGLoader keeps holes (evenodd), so the D keeps its open
 * counter and the ring node keeps its hole.
 */
function extrudePath(d: string, lite: boolean): THREE.ExtrudeGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 262"><path fill-rule="evenodd" d="${d}"/></svg>`
  const parsed = new SVGLoader().parse(svg)
  const shapes: THREE.Shape[] = []
  parsed.paths.forEach((p) => shapes.push(...SVGLoader.createShapes(p)))

  return new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    curveSegments: lite ? 3 : 5,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: BEVEL_T,
    bevelSize: 1.6,
    bevelOffset: 0,
    bevelSegments: lite ? 2 : 3,
  })
}

/** Reproduces the SVG gradient (objectBoundingBox) as per-vertex colors. */
function paintGradient(geo: THREE.BufferGeometry, from: string, to: string, upward: boolean) {
  geo.computeBoundingBox()
  const box = geo.boundingBox as THREE.Box3
  const pos = geo.getAttribute('position')
  const w = Math.max(1e-3, box.max.x - box.min.x)
  const h = Math.max(1e-3, box.max.y - box.min.y)
  const c0 = new THREE.Color(from)
  const c1 = new THREE.Color(to)
  const c = new THREE.Color()
  const colors = new Float32Array(pos.count * 3)

  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getX(i) - box.min.x) / w
    const v = (pos.getY(i) - box.min.y) / h // SVG y grows downward
    const t = THREE.MathUtils.clamp(upward ? (u + (1 - v)) / 2 : (u + v) / 2, 0, 1)
    c.copy(c0).lerp(c1, t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

/** Thin glowing rim that sits on the front face of the circuit ring node. */
function ledGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  shape.absarc(RING_NODE.cx, RING_NODE.cy, 12.4, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  hole.absarc(RING_NODE.cx, RING_NODE.cy, 8.8, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  return new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false, curveSegments: 32 })
}

/* ───────────────────────── particles ───────────────────────── */

function buildParticles(meshes: THREE.Mesh[], count: number): THREE.BufferGeometry {
  const samplers = meshes.map((m) => new MeshSurfaceSampler(m).build())
  const dShare = 0.6 // D covers ~60% of the front area, the 4 + tail the rest

  const target = new Float32Array(count * 3)
  const start = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  const rand = new Float32Array(count * 2)

  const p = new THREE.Vector3()
  const n = new THREE.Vector3()
  const col = new THREE.Color()
  const white = new THREE.Color('#ffffff')

  for (let i = 0; i < count; i++) {
    const sampler = samplers[Math.random() < dShare ? 0 : 1]
    let tries = 0
    do {
      sampler.sample(p, n, col)
      tries++
    } while (n.z < -0.5 && tries < 6) // prefer the front and the sides, skip the back

    target[i * 3] = p.x
    target[i * 3 + 1] = p.y
    target[i * 3 + 2] = p.z

    // scatter start: a shell around the logo
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const rad = 240 + Math.random() * 360
    start[i * 3] = LOGO_CENTER.x + Math.sin(phi) * Math.cos(theta) * rad
    start[i * 3 + 1] = LOGO_CENTER.y + Math.sin(phi) * Math.sin(theta) * rad
    start[i * 3 + 2] = DEPTH / 2 + Math.cos(phi) * rad

    col.lerp(white, 0.25)
    color[i * 3] = col.r
    color[i * 3 + 1] = col.g
    color[i * 3 + 2] = col.b

    rand[i * 2] = Math.random()
    rand[i * 2 + 1] = Math.random()
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(target, 3)) // also the final position
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 2))
  return geo
}

const particleVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uDpr;
  uniform float uOpacity;
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute vec2 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // each particle starts at a slightly different time
    float p = clamp((uProgress - aRand.x * 0.4) / 0.6, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - p, 3.0);

    vec3 pos = mix(aStart, position, e);

    // swirl while travelling, calm once settled
    float swirl = (1.0 - e) * 22.0;
    pos.x += sin(uTime * 1.6 + aRand.y * 6.2831) * swirl * 0.5;
    pos.y += cos(uTime * 1.3 + aRand.y * 6.2831) * swirl * 0.5;
    pos.z += sin(uTime * 2.0 + aRand.y * 20.0) * 0.9 * e;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uDpr * (0.6 + aRand.y * 0.8) / max(0.1, -mv.z);

    vColor = aColor;
    vAlpha = uOpacity * (0.3 + 0.7 * e);
  }
`

const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(vColor * 1.25, a * vAlpha);
    #include <colorspace_fragment>
  }
`

/* ───────────────────────── component ───────────────────────── */

interface HeroLogo3DProps {
  pointer: MutableRefObject<PointerState>
  particleCount: number
  lite: boolean
  reducedMotion: boolean
}

export function HeroLogo3D({ pointer, particleCount, lite, reducedMotion }: HeroLogo3DProps) {
  const floatRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const anim = useRef({ progress: 0, reveal: 0, particleOpacity: 1 })
  const solidDone = useRef(false)

  const assets = useMemo(() => {
    const dGeo = extrudePath(D_PATH, lite)
    const fourGeo = extrudePath(FOUR_PATH, lite)
    paintGradient(dGeo, D_COLORS[0], D_COLORS[1], false)
    paintGradient(fourGeo, FOUR_COLORS[0], FOUR_COLORS[1], true)
    const ledGeo = ledGeometry()

    const particleGeo = buildParticles([new THREE.Mesh(dGeo), new THREE.Mesh(fourGeo)], particleCount)

    const bodyMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.35,
      roughness: 0.26,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.1,
      transparent: true, // fades in at the end of the assembly, switched off afterwards
      opacity: 0,
    })
    const ledBase = new THREE.Color('#14C8F0')
    const ledMat = new THREE.MeshBasicMaterial({
      color: ledBase.clone().multiplyScalar(2.4),
      toneMapped: false,
      transparent: true,
      opacity: 0,
    })

    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: lite ? 30 : 24 },
        uDpr: { value: 1 },
        uOpacity: { value: 1 },
      },
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { dGeo, fourGeo, ledGeo, particleGeo, bodyMat, ledMat, ledBase, particleMat }
  }, [particleCount, lite])

  /* Free GPU resources when the scene goes away */
  useEffect(() => {
    return () => {
      assets.dGeo.dispose()
      assets.fourGeo.dispose()
      assets.ledGeo.dispose()
      assets.particleGeo.dispose()
      assets.bodyMat.dispose()
      assets.ledMat.dispose()
      assets.particleMat.dispose()
    }
  }, [assets])

  /* GSAP timeline: particles fly in and assemble, the glossy solid fades in, particles fade out */
  useEffect(() => {
    const a = anim.current
    solidDone.current = false

    if (reducedMotion) {
      a.progress = 1
      a.reveal = 1
      a.particleOpacity = 0
      return
    }

    a.progress = 0
    a.reveal = 0
    a.particleOpacity = 1

    const tl = gsap.timeline({ delay: 0.25 })
    tl.to(a, { progress: 1, duration: 2.6, ease: 'power2.inOut' })
      .to(a, { reveal: 1, duration: 1.0, ease: 'power2.out' }, 2.0)
      .to(a, { particleOpacity: 0, duration: 1.1, ease: 'power1.inOut' }, 2.5)

    return () => {
      tl.kill()
    }
  }, [reducedMotion, assets])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const a = anim.current
    const { particleMat, bodyMat, ledMat, ledBase } = assets

    // particles
    particleMat.uniforms.uTime.value = t
    particleMat.uniforms.uProgress.value = a.progress
    particleMat.uniforms.uOpacity.value = a.particleOpacity
    particleMat.uniforms.uDpr.value = state.viewport.dpr
    if (pointsRef.current) pointsRef.current.visible = a.particleOpacity > 0.01

    // glossy solid fade-in, then back to an opaque material (cheaper and sorts correctly)
    if (!solidDone.current) {
      bodyMat.opacity = a.reveal
      ledMat.opacity = a.reveal
      if (a.reveal >= 1) {
        bodyMat.transparent = false
        ledMat.transparent = false
        bodyMat.opacity = 1
        ledMat.opacity = 1
        bodyMat.needsUpdate = true
        ledMat.needsUpdate = true
        solidDone.current = true
      }
    }

    // cyan node pulses (>1 so the bloom picks it up)
    ledMat.color.copy(ledBase).multiplyScalar(2.1 + Math.sin(t * 3) * 0.7)

    // floating idle motion + tilt toward the cursor
    const g = floatRef.current
    if (g) {
      const settle = a.reveal
      const k = Math.min(1, delta * 3)
      const targetRX = reducedMotion ? 0 : -pointer.current.y * 0.3
      const targetRY = reducedMotion ? 0 : pointer.current.x * 0.45 + Math.sin(t * 0.35) * 0.14 * settle
      g.rotation.x += (targetRX - g.rotation.x) * k
      g.rotation.y += (targetRY - g.rotation.y) * k
      g.position.y = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.12 * settle
      const s = 0.94 + 0.06 * settle
      g.scale.setScalar(s)
    }
  })

  return (
    <group ref={floatRef}>
      {/* SVG space -> world: flip Y, scale, and centre on the logo */}
      <group scale={[LOGO_SCALE, -LOGO_SCALE, LOGO_SCALE]}>
        <group position={[-LOGO_CENTER.x, -LOGO_CENTER.y, -DEPTH / 2]}>
          <mesh geometry={assets.dGeo} material={assets.bodyMat} />
          <mesh geometry={assets.fourGeo} material={assets.bodyMat} />
          <mesh geometry={assets.ledGeo} material={assets.ledMat} position={[0, 0, FRONT_Z - 1]} />
          <points ref={pointsRef} geometry={assets.particleGeo} material={assets.particleMat} frustumCulled={false} />
        </group>
      </group>
    </group>
  )
}
