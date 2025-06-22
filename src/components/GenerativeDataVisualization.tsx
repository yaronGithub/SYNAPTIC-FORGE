import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface GenerativeDataVisualizationProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie' | 'scatter';
  title: string;
  insight: string;
  className?: string;
}

export function GenerativeDataVisualization({ 
  data, 
  type, 
  title, 
  insight, 
  className = '' 
}: GenerativeDataVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data.length > 0) {
      generateVisualization();
    }
  }, [data, type]);

  const generateVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (type) {
      case 'bar':
        drawBarChart(ctx, canvas, data);
        break;
      case 'line':
        drawLineChart(ctx, canvas, data);
        break;
      case 'pie':
        drawPieChart(ctx, canvas, data);
        break;
      case 'scatter':
        drawScatterPlot(ctx, canvas, data);
        break;
    }
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = canvas.width / data.length * 0.8;
    const barSpacing = canvas.width / data.length * 0.2;

    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * (canvas.height - 40);
      const x = index * (barWidth + barSpacing) + barSpacing / 2;
      const y = canvas.height - barHeight - 20;

      // Draw bar
      ctx.fillStyle = point.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x + barWidth / 2, canvas.height - 5);

      // Draw value
      ctx.fillText(point.value.toString(), x + barWidth / 2, y - 5);
    });
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const y = canvas.height - 20 - ((point.value - minValue) / range) * (canvas.height - 40);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.stroke();
  };

  const drawPieChart = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const total = data.reduce((sum, point) => sum + point.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((point) => {
      const sliceAngle = (point.value / total) * 2 * Math.PI;

      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round((point.value / total) * 100)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  };

  const drawScatterPlot = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: DataPoint[]) => {
    const maxValue = Math.max(...data.map(d => d.value));

    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const y = canvas.height - 20 - (point.value / maxValue) * (canvas.height - 40);

      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = point.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  const getVisualizationIcon = () => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-4 h-4" />;
      case 'line': return <TrendingUp className="w-4 h-4" />;
      case 'pie': return <PieChart className="w-4 h-4" />;
      case 'scatter': return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white">
          {getVisualizationIcon()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">{title}</h3>
          <p className="text-cyan-300 text-sm">AI-Generated {type.charAt(0).toUpperCase() + type.slice(1)} Chart</p>
        </div>
      </div>

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-lg bg-black/20"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <div className="p-3 bg-cyan-600/20 rounded-lg border border-cyan-400/30">
        <p className="text-cyan-300 text-sm font-medium">
          💡 AI Insight: {insight}
        </p>
      </div>
    </motion.div>
  );
}