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

  useEffect(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Create quantum-like distribution
      const radius = Math.random() * 10 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Dynamic colors based on foresight construct
      if (foresightConstruct?.sensoryDirectives.colorGradients) {
        const colorIndex = Math.floor(Math.random() * foresightConstruct.sensoryDirectives.colorGradients.length);
        const color = new THREE.Color(foresightConstruct.sensoryDirectives.colorGradients[colorIndex]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      } else {
        colors[i * 3] = Math.random();
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 2] = 1;
      }
    }

    setPositions(positions);
    setColors(colors);
  }, [foresightConstruct]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const motionIntensity = foresightConstruct?.sensoryDirectives.motionIntensity || 5;
      
      meshRef.current.rotation.x = Math.sin(time * 0.1) * (motionIntensity / 10);
      meshRef.current.rotation.y = time * 0.05 * (motionIntensity / 10);
      
      if (isProcessing) {
        meshRef.current.rotation.z = time * 0.2;
      }

      // Pulsing effect based on cognitive state
      const scale = 1 + Math.sin(time * 2) * 0.1 * (motionIntensity / 10);
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!positions || !colors) return null;

  return (
    <Points ref={meshRef} positions={positions} colors={colors}>
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CognitiveOrb({ foresightConstruct, isProcessing }: { foresightConstruct: ForesightConstruct | null, isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.2;
      
      if (isProcessing) {
        const scale = 1 + Math.sin(time * 4) * 0.2;
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  const primaryColor = foresightConstruct?.sensoryDirectives.colorGradients?.[0] || '#00FF88';

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color={primaryColor}
        transparent
        opacity={0.3}
        wireframe
        emissive={primaryColor}
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

export function CognitiveCanvas({ foresightConstruct, isProcessing, className = '' }: CognitiveCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00FF88" />
        
        <QuantumNeuralWeb foresightConstruct={foresightConstruct} isProcessing={isProcessing} />
        <CognitiveOrb foresightConstruct={foresightConstruct} isProcessing={isProcessing} />
      </Canvas>
    </div>
  );
}