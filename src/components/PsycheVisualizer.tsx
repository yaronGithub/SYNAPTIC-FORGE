import React, { useEffect, useRef } from 'react';
import { BlendedResonanceProfile } from '../types';

interface PsycheVisualizerProps {
  resonanceProfile: BlendedResonanceProfile | null;
  className?: string;
}

export function PsycheVisualizer({ resonanceProfile, className = '' }: PsycheVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    hue: number;
    life: number;
    maxLife: number;
    energy: number;
  }

  const getEmotionalColors = (weights: any) => {
    const colors = [];
    if (weights.joy > 0.5) colors.push({ hue: 60, weight: weights.joy }); // Yellow
    if (weights.serenity > 0.3) colors.push({ hue: 180, weight: weights.serenity }); // Cyan
    if (weights.fear > 0.4) colors.push({ hue: 0, weight: weights.fear }); // Red
    if (weights.curiosity > 0.5) colors.push({ hue: 240, weight: weights.curiosity }); // Blue
    if (weights.hope > 0.4) colors.push({ hue: 120, weight: weights.hope }); // Green
    if (weights.excitement > 0.4) colors.push({ hue: 300, weight: weights.excitement }); // Magenta
    
    return colors.length > 0 ? colors : [{ hue: 180, weight: 0.5 }];
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const colors = resonanceProfile ? getEmotionalColors(resonanceProfile.emotionalWeights) : [{ hue: 180, weight: 0.5 }];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const intensity = resonanceProfile?.intensity || 5;
    
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * intensity * 0.5,
      vy: (Math.random() - 0.5) * intensity * 0.5,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: color.hue + (Math.random() - 0.5) * 60,
      life: 0,
      maxLife: Math.random() * 400 + 200,
      energy: color.weight
    };
  };

  const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
    const intensity = resonanceProfile?.intensity || 5;
    
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Consciousness flow effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distanceToCenter = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2);
    const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
    const flowStrength = (1 - distanceToCenter / maxDistance) * intensity * 0.02;
    
    // Add consciousness flow towards center
    const angleToCenter = Math.atan2(centerY - particle.y, centerX - particle.x);
    particle.vx += Math.cos(angleToCenter) * flowStrength;
    particle.vy += Math.sin(angleToCenter) * flowStrength;

    // Add neural network-like connections
    const time = timeRef.current * 0.001;
    const waveX = Math.sin(time + particle.y * 0.01) * intensity * 0.1;
    const waveY = Math.cos(time + particle.x * 0.01) * intensity * 0.1;
    particle.vx += waveX;
    particle.vy += waveY;

    // Fade out over time
    particle.opacity = Math.max(0, (1 - particle.life / particle.maxLife) * particle.energy);

    // Damping
    particle.vx *= 0.995;
    particle.vy *= 0.995;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    
    // Create consciousness glow effect
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 3
    );
    gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, 1)`);
    gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, 0.5)`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 30%, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawConsciousnessField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!resonanceProfile) return;
    
    const time = timeRef.current * 0.001;
    const intensity = resonanceProfile.intensity;
    const colors = getEmotionalColors(resonanceProfile.emotionalWeights);
    
    // Create flowing consciousness field
    const gradient = ctx.createRadialGradient(
      canvas.width / 2 + Math.sin(time * 0.5) * 100,
      canvas.height / 2 + Math.cos(time * 0.3) * 100,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) * 0.8
    );
    
    colors.forEach((color, index) => {
      const stop = index / colors.length;
      gradient.addColorStop(stop, `hsla(${color.hue}, 40%, 20%, ${0.05 + intensity * 0.02})`);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawNeuralConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    if (!resonanceProfile) return;
    
    const maxDistance = 120;
    const intensity = resonanceProfile.intensity;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2 * intensity * 0.1;
          const avgHue = (particles[i].hue + particles[j].hue) / 2;
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = `hsl(${avgHue}, 60%, 60%)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16;

    // Clear canvas with consciousness fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw consciousness field
    drawConsciousnessField(ctx, canvas);

    // Manage particle count based on intensity
    const targetParticleCount = resonanceProfile ? 
      Math.floor(100 + resonanceProfile.intensity * 50) : 50;
    
    // Add particles if needed
    while (particlesRef.current.length < targetParticleCount) {
      particlesRef.current.push(createParticle(canvas));
    }

    // Remove excess particles
    if (particlesRef.current.length > targetParticleCount) {
      particlesRef.current = particlesRef.current.slice(0, targetParticleCount);
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle, canvas);
      
      if (particle.life >= particle.maxLife) {
        return false;
      }
      
      drawParticle(ctx, particle);
      return true;
    });

    // Draw neural connections
    if (resonanceProfile && resonanceProfile.intensity > 3) {
      drawNeuralConnections(ctx, particlesRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resonanceProfile]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}