import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EmergentStrategicVector, CognitiveState } from '../types';
import { TrendingUp, BarChart3, Zap, Brain } from 'lucide-react';

interface RealTimeAnalyticsProps {
  data: any[];
  vectors: EmergentStrategicVector[];
  cognitiveState: CognitiveState;
}

export function RealTimeAnalytics({ data, vectors, cognitiveState }: RealTimeAnalyticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw confidence trend line
    if (vectors.length > 0) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#06b6d4');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();

      vectors.forEach((vector, index) => {
        const x = (index / (vectors.length - 1)) * canvas.width;
        const y = canvas.height - (vector.confidenceScore * canvas.height * 0.8) - 20;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw data points
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.stroke();
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [vectors]);

  const avgConfidence = vectors.length > 0 
    ? vectors.reduce((acc, v) => acc + v.confidenceScore, 0) / vectors.length 
    : 0;

  const highImpactVectors = vectors.filter(v => v.confidenceScore > 0.7).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">Real-Time Analytics</h3>
          <p className="text-gray-400 text-sm">AI-powered strategic intelligence</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {Math.round(avgConfidence * 100)}%
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">High Impact</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {highImpactVectors}
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Focus Level</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(cognitiveState.focusLevel * 100)}%
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Data Points</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {data.length}
          </div>
        </div>
      </div>

      {/* Confidence Trend Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Strategic Vector Confidence Trend</h4>
        <div className="relative bg-black/20 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-48"
            style={{ maxWidth: '100%' }}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-400">
            Live AI Analysis
          </div>
        </div>
      </div>

      {/* Cognitive State Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Focus</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${cognitiveState.focusLevel * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Creativity</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${cognitiveState.creativityLevel * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Clarity</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${cognitiveState.clarityLevel * 100}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}