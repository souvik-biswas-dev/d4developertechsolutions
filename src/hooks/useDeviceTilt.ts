'use client'

import { useState, useEffect } from 'react'

interface DeviceTilt {
  beta: number
  gamma: number
}

export function useDeviceTilt(): DeviceTilt {
  const [tilt, setTilt] = useState<DeviceTilt>({ beta: 0, gamma: 0 })

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setTilt({
        beta: (e.beta ?? 0) / 180,
        gamma: (e.gamma ?? 0) / 90,
      })
    }

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return tilt
}
