'use client'

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PointerState } from './usePointerRef'

const W = 512
const H = 320
const MONO = '500 20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

interface PanelSpec {
  title: string
  code: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  charsPerSecond: number
  startAt: number
}

const PANELS: PanelSpec[] = [
  {
    title: 'page.tsx',
    code: 'const items = await getProjects();\nreturn <Work items={items} />;\n// ship it',
    position: [-2.1, 1.55, -0.8],
    rotation: [0.04, 0.32, -0.02],
    scale: 1,
    charsPerSecond: 22,
    startAt: 2.6,
  },
  {
    title: 'main.go',
    code: 'func main() {\n  mux := http.NewServeMux()\n  mux.HandleFunc("/health", ok)\n  http.ListenAndServe(":8080", mux)\n}',
    position: [2.15, -1.55, 0.6],
    rotation: [-0.03, -0.3, 0.02],
    scale: 1,
    charsPerSecond: 26,
    startAt: 3.2,
  },
  {
    title: 'Dockerfile',
    code: 'FROM node:alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\nCMD ["npm", "start"]',
    position: [2.3, 1.45, -1.7],
    rotation: [0.05, -0.38, 0.03],
    scale: 0.82,
    charsPerSecond: 24,
    startAt: 3.8,
  },
]

/* ───────────────────────── drawing ───────────────────────── */

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|var|await|async|return|import|from|export|default|function|func|package|type|if|else|for|range|FROM|WORKDIR|COPY|RUN|CMD)\b)|([A-Za-z_][\w.]*(?=\())|(\s+)|([\s\S])/g

const COLORS = {
  comment: '#637777',
  string: '#c3e88d',
  number: '#f78c6c',
  keyword: '#c792ea',
  fn: '#82aaff',
  punct: '#89ddff',
  text: '#d6deeb',
}

function roundedRectPath(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function paintPanel(g: CanvasRenderingContext2D, title: string, text: string, caret: boolean) {
  g.clearRect(0, 0, W, H)

  // glass body
  g.beginPath()
  roundedRectPath(g, 4, 4, W - 8, H - 8, 22)
  const body = g.createLinearGradient(0, 0, W, H)
  body.addColorStop(0, 'rgba(20,32,72,0.80)')
  body.addColorStop(1, 'rgba(8,12,30,0.74)')
  g.fillStyle = body
  g.fill()
  g.lineWidth = 2.5
  g.strokeStyle = 'rgba(120,200,255,0.45)'
  g.stroke()

  // title bar
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    g.beginPath()
    g.arc(30 + i * 22, 32, 6.5, 0, Math.PI * 2)
    g.fillStyle = c
    g.fill()
  })
  g.font = '500 17px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  g.fillStyle = '#8fa1c9'
  g.textAlign = 'left'
  g.textBaseline = 'alphabetic'
  g.fillText(title, 108, 38)
  g.fillStyle = 'rgba(255,255,255,0.08)'
  g.fillRect(4, 54, W - 8, 1.5)

  // code
  g.font = MONO
  g.textBaseline = 'alphabetic'
  const lines = text.split('\n')
  let endX = 28
  let endY = 88
  lines.forEach((line, row) => {
    const y = 88 + row * 30
    let x = 28
    for (const m of line.matchAll(TOKEN)) {
      const tok = m[0]
      let color = COLORS.text
      if (m[1]) color = COLORS.comment
      else if (m[2]) color = COLORS.string
      else if (m[3]) color = COLORS.number
      else if (m[4]) color = COLORS.keyword
      else if (m[5]) color = COLORS.fn
      else if (!m[6] && /[{}()[\];,.<>=:/]/.test(tok)) color = COLORS.punct
      g.fillStyle = color
      g.fillText(tok, x, y)
      x += g.measureText(tok).width
    }
    endX = x
    endY = y
  })

  if (caret) {
    g.fillStyle = '#14C8F0'
    g.fillRect(endX + 2, endY - 17, 10, 22)
  }
}

/* ───────────────────────── component ───────────────────────── */

interface CodePanelsProps {
  pointer: MutableRefObject<PointerState>
  reducedMotion: boolean
}

interface PanelRuntime {
  ctx: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  typed: number
  hold: number
  lastKey: number
}

export function CodePanels({ pointer, reducedMotion }: CodePanelsProps) {
  const groups = useRef<(THREE.Group | null)[]>([])
  const materials = useRef<(THREE.MeshBasicMaterial | null)[]>([])

  const runtimes = useMemo<PanelRuntime[]>(
    () =>
      PANELS.map((p) => {
        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 4
        // reduced motion: show the finished code right away, no typing
        paintPanel(ctx, p.title, reducedMotion ? p.code : '', false)
        return { ctx, texture, typed: reducedMotion ? p.code.length : 0, hold: 0, lastKey: -1 }
      }),
    [reducedMotion]
  )

  useEffect(() => {
    return () => runtimes.forEach((r) => r.texture.dispose())
  }, [runtimes])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const px = pointer.current.x
    const py = pointer.current.y

    PANELS.forEach((p, i) => {
      const group = groups.current[i]
      const mat = materials.current[i]
      const rt = runtimes[i]
      if (!group || !mat) return

      // fade in after the logo has assembled
      const fade = reducedMotion ? 1 : THREE.MathUtils.clamp((t - p.startAt + 0.4) / 1.0, 0, 1)
      mat.opacity = fade

      // drift + parallax: panels that are nearer move more with the cursor
      const nearness = THREE.MathUtils.clamp((p.position[2] + 2) / 3, 0, 1)
      const f = 0.12 + nearness * 0.2
      const drift = reducedMotion ? 0 : 1
      group.position.set(
        p.position[0] + px * f * 1.2 + Math.sin(t * 0.5 + i * 2.1) * 0.05 * drift,
        p.position[1] + py * f * 0.8 + Math.sin(t * 0.7 + i * 1.3) * 0.08 * drift,
        p.position[2]
      )
      group.rotation.set(
        p.rotation[0] + py * 0.05,
        p.rotation[1] + px * 0.08,
        p.rotation[2]
      )

      if (reducedMotion) return

      // typing animation: type, hold, erase, repeat
      const total = p.code.length
      if (t >= p.startAt) {
        if (rt.typed < total) {
          rt.typed = Math.min(total, rt.typed + delta * p.charsPerSecond)
          if (rt.typed >= total) rt.hold = 2.6
        } else {
          rt.hold -= delta
          if (rt.hold <= 0) rt.typed = 0
        }
      }

      const chars = Math.floor(rt.typed)
      const blink = Math.floor(t * 2) % 2
      const key = chars * 2 + blink
      if (key !== rt.lastKey) {
        rt.lastKey = key
        paintPanel(rt.ctx, p.title, p.code.slice(0, chars), blink === 0)
        rt.texture.needsUpdate = true
      }
    })
  })

  return (
    <group>
      {PANELS.map((p, i) => (
        <group
          key={p.title}
          ref={(el) => {
            groups.current[i] = el
          }}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
        >
          <mesh>
            <planeGeometry args={[1.7, (1.7 * H) / W]} />
            <meshBasicMaterial
              ref={(el) => {
                materials.current[i] = el
              }}
              map={runtimes[i].texture}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
