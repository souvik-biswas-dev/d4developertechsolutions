'use client'

import { useState, useEffect } from 'react'

interface PerformanceProfile {
  isLowEnd: boolean
  isMobile: boolean
  dpr: number
  particleCount: number
  enablePostprocessing: boolean
  enableComplexShaders: boolean
}

export function usePerformance(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    isLowEnd: false,
    isMobile: false,
    dpr: 1,
    particleCount: 2000,
    enablePostprocessing: true,
    enableComplexShaders: true,
  })

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
      navigator.userAgent
    )
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8
    const cores = navigator.hardwareConcurrency ?? 4
    const isLowEnd = memory <= 4 || cores <= 2 || isMobile
    const dpr = Math.min(window.devicePixelRatio, 2)

    setProfile({
      isLowEnd,
      isMobile,
      dpr,
      particleCount: isLowEnd ? 500 : isMobile ? 1000 : 2000,
      enablePostprocessing: !isLowEnd,
      enableComplexShaders: !isLowEnd,
    })
  }, [])

  return profile
}
