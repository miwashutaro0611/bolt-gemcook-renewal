import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function SunGem() {
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!gemRef.current) return;
    
    const t = clock.getElapsedTime();
    gemRef.current.rotation.y = t * 0.5;
    gemRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <group>
      <mesh ref={gemRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.7}
          roughness={0.1}
          transmission={0.2}
          thickness={0.5}
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={2.4}
          reflectivity={1}
          transparent
          opacity={0.9}
          envMapIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0, 2]}
        color="#FFA500"
        intensity={3}
        distance={6}
      />
      <pointLight
        position={[2, 2, 0]}
        color="#FFD700"
        intensity={2}
        distance={4}
      />
    </group>
  );
}