import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BlueGem() {
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!gemRef.current) return;
    
    const t = clock.getElapsedTime();
    gemRef.current.rotation.y = t * 0.3;
    gemRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
  });

  return (
    <group position={[0, -1, 0]}>
      <mesh ref={gemRef} scale={[2, 2, 2]}>
        <octahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#0066CC"
          metalness={0.9}
          roughness={0.05}
          transmission={0.4}
          thickness={0.6}
          emissive="#000066"
          emissiveIntensity={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={2.5}
          reflectivity={1}
          transparent
          opacity={0.9}
          envMapIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0, 2]}
        color="#4169E1"
        intensity={2.5}
        distance={6}
      />
      <pointLight
        position={[2, 2, 0]}
        color="#1E90FF"
        intensity={2}
        distance={4}
      />
    </group>
  );
}