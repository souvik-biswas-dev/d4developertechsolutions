'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type IconKey = 'nextjs' | 'react' | 'node' | 'go' | 'docker' | 'aws' | 'typescript' | 'kubernetes'

interface OrbitSpec {
  key: IconKey
  label: string
  radius: number
  speed: number // radians per second, sign = direction
  tilt: number // orbit plane tilt (x)
  roll: number // orbit plane roll (z)
  phase: number
}

/* Different radii, tilts and speeds so the icons circle the logo at different depths */
const SPECS: OrbitSpec[] = [
  { key: 'react', label: 'React', radius: 2.5, speed: 0.3, tilt: 0.55, roll: 0.15, phase: 0 },
  { key: 'nextjs', label: 'Next.js', radius: 2.9, speed: -0.22, tilt: -0.35, roll: -0.25, phase: 1.2 },
  { key: 'node', label: 'Node.js', radius: 2.4, speed: 0.26, tilt: 0.2, roll: 0.5, phase: 2.4 },
  { key: 'go', label: 'Go', radius: 3.0, speed: -0.18, tilt: 0.7, roll: -0.1, phase: 3.4 },
  { key: 'docker', label: 'Docker', radius: 2.6, speed: 0.21, tilt: -0.6, roll: 0.3, phase: 4.3 },
  { key: 'aws', label: 'AWS', radius: 3.1, speed: 0.16, tilt: 0.1, roll: -0.45, phase: 5.2 },
  { key: 'typescript', label: 'TypeScript', radius: 2.35, speed: -0.33, tilt: -0.15, roll: 0.1, phase: 0.7 },
  { key: 'kubernetes', label: 'K8s', radius: 2.8, speed: 0.24, tilt: 0.4, roll: 0.6, phase: 2.0 },
]

/* ───────────────────────── icon textures (drawn on a canvas, no network) ───────────────────────── */

function roundedRectPath(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function polygon(g: CanvasRenderingContext2D, cx: number, cy: number, r: number, sides: number, rotation: number) {
  g.beginPath()
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) g.moveTo(x, y)
    else g.lineTo(x, y)
  }
  g.closePath()
}

function centeredText(g: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string) {
  g.font = font
  g.fillStyle = color
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, x, y)
}

function drawGlyph(g: CanvasRenderingContext2D, key: IconKey) {
  const cx = 128
  const cy = 106
  switch (key) {
    case 'react': {
      g.strokeStyle = '#61DAFB'
      g.lineWidth = 7
      for (let i = 0; i < 3; i++) {
        g.save()
        g.translate(cx, cy)
        g.rotate((i * Math.PI) / 3)
        g.beginPath()
        g.ellipse(0, 0, 66, 25, 0, 0, Math.PI * 2)
        g.stroke()
        g.restore()
      }
      g.fillStyle = '#61DAFB'
      g.beginPath()
      g.arc(cx, cy, 11, 0, Math.PI * 2)
      g.fill()
      break
    }
    case 'nextjs': {
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.arc(cx, cy, 58, 0, Math.PI * 2)
      g.fill()
      centeredText(g, 'N', cx, cy + 3, 'bold 78px Arial, sans-serif', '#000000')
      break
    }
    case 'node': {
      polygon(g, cx, cy, 62, 6, Math.PI / 6)
      g.fillStyle = '#5FA04E'
      g.fill()
      centeredText(g, 'JS', cx, cy + 2, 'bold 54px Arial, sans-serif', '#ffffff')
      break
    }
    case 'go': {
      centeredText(g, 'GO', cx, cy + 2, 'italic bold 86px Arial, sans-serif', '#00ADD8')
      break
    }
    case 'docker': {
      g.fillStyle = '#2496ED'
      const box = (x: number, y: number) => g.fillRect(x, y, 24, 22)
      ;[100, 128, 156].forEach((x) => box(x, 54))
      ;[44, 72, 100, 128, 156].forEach((x) => box(x, 80))
      g.beginPath()
      g.moveTo(34, 108)
      g.lineTo(206, 108)
      g.bezierCurveTo(212, 100, 222, 96, 234, 102)
      g.bezierCurveTo(228, 146, 190, 166, 120, 166)
      g.bezierCurveTo(70, 166, 40, 142, 34, 108)
      g.fill()
      break
    }
    case 'aws': {
      centeredText(g, 'aws', cx, cy - 8, 'bold 76px Arial, sans-serif', '#ffffff')
      g.strokeStyle = '#FF9900'
      g.lineWidth = 9
      g.lineCap = 'round'
      g.beginPath()
      g.arc(cx, cy - 22, 62, Math.PI * 0.24, Math.PI * 0.76)
      g.stroke()
      break
    }
    case 'typescript': {
      g.fillStyle = '#3178C6'
      g.beginPath()
      roundedRectPath(g, 66, 44, 124, 124, 14)
      g.fill()
      centeredText(g, 'TS', 128 + 10, 148, 'bold 60px Arial, sans-serif', '#ffffff')
      break
    }
    case 'kubernetes': {
      polygon(g, cx, cy, 62, 7, -Math.PI / 2)
      g.fillStyle = '#326CE5'
      g.fill()
      centeredText(g, 'K8s', cx, cy + 3, 'bold 40px Arial, sans-serif', '#ffffff')
      break
    }
  }
}

