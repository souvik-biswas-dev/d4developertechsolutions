'use client'

import { type MutableRefObject } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { HeroLogo3D } from './HeroLogo3D'
import { CircuitBackground } from './CircuitBackground'
import { TechOrbit } from './TechOrbit'
import { CodePanels } from './CodePanels'
import type { PointerState } from './usePointerRef'

export type SceneMode = 'full' | 'lite'

interface SceneProps {
  pointer: MutableRefObject<PointerState>
  mode: SceneMode
  reducedMotion: boolean
}

/**
 * Everything that lives inside the single hero <Canvas>.
 * "lite" (phones, touch devices, weak hardware): fewer particles, no postprocessing, no code panels.
 */
export function Scene({ pointer, mode, reducedMotion }: SceneProps) {
  const lite = mode === 'lite'
  const viewportWidth = useThree((s) => s.viewport.width)
  // shrink the whole composition on narrow containers so nothing is cropped
  const fit = THREE.MathUtils.clamp(viewportWidth / 6.6, 0.5, 1)

  return (
    <>
      <color attach="background" args={['#050816']} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color="#cfe3ff" />
      <pointLight position={[-4, -2, 3]} intensity={16} color="#7B3FF2" distance={14} decay={2} />

      {/* Procedural studio lighting for the glossy logo: no HDR download, works offline */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#9fd8ff" position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#7B3FF2" position={[-5, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={2.0} color="#14C8F0" position={[5, -1, 2]} scale={[2, 5, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 0, -5]} scale={4} />
      </Environment>

      <CircuitBackground pointer={pointer} />

      <group scale={fit}>
        <HeroLogo3D
          pointer={pointer}
          particleCount={lite ? 2200 : 7000}
          lite={lite}
          reducedMotion={reducedMotion}
        />
        <TechOrbit lite={lite} reducedMotion={reducedMotion} />
        {!lite && <CodePanels pointer={pointer} reducedMotion={reducedMotion} />}
      </group>

      {!lite && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={1.1} luminanceThreshold={0.8} luminanceSmoothing={0.2} mipmapBlur radius={0.75} />
        </EffectComposer>
      )}
    </>
  )
}
