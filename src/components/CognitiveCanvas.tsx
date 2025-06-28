import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ForesightConstruct } from '../types';

interface CognitiveCanvasProps {
  foresightConstruct: ForesightConstruct | null;
  isProcessing: boolean;
  className?: string;
}

function QuantumNeuralWeb({ foresightConstruct, isProcessing }: { foresightConstruct: ForesightConstruct | null, isProcessing: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const [positions, setPositions] = useState<Float32Array>();
  const [colors, setColors] = useState<Float32Array>();
  const [sizes, setSizes] = useState<Float32Array>();

  useEffect(() => {
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create quantum-like distribution with multiple layers
      let radius, theta, phi;
      
      if (i < particleCount * 0.6) {
        // Inner neural network
        radius = Math.random() * 8 + 5;
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI;
      } else if (i < particleCount * 0.9) {
        // Middle orbital layer
        radius = Math.random() * 5 + 15;
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI;
      } else {
        // Outer cosmic layer
        radius = Math.random() * 10 + 25;
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI;
      }
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Particle size variation
      sizes[i] = Math.random() * 0.1 + 0.05;

      // Dynamic colors based on foresight construct
      if (foresightConstruct?.sensoryDirectives.colorGradients) {
        const colorIndex = Math.floor(Math.random() * foresightConstruct.sensoryDirectives.colorGradients.length);
        const color = new THREE.Color(foresightConstruct.sensoryDirectives.colorGradients[colorIndex]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      } else {
        // Default color scheme - emerald to cyan to purple
        const t = i / particleCount;
        if (t < 0.33) {
          const color = new THREE.Color('#10b981').lerp(new THREE.Color('#06b6d4'), t * 3);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        } else if (t < 0.66) {
          const color = new THREE.Color('#06b6d4').lerp(new THREE.Color('#8b5cf6'), (t - 0.33) * 3);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        } else {
          const color = new THREE.Color('#8b5cf6').lerp(new THREE.Color('#ec4899'), (t - 0.66) * 3);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }
      }
    }

    setPositions(positions);
    setColors(colors);
    setSizes(sizes);
  }, [foresightConstruct]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const motionIntensity = foresightConstruct?.sensoryDirectives.motionIntensity || 5;
      
      // Complex rotation patterns
      meshRef.current.rotation.x = Math.sin(time * 0.1) * (motionIntensity / 10);
      meshRef.current.rotation.y = time * 0.05 * (motionIntensity / 10);
      
      if (isProcessing) {
        meshRef.current.rotation.z = time * 0.2;
      }

      // Pulsing effect based on cognitive state
      const scale = 1 + Math.sin(time * 2) * 0.1 * (motionIntensity / 10);
      meshRef.current.scale.setScalar(scale);
      
      // Particle movement
      if (positions && meshRef.current.geometry.attributes.position) {
        const positionArray = meshRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positionArray.length; i += 3) {
          // Apply subtle wave motion
          const x = positionArray[i];
          const y = positionArray[i + 1];
          const z = positionArray[i + 2];
          
          const distance = Math.sqrt(x * x + y * y + z * z);
          const normX = x / distance;
          const normY = y / distance;
          const normZ = z / distance;
          
          // Wave effect
          const waveFactor = Math.sin(time + distance * 0.2) * 0.1 * motionIntensity / 10;
          
          positionArray[i] += normX * waveFactor;
          positionArray[i + 1] += normY * waveFactor;
          positionArray[i + 2] += normZ * waveFactor;
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  if (!positions || !colors || !sizes) return null;

  return (
    <Points ref={meshRef} positions={positions} sizes={sizes}>
      <PointMaterial
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CognitiveOrb({ foresightConstruct, isProcessing }: { foresightConstruct: ForesightConstruct | null, isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Complex rotation
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.1;
      
      if (isProcessing) {
        const scale = 1 + Math.sin(time * 4) * 0.2;
        meshRef.current.scale.setScalar(scale);
        if (glowRef.current) {
          glowRef.current.scale.setScalar(scale * 1.2);
        }
      }
    }
  });

  const primaryColor = foresightConstruct?.sensoryDirectives.colorGradients?.[0] || '#10b981';
  const secondaryColor = foresightConstruct?.sensoryDirectives.colorGradients?.[1] || '#06b6d4';

  return (
    <>
      {/* Glow Sphere */}
      <Sphere ref={glowRef} args={[3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Main Orb */}
      <Sphere ref={meshRef} args={[2.5, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.4}
          wireframe
          emissive={secondaryColor}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Inner Core */}
      <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.3}
        />
      </Sphere>
    </>
  );
}

function FloatingParticles({ foresightConstruct }: { foresightConstruct: ForesightConstruct | null }) {
  const particlesRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Rotate the entire particle system
      particlesRef.current.rotation.y = time * 0.05;
      
      // Update individual particles
      particlesRef.current.children.forEach((particle, i) => {
        const t = (time * 0.1 + i * 0.1) % 1;
        const radius = 20 + Math.sin(time * 0.2 + i) * 5;
        const angle = Math.PI * 2 * i / particlesRef.current!.children.length;
        
        particle.position.x = Math.cos(angle + time * 0.1) * radius;
        particle.position.z = Math.sin(angle + time * 0.1) * radius;
        particle.position.y = Math.sin(time * 0.2 + i * 0.5) * 10;
        
        // Pulse effect
        const scale = 0.5 + Math.sin(time * 2 + i) * 0.2;
        particle.scale.set(scale, scale, scale);
      });
    }
  });
  
  // Generate particles
  const particles = [];
  const count = 20;
  const colors = foresightConstruct?.sensoryDirectives.colorGradients || ['#10b981', '#06b6d4', '#8b5cf6'];
  
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    particles.push(
      <mesh key={i} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    );
  }
  
  return <group ref={particlesRef}>{particles}</group>;
}

export function CognitiveCanvas({ foresightConstruct, isProcessing, className = '' }: CognitiveCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ background: 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#06b6d4" />
        
        <QuantumNeuralWeb foresightConstruct={foresightConstruct} isProcessing={isProcessing} />
        <CognitiveOrb foresightConstruct={foresightConstruct} isProcessing={isProcessing} />
        <FloatingParticles foresightConstruct={foresightConstruct} />
        
        {/* Atmospheric Fog */}
        <fog attach="fog" args={['#000000', 20, 60]} />
      </Canvas>
    </div>
  );
}