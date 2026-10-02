'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Icosahedron, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

type ServiceType = 'globe' | 'phone' | 'brain' | 'layers' | 'cloud' | 'chat';

interface ServiceObjectProps {
  type: ServiceType;
  position?: [number, number, number];
  hovered?: boolean;
}

export function ServiceObject({ type, position = [0, 0, 0], hovered = false }: ServiceObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const targetColor = new THREE.Color(hovered ? '#7B3FF2' : '#2F5BEA');
  const targetEmissive = new THREE.Color(hovered ? '#7B3FF2' : '#000000');
  const scale = hovered ? 1.1 : 1.0;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.x += delta * 0.2;
      
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 5);
    }
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, delta * 5);
      materialRef.current.emissive.lerp(targetEmissive, delta * 5);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity, 
        hovered ? 0.5 : 0, 
        delta * 5
      );
    }
  });

  const material = (
    <meshStandardMaterial 
      ref={materialRef}
      color="#2F5BEA" 
      roughness={0.2} 
      metalness={0.8}
    />
  );

  const renderGeometry = () => {
    switch (type) {
      case 'globe':
        return (
          <group>
            <Sphere args={[0.8, 16, 16]}>{material}</Sphere>
            <Torus args={[1.2, 0.05, 16, 32]} rotation={[Math.PI/2, 0, 0]}>{material}</Torus>
            <Torus args={[1.2, 0.05, 16, 32]} rotation={[0, Math.PI/2, 0]}>{material}</Torus>
          </group>
        );
      case 'phone':
        return <Box args={[1, 2, 0.2]}>{material}</Box>;
      case 'brain':
        return <Icosahedron args={[1, 1]}>{material}</Icosahedron>;
      case 'layers':
        return (
          <group>
            <Box args={[1.5, 0.2, 1.5]} position={[0, -0.4, 0]}>{material}</Box>
            <Box args={[1.5, 0.2, 1.5]} position={[0, 0, 0]}>{material}</Box>
            <Box args={[1.5, 0.2, 1.5]} position={[0, 0.4, 0]}>{material}</Box>
          </group>
        );
      case 'cloud':
        return (
          <group>
            <Sphere args={[0.5, 16, 16]} position={[-0.4, -0.2, 0]}>{material}</Sphere>
            <Sphere args={[0.7, 16, 16]} position={[0, 0.2, 0]}>{material}</Sphere>
            <Sphere args={[0.6, 16, 16]} position={[0.5, -0.1, 0]}>{material}</Sphere>
          </group>
        );
      case 'chat':
        return (
          <group>
            <Box args={[1.5, 1, 0.3]}>{material}</Box>
            <Cylinder args={[0.1, 0, 0.4, 4]} rotation={[0, 0, -Math.PI/4]} position={[-0.5, -0.5, 0]}>
              {material}
            </Cylinder>
          </group>
        );
      default:
        return <Sphere>{material}</Sphere>;
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {renderGeometry()}
    </group>
  );
}
