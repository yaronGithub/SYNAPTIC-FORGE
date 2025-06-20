import React, { useEffect, useRef } from 'react';
import { NexusState } from '../types';

interface NexusCanvasProps {
  nexusState: NexusState;
  className?: string;
}

export function NexusCanvas({ nexusState, className = '' }: NexusCanvasProps) {
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
  }

  const getSentimentColors = (sentiment: string) => {
    switch (sentiment) {
      case 'joy': return { primary: 60, secondary: 120 }; // Yellow to Green
      case 'excitement': return { primary: 300, secondary: 60 }; // Purple to Yellow
      case 'fear': return { primary: 0, secondary: 30 }; // Red to Orange
      case 'anger': return { primary: 0, secondary: 15 }; // Red
      case 'sadness': return { primary: 240, secondary: 200 }; // Blue to Cyan
      case 'neutral': return { primary: 180, secondary: 220 }; // Cyan to Blue
      default: return { primary: 180, secondary: 220 };
    }
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const colors = getSentimentColors(nexusState.dominantSentiment);
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2 * nexusState.intensity,
      vy: (Math.random() - 0.5) * 2 * nexusState.intensity,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: colors.primary + Math.random() * (colors.secondary - colors.primary),
      life: 0,
      maxLife: Math.random() * 300 + 200
    };
  };

  const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    // Fade out over time
    particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);

    // Add some turbulence based on nexus state
    const turbulence = nexusState.intensity * 0.1;
    particle.vx += (Math.random() - 0.5) * turbulence;
    particle.vy += (Math.random() - 0.5) * turbulence;

    // Damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    
    // Create gradient for particle
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 2
    );
    gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, 1)`);
    gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = 100;
    const colors = getSentimentColors(nexusState.dominantSentiment);
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3 * nexusState.intensity;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = `hsl(${colors.primary}, 50%, 50%)`;
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

  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const colors = getSentimentColors(nexusState.dominantSentiment);
    
    // Create animated background gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2 + Math.sin(timeRef.current * 0.001) * 100,
      canvas.height / 2 + Math.cos(timeRef.current * 0.001) * 100,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height)
    );
    
    const intensity = nexusState.intensity;
    gradient.addColorStop(0, `hsla(${colors.primary}, 30%, 5%, ${0.1 + intensity * 0.1})`);
    gradient.addColorStop(0.5, `hsla(${colors.secondary}, 25%, 8%, ${0.05 + intensity * 0.05})`);
    gradient.addColorStop(1, `hsla(${colors.primary + 60}, 20%, 3%, 0.02)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16; // ~60fps

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw animated background
    drawBackground(ctx, canvas);

    // Manage particle count based on nexus state
    const targetParticleCount = Math.floor(50 + nexusState.intensity * 100);
    
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
        return false; // Remove dead particles
      }
      
      drawParticle(ctx, particle);
      return true;
    });

    // Draw connections between nearby particles
    if (nexusState.intensity > 0.3) {
      drawConnections(ctx, particlesRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
  }, [nexusState]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}