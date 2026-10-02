'use client'

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'
import { Scene, type SceneMode } from './Scene'
import { usePointerRef } from './usePointerRef'

interface SceneConfig {
  mode: SceneMode
  reducedMotion: boolean
  webgl: boolean
}

function detectConfig(): SceneConfig {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const small = window.matchMedia('(max-width: 1023px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const weak = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let webgl = false
  try {
    const probe = document.createElement('canvas')
    const gl = (probe.getContext('webgl2') || probe.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null
    webgl = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webgl = false
  }

  return { mode: small || coarse || weak ? 'lite' : 'full', reducedMotion, webgl }
}

/** Static fallback so the right half is never empty (no WebGL, or the scene failed). */
function StaticLogo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Image
        src="/logo.svg"
        alt="D4Developer logo"
        width={270}
        height={262}
        suppressHydrationWarning
        className="w-3/5 max-w-[360px] h-auto animate-float drop-shadow-[0_0_40px_rgba(47,91,234,0.45)]"
      />
    </div>
  )
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <StaticLogo /> : this.props.children
  }
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pointer = usePointerRef(wrapRef)
  const [config, setConfig] = useState<SceneConfig | null>(null)
  const [visible, setVisible] = useState(true)

  // decide the quality level once, on the client
  useEffect(() => {
    setConfig(detectConfig())
  }, [])

  // stop rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      {config && !config.webgl && <StaticLogo />}
      {config && config.webgl && (
        <SceneBoundary>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={config.mode === 'full' ? [1, 2] : [1, 1.5]}
            flat
            gl={{ antialias: config.mode === 'lite', alpha: false, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 60 }}
          >
            <Suspense fallback={null}>
              <Scene pointer={pointer} mode={config.mode} reducedMotion={config.reducedMotion} />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  )
}
