import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SkillDomain, GlobalTrend } from '../types';

interface SkillGapAtlasProps {
  skills: SkillDomain[];
  selectedTrend?: GlobalTrend;
  onSkillSelect: (skill: SkillDomain) => void;
  className?: string;
}

export function SkillGapAtlas({ skills, selectedTrend, onSkillSelect, className = '' }: SkillGapAtlasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const skillNodes = [
    { id: 'ai-ml', name: 'AI/ML', x: 200, y: 150, relevance: 9, gap: 7, category: 'technology' },
    { id: 'data-science', name: 'Data Science', x: 350, y: 100, relevance: 8, gap: 6, category: 'technology' },
    { id: 'cybersecurity', name: 'Cybersecurity', x: 500, y: 180, relevance: 9, gap: 8, category: 'technology' },
    { id: 'cloud-computing', name: 'Cloud Computing', x: 300, y: 250, relevance: 8, gap: 5, category: 'technology' },
    { id: 'sustainability', name: 'Sustainability', x: 150, y: 300, relevance: 7, gap: 9, category: 'environment' },
    { id: 'project-management', name: 'Project Management', x: 450, y: 320, relevance: 6, gap: 4, category: 'business' },
    { id: 'digital-marketing', name: 'Digital Marketing', x: 600, y: 250, relevance: 7, gap: 5, category: 'business' },
    { id: 'ux-design', name: 'UX Design', x: 550, y: 100, relevance: 6, gap: 6, category: 'design' }
  ];

  const connections = [
    { from: 'ai-ml', to: 'data-science' },
    { from: 'data-science', to: 'cloud-computing' },
    { from: 'ai-ml', to: 'cybersecurity' },
    { from: 'cloud-computing', to: 'cybersecurity' },
    { from: 'project-management', to: 'cloud-computing' },
    { from: 'ux-design', to: 'digital-marketing' },
    { from: 'ai-ml', to: 'ux-design' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return '#6366f1';
      case 'business': return '#10b981';
      case 'design': return '#f59e0b';
      case 'environment': return '#06b6d4';
      default: return '#8b5cf6';
    }
  };

  const getNodeSize = (relevance: number, gap: number) => {
    return 20 + (relevance * 3) + (gap * 2);
  };

  const isHighlighted = (skillId: string) => {
    if (!selectedTrend) return false;
    return selectedTrend.impactedSkillDomains.some(domain => 
      skillId.toLowerCase().includes(domain.toLowerCase().replace(/\s+/g, '-'))
    );
  };

  const drawAtlas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    
    connections.forEach(connection => {
      const fromNode = skillNodes.find(n => n.id === connection.from);
      const toNode = skillNodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        const highlighted = isHighlighted(fromNode.id) || isHighlighted(toNode.id);
        
        ctx.strokeStyle = highlighted ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = highlighted ? 3 : 1;
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    skillNodes.forEach(node => {
      const size = getNodeSize(node.relevance, node.gap);
      const highlighted = isHighlighted(node.id);
      const color = getCategoryColor(node.category);
      
      // Node glow effect
      if (highlighted) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
      } else {
        ctx.shadowBlur = 0;
      }
      
      // Draw node
      ctx.fillStyle = highlighted ? color : `${color}80`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw inner circle for gap indicator
      ctx.fillStyle = highlighted ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, (size / 2) * (node.gap / 10), 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // Draw label
      ctx.fillStyle = highlighted ? '#ffffff' : '#d1d5db';
      ctx.font = highlighted ? 'bold 12px Inter' : '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + size / 2 + 20);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a node
    skillNodes.forEach(node => {
      const size = getNodeSize(node.relevance, node.gap);
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      
      if (distance <= size / 2) {
        // Convert to SkillDomain format for callback
        const skillDomain: SkillDomain = {
          id: node.id,
          name: node.name,
          category: node.category,
          futureRelevance: node.relevance,
          currentDemand: 8,
          connections: [],
          trendDrivers: []
        };
        onSkillSelect(skillDomain);
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 700;
    canvas.height = 400;

    const animate = () => {
      drawAtlas();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedTrend]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white font-orbitron mb-2">Skill-Gap Atlas</h3>
        <p className="text-gray-400 text-sm">
          Interactive visualization of skill domains. Node size = future relevance + skill gap.
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-auto cursor-pointer rounded-lg bg-black/20"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-gray-400">Technology</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-gray-400">Business</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-400">Design</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-gray-400">Environment</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}