'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Box, Sphere, Cylinder, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ScrollJourneyProps {
  progress: number;
}

export function ScrollJourney({ progress }: ScrollJourneyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ideaRef = useRef<THREE.Group>(null);
  const designRef = useRef<THREE.Group>(null);
  const buildRef = useRef<THREE.Group>(null);
  const deployRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y += delta * 0.5;

    if (ideaRef.current) {
      const p = Math.max(0, 1 - (progress / 0.25));
      ideaRef.current.scale.setScalar(p);
      ideaRef.current.visible = p > 0.01;
    }

    if (designRef.current) {
      const p = progress >= 0.25 && progress < 0.5 
        ? Math.sin(((progress - 0.25) / 0.25) * Math.PI)
        : 0;
      designRef.current.scale.setScalar(p);
      designRef.current.visible = p > 0.01;
    }

    if (buildRef.current) {
      const p = progress >= 0.5 && progress < 0.75
        ? Math.sin(((progress - 0.5) / 0.25) * Math.PI)
        : 0;
      buildRef.current.scale.setScalar(p);
      buildRef.current.visible = p > 0.01;
    }

    if (deployRef.current) {
      const p = progress >= 0.75
        ? (progress - 0.75) / 0.25
        : 0;
      deployRef.current.scale.setScalar(p);
      deployRef.current.position.y = p * 5 - 2;
      deployRef.current.visible = p > 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, -2]}>
      {/* Idea */}
      <group ref={ideaRef}>
        <Icosahedron args={[1, 1]}>
          <meshBasicMaterial color="#14C8F0" wireframe />
        </Icosahedron>
      </group>

      {/* Design */}
      <group ref={designRef} visible={false}>
        <Box args={[1.5, 1, 0.1]} position={[-0.2, 0.2, 0]}>
          <meshStandardMaterial color="#2F5BEA" />
        </Box>
        <Box args={[1, 0.8, 0.1]} position={[0.5, -0.3, 0.5]}>
          <meshStandardMaterial color="#7B3FF2" />
        </Box>
      </group>

      {/* Build */}
      <group ref={buildRef} visible={false}>
        <Sphere args={[0.3]} position={[-1, -1, 0]}>
          <meshStandardMaterial color="#7B3FF2" />
        </Sphere>
        <Sphere args={[0.3]} position={[1, 1, 0]}>
          <meshStandardMaterial color="#7B3FF2" />
        </Sphere>
        <Sphere args={[0.3]} position={[-0.5, 1, 1]}>
          <meshStandardMaterial color="#7B3FF2" />
        </Sphere>
        <Line 
          points={[[-1, -1, 0], [1, 1, 0], [-0.5, 1, 1], [-1, -1, 0]]} 
          color="#14C8F0" 
          lineWidth={2} 
        />
      </group>

      {/* Deploy */}
      <group ref={deployRef} visible={false}>
        <Cylinder args={[0, 0.5, 1.5, 8]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#2F5BEA" />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 1, 8]} position={[0, -0.25, 0]}>
          <meshStandardMaterial color="#2F5BEA" />
        </Cylinder>
        <Sphere args={[0.2, 8, 8]} position={[0, -1, 0]}>
          <meshBasicMaterial color="#14C8F0" />
        </Sphere>
      </group>
    </group>
  );
}
