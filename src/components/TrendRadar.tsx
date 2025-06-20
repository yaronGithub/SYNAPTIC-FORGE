import React from 'react';
import { motion } from 'framer-motion';
import { GlobalTrend } from '../types';
import { TrendingUp, Zap, Globe, Clock } from 'lucide-react';

interface TrendRadarProps {
  trends: GlobalTrend[];
  selectedTrend?: GlobalTrend;
  onTrendSelect: (trend: GlobalTrend) => void;
  className?: string;
}

export function TrendRadar({ trends, selectedTrend, onTrendSelect, className = '' }: TrendRadarProps) {
  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 4) return 'from-red-500 to-orange-500';
    if (urgency >= 3) return 'from-yellow-500 to-amber-500';
    return 'from-blue-500 to-cyan-500';
  };

  const getUrgencyIcon = (urgency: number) => {
    if (urgency >= 4) return <Zap className="w-4 h-4" />;
    if (urgency >= 3) return <TrendingUp className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology': return '🤖';
      case 'economy': return '💼';
      case 'society': return '👥';
      case 'environment': return '🌱';
      case 'policy': return '📋';
      default: return '🌐';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-orbitron">Global Trend Radar</h3>
          <p className="text-gray-400 text-sm">Real-time analysis of future-shaping trends</p>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {trends.slice(0, 8).map((trend, index) => (
          <motion.button
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onTrendSelect(trend)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 border backdrop-blur-sm ${
              selectedTrend?.id === trend.id
                ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500/50 shadow-lg'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(trend.category)}</span>
                <h4 className="font-semibold text-white text-sm">{trend.title}</h4>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getUrgencyColor(trend.urgencyScore)} text-white`}>
                  {getUrgencyIcon(trend.urgencyScore)}
                  {trend.urgencyScore}/5
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-xs mb-3 line-clamp-2">{trend.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {trend.impactedSkillDomains.slice(0, 3).map((domain, domainIndex) => (
                <span
                  key={domainIndex}
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                >
                  {domain}
                </span>
              ))}
              {trend.impactedSkillDomains.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                  +{trend.impactedSkillDomains.length - 3}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {trends.length === 0 && (
        <div className="text-center py-8">
          <Globe className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-gray-400">Loading global trends...</p>
        </div>
      )}
    </motion.div>
  );
}