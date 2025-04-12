import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  char: string;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef<MousePosition | null>(null);
  const [currentText, setCurrentText] = useState('Gemcook.inc');
  const fontSize = window.innerWidth < 768 ? 60 : 120;
  const particleSize = window.innerWidth < 768 ? 1.5 : 2;
  const effectRadius = window.innerWidth < 768 ? 30 : 50;

  useEffect(() => {
    const handleScroll = () => {
      const newsSection = document.getElementById('news');
      if (!newsSection) return;

      const rect = newsSection.getBoundingClientRect();
      const isInNewsSection = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
      
      setCurrentText(isInNewsSection ? 'Thank you!' : 'Gemcook.inc');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const newFontSize = window.innerWidth < 768 ? 60 : 120;
      ctx.font = `600 ${newFontSize}px Montserrat, sans-serif`;
      const textMetrics = ctx.measureText(currentText);
      canvas.width = textMetrics.width + (window.innerWidth < 768 ? 75 : 150);
      canvas.height = newFontSize * 2;
      calculateParticles();
    };

    const calculateParticles = () => {
      particles.current = [];
      const currentFontSize = window.innerWidth < 768 ? 60 : 120;
      ctx.font = `600 ${currentFontSize}px Montserrat, sans-serif`;
      ctx.fillStyle = 'rgb(250, 102, 129)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(currentText, canvas.width / 2, canvas.height / 2);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentParticleSize = window.innerWidth < 768 ? 1.5 : 2;
      for (let y = 0; y < canvas.height; y += currentParticleSize * 2) {
        for (let x = 0; x < canvas.width; x += currentParticleSize * 2) {
          const index = (y * canvas.width + x) * 4;
          const alpha = imageData.data[index + 3];
          
          if (alpha > 128) {
            particles.current.push({
              x: x + Math.random() * 20 - 10,
              y: y + Math.random() * 20 - 10,
              char: currentText[Math.floor(Math.random() * currentText.length)],
              originX: x,
              originY: y,
              vx: 0,
              vy: 0
            });
          }
        }
      }
    };

    const getDistanceFromMouse = (particle: Particle): number => {
      if (!mousePos.current) return Infinity;
      
      const dx = particle.x - mousePos.current.x;
      const dy = particle.y - mousePos.current.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(250, 102, 129)';
      
      particles.current.forEach((particle) => {
        const distanceFromMouse = getDistanceFromMouse(particle);
        const currentEffectRadius = window.innerWidth < 768 ? 30 : 50;
        const isAffectedByMouse = distanceFromMouse < currentEffectRadius;

        if (mousePos.current && isAffectedByMouse) {
          const angle = Math.atan2(
            particle.y - mousePos.current.y,
            particle.x - mousePos.current.x
          );
          
          const force = (currentEffectRadius - distanceFromMouse) / currentEffectRadius;
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
          
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (
            particle.x < 0 || 
            particle.x > canvas.width || 
            particle.y < 0 || 
            particle.y > canvas.height
          ) {
            particle.x = particle.originX;
            particle.y = particle.originY;
            particle.vx = 0;
            particle.vy = 0;
          }
        } else {
          const dx = particle.originX - particle.x;
          const dy = particle.originY - particle.y;
          
          particle.x += dx * 0.05;
          particle.y += dy * 0.05;
          particle.vx *= 0.95;
          particle.vy *= 0.95;
        }
        
        const currentParticleSize = window.innerWidth < 768 ? 1.5 : 2;
        ctx.fillRect(particle.x, particle.y, currentParticleSize, currentParticleSize);
      });
      
      requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mousePos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      mousePos.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentText]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="mx-auto cursor-pointer touch-none"
    />
  );
}