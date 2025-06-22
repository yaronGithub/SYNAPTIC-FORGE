import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Database, Zap, AlertCircle, CheckCircle, Activity } from 'lucide-react';

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  components: {
    newsAPI: {
      status: 'online' | 'degraded' | 'offline';
      latency: number;
      lastCheck: string;
    };
    openAI: {
      status: 'online' | 'degraded' | 'offline';
      responseTime: number;
      lastCheck: string;
    };
    dataQuality: {
      status: 'excellent' | 'good' | 'poor';
      score: number;
      anomaliesDetected: number;
    };
    aiPersonality: {
      evolutionStage: number;
      learningRate: number;
      confidenceLevel: number;
    };
  };
  fallbacksActive: string[];
  selfCorrections: number;
}

interface SystemHealthMonitorProps {
  className?: string;
}

export function SystemHealthMonitor({ className = '' }: SystemHealthMonitorProps) {
  const [health, setHealth] = useState<SystemHealth>({
    overall: 'excellent',
    components: {
      newsAPI: {
        status: 'online',
        latency: 245,
        lastCheck: new Date().toISOString()
      },
      openAI: {
        status: 'online',
        responseTime: 1200,
        lastCheck: new Date().toISOString()
      },
      dataQuality: {
        status: 'excellent',
        score: 94,
        anomaliesDetected: 0
      },
      aiPersonality: {
        evolutionStage: 7.8,
        learningRate: 0.85,
        confidenceLevel: 0.92
      }
    },
    fallbacksActive: [],
    selfCorrections: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        performHealthCheck();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const performHealthCheck = () => {
    setHealth(prev => {
      const newHealth = { ...prev };
      
      // Simulate realistic health fluctuations
      const now = new Date().toISOString();
      
      // News API health
      if (Math.random() > 0.95) { // 5% chance of degradation
        newHealth.components.newsAPI.status = 'degraded';
        newHealth.components.newsAPI.latency = 800 + Math.random() * 500;
        newHealth.fallbacksActive = ['cached_data', 'diversified_sources'];
        newHealth.selfCorrections += 1;
      } else {
        newHealth.components.newsAPI.status = 'online';
        newHealth.components.newsAPI.latency = 200 + Math.random() * 100;
        newHealth.fallbacksActive = newHealth.fallbacksActive.filter(f => !f.includes('cached_data'));
      }
      newHealth.components.newsAPI.lastCheck = now;

      // OpenAI health
      if (Math.random() > 0.98) { // 2% chance of degradation
        newHealth.components.openAI.status = 'degraded';
        newHealth.components.openAI.responseTime = 3000 + Math.random() * 2000;
      } else {
        newHealth.components.openAI.status = 'online';
        newHealth.components.openAI.responseTime = 1000 + Math.random() * 500;
      }
      newHealth.components.openAI.lastCheck = now;

      // Data quality monitoring
      const qualityScore = 85 + Math.random() * 15;
      newHealth.components.dataQuality.score = Math.round(qualityScore);
      newHealth.components.dataQuality.status = qualityScore > 90 ? 'excellent' : qualityScore > 75 ? 'good' : 'poor';
      
      if (qualityScore < 80) {
        newHealth.components.dataQuality.anomaliesDetected += 1;
      }

      // AI personality evolution
      newHealth.components.aiPersonality.evolutionStage += (Math.random() - 0.5) * 0.1;
      newHealth.components.aiPersonality.learningRate = 0.8 + Math.random() * 0.2;
      newHealth.components.aiPersonality.confidenceLevel = 0.85 + Math.random() * 0.15;

      // Overall health calculation
      const componentStatuses = [
        newHealth.components.newsAPI.status,
        newHealth.components.openAI.status,
        newHealth.components.dataQuality.status
      ];

      if (componentStatuses.includes('offline')) {
        newHealth.overall = 'critical';
      } else if (componentStatuses.includes('degraded') || componentStatuses.includes('poor')) {
        newHealth.overall = 'warning';
      } else if (componentStatuses.every(s => s === 'online' || s === 'excellent')) {
        newHealth.overall = 'excellent';
      } else {
        newHealth.overall = 'good';
      }

      return newHealth;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'excellent':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'degraded':
      case 'good':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'offline':
      case 'poor':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'warning':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'critical':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'excellent':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
      case 'good':
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'offline':
      case 'poor':
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getStatusColor(health.overall).replace('text-', 'bg-').replace('/10', '/20')}`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-space-grotesk">System Health Monitor</h3>
            <p className={`text-sm font-medium capitalize ${getStatusColor(health.overall).split(' ')[0]}`}>
              {health.overall} - All systems operational
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            isMonitoring 
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-400/30' 
              : 'bg-gray-600/20 text-gray-300 border border-gray-400/30'
          }`}
        >
          {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
        </button>
      </div>

      {/* Component Status Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className={`p-3 rounded-lg border ${getStatusColor(health.components.newsAPI.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4" />
              <span className="font-medium text-sm">News API</span>
              {getStatusIcon(health.components.newsAPI.status)}
            </div>
            <div className="text-xs space-y-1">
              <div>Latency: {health.components.newsAPI.latency}ms</div>
              <div>Status: {health.components.newsAPI.status}</div>
            </div>
          </div>

          <div className={`p-3 rounded-lg border ${getStatusColor(health.components.openAI.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">OpenAI API</span>
              {getStatusIcon(health.components.openAI.status)}
            </div>
            <div className="text-xs space-y-1">
              <div>Response: {health.components.openAI.responseTime}ms</div>
              <div>Status: {health.components.openAI.status}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`p-3 rounded-lg border ${getStatusColor(health.components.dataQuality.status)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4" />
              <span className="font-medium text-sm">Data Quality</span>
              {getStatusIcon(health.components.dataQuality.status)}
            </div>
            <div className="text-xs space-y-1">
              <div>Score: {health.components.dataQuality.score}/100</div>
              <div>Anomalies: {health.components.dataQuality.anomaliesDetected}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-purple-400/30 bg-purple-400/10 text-purple-400">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" />
              <span className="font-medium text-sm">AI Personality</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <div>Evolution: {health.components.aiPersonality.evolutionStage.toFixed(1)}/10</div>
              <div>Learning: {Math.round(health.components.aiPersonality.learningRate * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallbacks & Self-Corrections */}
      {(health.fallbacksActive.length > 0 || health.selfCorrections > 0) && (
        <div className="p-3 bg-amber-600/20 rounded-lg border border-amber-400/30">
          <h4 className="text-amber-300 font-medium text-sm mb-2">System Adaptations Active</h4>
          {health.fallbacksActive.length > 0 && (
            <div className="text-xs text-amber-200 mb-1">
              Fallbacks: {health.fallbacksActive.join(', ')}
            </div>
          )}
          {health.selfCorrections > 0 && (
            <div className="text-xs text-amber-200">
              Self-corrections performed: {health.selfCorrections}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}