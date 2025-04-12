import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  useFrame(({ clock }) => {
    if (!earthRef.current || !groupRef.current) return;

    // 基本の回転
    earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;

    // スクロール位置を取得（0から1の範囲）
    const scrollProgress = window.scrollY / (window.innerHeight * 0.8);
    
    // WORKSセクションに近づくにつれて変化
    if (scrollProgress > 0.8 && scrollProgress < 2) {
      const morphProgress = (scrollProgress - 0.8) / 1.2;
      
      // 地球を右側に移動
      groupRef.current.position.x = morphProgress * 4;
      
      // 地球を徐々に変形
      earthRef.current.scale.setScalar(1 + morphProgress * 0.2);
      earthRef.current.rotation.x = morphProgress * Math.PI * 0.1;
      
      // マテリアルの属性も変化
      const material = earthRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + morphProgress * 0.3;
      material.roughness = 0.3 - morphProgress * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Sphere ref={earthRef} args={[2.25, 64, 64]}>
        <meshStandardMaterial
          map={new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg')}
          normalMap={new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg')}
          metalness={0.1}
          roughness={0.3}
          emissive={new THREE.Color(0x223366)}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  );
}