import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>(new Float32Array(2000 * 3));
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const initialPositionsRef = useRef<Float32Array | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('initial');
  const previousSectionRef = useRef<string>('initial');
  const lastScrollY = useRef<number>(0);

  const TOTAL_STARS = 2000;
  const TEXT_STARS = 500;
  
  const colors = [
    new THREE.Color('#ffffff').multiplyScalar(0.8),
    new THREE.Color('#fffacd').multiplyScalar(0.7),
    new THREE.Color('#87ceeb').multiplyScalar(0.7),
    new THREE.Color('#ffd700').multiplyScalar(0.6),
  ];

  const { positions, sizes, colorArray } = useMemo(() => {
    const positions = new Float32Array(TOTAL_STARS * 3);
    const sizes = new Float32Array(TOTAL_STARS);
    const colorArray = new Float32Array(TOTAL_STARS * 3);
    
    for (let i = 0; i < TOTAL_STARS; i++) {
      const radius = Math.random() * 100 - 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 1.2 + 0.3;

      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;

      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.01;
      velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    initialPositionsRef.current = positions.slice();
    return { positions, sizes, colorArray };
  }, []);

  const generateTextParticles = (text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Float32Array(TOTAL_STARS * 3);

    canvas.width = 512;
    canvas.height = 128;
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const textPositions = new Float32Array(TOTAL_STARS * 3);
    const textPoints: { x: number; y: number }[] = [];

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 128) {
          textPoints.push({
            x: (x - canvas.width / 2) * 0.015,
            y: -(y - canvas.height / 2) * 0.015
          });
        }
      }
    }

    for (let i = 0; i < TEXT_STARS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 50 + Math.random() * 20;
      
      if (i < textPoints.length) {
        const point = textPoints[Math.floor(Math.random() * textPoints.length)];
        textPositions[i * 3] = point.x;
        textPositions[i * 3 + 1] = point.y;
        textPositions[i * 3 + 2] = 0;
      } else {
        textPositions[i * 3] = Math.cos(angle) * radius;
        textPositions[i * 3 + 1] = Math.sin(angle) * radius;
        textPositions[i * 3 + 2] = Math.random() * 10 - 5;
      }
    }

    for (let i = TEXT_STARS; i < TOTAL_STARS; i++) {
      const idx = i * 3;
      textPositions[idx] = positions[idx];
      textPositions[idx + 1] = positions[idx + 1];
      textPositions[idx + 2] = positions[idx + 2];
    }

    return textPositions;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollY < windowHeight * 0.5) {
        if (currentSection !== 'initial') {
          setCurrentSection('initial');
        }
        return;
      }

      const sections = ['mission', 'works', 'team', 'news'].map(id => {
        const element = document.getElementById(id);
        return element ? {
          id,
          top: element.offsetTop,
          bottom: element.offsetTop + element.offsetHeight
        } : null;
      }).filter(Boolean);

      const currentSectionElement = sections.find(section => 
        scrollY >= section!.top - windowHeight * 0.5 &&
        scrollY < section!.bottom - windowHeight * 0.3
      );

      if (currentSectionElement) {
        const sectionId = currentSectionElement.id.toUpperCase();
        if (currentSection !== sectionId) {
          setCurrentSection(sectionId);
        }
      }

      lastScrollY.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  useFrame(({ clock }) => {
    if (!starsRef.current || !starsRef.current.geometry.attributes.position) return;

    const currentPositions = starsRef.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();

    if (currentSection !== previousSectionRef.current) {
      if (currentSection === 'initial') {
        targetPositionsRef.current = initialPositionsRef.current!.slice();
      } else {
        targetPositionsRef.current = generateTextParticles(currentSection);
      }
      previousSectionRef.current = currentSection;
    }

    for (let i = 0; i < TOTAL_STARS; i++) {
      const idx = i * 3;

      if (currentSection === 'initial' || i >= TEXT_STARS) {
        // 初期状態または非テキスト粒子は常に動く
        currentPositions[idx] += velocitiesRef.current[idx];
        currentPositions[idx + 1] += velocitiesRef.current[idx + 1];
        currentPositions[idx + 2] += velocitiesRef.current[idx + 2];

        // 境界チェックと反射
        if (Math.abs(currentPositions[idx]) > 50) {
          velocitiesRef.current[idx] *= -1;
          currentPositions[idx] = Math.sign(currentPositions[idx]) * 50;
        }
        if (Math.abs(currentPositions[idx + 1]) > 50) {
          velocitiesRef.current[idx + 1] *= -1;
          currentPositions[idx + 1] = Math.sign(currentPositions[idx + 1]) * 50;
        }
        if (Math.abs(currentPositions[idx + 2]) > 50) {
          velocitiesRef.current[idx + 2] *= -1;
          currentPositions[idx + 2] = Math.sign(currentPositions[idx + 2]) * 50;
        }
      } else if (targetPositionsRef.current) {
        // テキスト粒子の場合
        const targetX = targetPositionsRef.current[idx];
        const targetY = targetPositionsRef.current[idx + 1];
        const targetZ = targetPositionsRef.current[idx + 2];

        currentPositions[idx] += (targetX - currentPositions[idx]) * 0.1;
        currentPositions[idx + 1] += (targetY - currentPositions[idx + 1]) * 0.1;
        currentPositions[idx + 2] += (targetZ - currentPositions[idx + 2]) * 0.1;
      }

      if (starsRef.current.geometry.attributes.size) {
        const sizes = starsRef.current.geometry.attributes.size.array as Float32Array;
        const sizeVariation = 0.03;
        sizes[i] = Math.max(0.3, (Math.random() * 1.2 + 0.3) + Math.sin(time * 2 + i) * sizeVariation);
      }
    }

    starsRef.current.geometry.attributes.position.needsUpdate = true;
    if (starsRef.current.geometry.attributes.size) {
      starsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colorArray.length / 3}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        fog={false}
        map={texture}
        alphaMap={texture}
        alphaTest={0.001}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}