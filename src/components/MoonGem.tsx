import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MoonGemProps {
  isHovered?: boolean;
}

export function MoonGem({ isHovered = false }: MoonGemProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const moonTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

  useFrame(({ clock }) => {
    if (!moonRef.current || !glowRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // 基本の回転
    moonRef.current.rotation.y = t * 0.1;
    
    // ホバー時のエフェクト
    if (isHovered) {
      // 月の振動効果
      moonRef.current.position.y = Math.sin(t * 8) * 0.05;
      
      // 発光強度の変化
      const material = moonRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(t * 6) * 0.2;
      
      // グローエフェクトの強度変化
      glowRef.current.intensity = 2 + Math.sin(t * 4) * 0.5;
    } else {
      // 通常状態に戻す
      moonRef.current.position.y = 0;
      const material = moonRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2;
      glowRef.current.intensity = 1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={moonRef} scale={[2, 2, 2]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          color="#FFD700"
          metalness={0.2}
          roughness={0.8}
          emissive="#FF8C00"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Main glow */}
      <pointLight
        ref={glowRef}
        position={[2, 2, 4]}
        color="#FFD700"
        intensity={1}
        distance={10}
      />
      
      {/* Ambient glow */}
      <pointLight
        position={[-2, -2, 4]}
        color="#FFA500"
        intensity={0.8}
        distance={8}
      />
      
      {/* Rim light */}
      <pointLight
        position={[4, 0, -2]}
        color="#FFE4B5"
        intensity={0.5}
        distance={6}
      />
    </group>
  );
}