function makeIconTexture(spec: OrbitSpec): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const g = canvas.getContext('2d') as CanvasRenderingContext2D

  // glass tile
  g.beginPath()
  roundedRectPath(g, 12, 12, size - 24, size - 24, 54)
  const grad = g.createLinearGradient(0, 0, 0, size)
  grad.addColorStop(0, 'rgba(26,38,84,0.92)')
  grad.addColorStop(1, 'rgba(8,12,32,0.92)')
  g.fillStyle = grad
  g.fill()
  g.lineWidth = 4
  g.strokeStyle = 'rgba(20,200,240,0.6)'
  g.stroke()

  drawGlyph(g, spec.key)
  centeredText(g, spec.label, size / 2, 208, '600 26px system-ui, Arial, sans-serif', '#a9bcec')

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/* ───────────────────────── component ───────────────────────── */

interface TechOrbitProps {
  lite: boolean
  reducedMotion: boolean
}

export function TechOrbit({ lite, reducedMotion }: TechOrbitProps) {
  const specs = useMemo(() => (lite ? SPECS.slice(0, 6) : SPECS), [lite])
  const textures = useMemo(() => specs.map((s) => makeIconTexture(s)), [specs])
  const eulers = useMemo(() => specs.map((s) => new THREE.Euler(s.tilt, 0, s.roll)), [specs])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const sprites = useRef<(THREE.Sprite | null)[]>([])

  useEffect(() => {
    return () => textures.forEach((t) => t.dispose())
  }, [textures])

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    const t = reducedMotion ? 0 : elapsed
    const fadeIn = reducedMotion ? 1 : THREE.MathUtils.clamp((elapsed - 2.2) / 1.2, 0, 1)

    specs.forEach((s, i) => {
      const sprite = sprites.current[i]
      if (!sprite) return
      const a = s.phase + t * s.speed
      tmp.set(Math.cos(a) * s.radius, 0, Math.sin(a) * s.radius).applyEuler(eulers[i])
      sprite.position.copy(tmp)

      // nearer icons are bigger and brighter
      const depth = THREE.MathUtils.clamp(tmp.z / s.radius, -1, 1) * 0.5 + 0.5
      const size = 0.46 + depth * 0.24
      sprite.scale.set(size, size, 1)
      ;(sprite.material as THREE.SpriteMaterial).opacity = (0.5 + depth * 0.5) * fadeIn
    })
  })

  return (
    <group>
      {specs.map((s, i) => (
        <sprite
          key={s.key}
          ref={(el) => {
            sprites.current[i] = el
          }}
        >
          <spriteMaterial map={textures[i]} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
    </group>
  )
}
