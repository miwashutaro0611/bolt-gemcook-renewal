import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoonGemProps {
  isHovered?: boolean;
}

export function MoonGem({ isHovered = false }: MoonGemProps) {
  const gemRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!gemRef.current || !glowRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // 基本の回転
    gemRef.current.rotation.y = t * 0.3;
    gemRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    
    // ホバー時のエフェクト
    if (isHovered) {
      // 宝石の振動効果
      gemRef.current.position.y = Math.sin(t * 8) * 0.05;
      
      // 発光強度の変化
      const material = gemRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(t * 6) * 0.2;
      
      // グローエフェクトの強度変化
      glowRef.current.intensity = 2.5 + Math.sin(t * 4) * 0.5;
    } else {
      // 通常状態に戻す
      gemRef.current.position.y = 0;
      const material = gemRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0.2;
      glowRef.current.intensity = 1.5;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <mesh ref={gemRef} scale={[2, 2, 2]}>
        <octahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#E6E6FA"
          metalness={0.9}
          roughness={0.05}
          transmission={0.6}
          thickness={0.5}
          emissive="#4B0082"
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
      
      {/* Main glow */}
      <pointLight
        ref={glowRef}
        position={[2, 2, 4]}
        color="#9370DB"
        intensity={1.5}
        distance={10}
      />
      
      {/* Ambient glow */}
      <pointLight
        position={[-2, -2, 4]}
        color="#8A2BE2"
        intensity={1}
        distance={8}
      />
      
      {/* Rim light */}
      <pointLight
        position={[4, 0, -2]}
        color="#9400D3"
        intensity={0.8}
        distance={6}
      />
    </group>
  );
}