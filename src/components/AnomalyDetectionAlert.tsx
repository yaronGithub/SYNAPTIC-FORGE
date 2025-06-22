import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Zap, X, Bell } from 'lucide-react';

interface Anomaly {
  id: string;
  type: 'surge' | 'drop' | 'pattern_break';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  affectedVector: string;
  confidence: number;
  metrics: {
    baseline: number;
    current: number;
    change: number;
  };
}

interface AnomalyDetectionAlertProps {
  isActive: boolean;
  onDismiss: (anomalyId: string) => void;
}

export function AnomalyDetectionAlert({ isActive, onDismiss }: AnomalyDetectionAlertProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Simulate anomaly detection
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of anomaly
          generateAnomaly();
        }
      }, 15000); // Check every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const generateAnomaly = () => {
    const anomalyTypes = [
      {
        type: 'surge' as const,
        title: 'AI Regulation Mentions Surge',
        description: 'Sudden 340% increase in AI regulation discussions across global news sources',
        affectedVector: 'Regulatory Harmonization Wave',
        baseline: 45,
        current: 198,
        change: 340
      },
      {
        type: 'drop' as const,
        title: 'Quantum Computing Investment Drop',
        description: 'Unexpected 60% decrease in quantum computing venture capital mentions',
        affectedVector: 'Quantum-AI Convergence Acceleration',
        baseline: 120,
        current: 48,
        change: -60
      },
      {
        type: 'pattern_break' as const,
        title: 'Supply Chain Pattern Anomaly',
        description: 'Unusual correlation break between supply chain and sustainability metrics',
        affectedVector: 'Autonomous Economic Networks',
        baseline: 85,
        current: 142,
        change: 67
      }
    ];

    const selectedAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const severity = Math.abs(selectedAnomaly.change) > 200 ? 'critical' : 
                    Math.abs(selectedAnomaly.change) > 100 ? 'high' : 
                    Math.abs(selectedAnomaly.change) > 50 ? 'medium' : 'low';

    const newAnomaly: Anomaly = {
      id: `anomaly-${Date.now()}`,
      type: selectedAnomaly.type,
      title: selectedAnomaly.title,
      description: selectedAnomaly.description,
      severity,
      detectedAt: new Date().toISOString(),
      affectedVector: selectedAnomaly.affectedVector,
      confidence: 0.85 + Math.random() * 0.1,
      metrics: {
        baseline: selectedAnomaly.baseline,
        current: selectedAnomaly.current,
        change: selectedAnomaly.change
      }
    };

    setAnomalies(prev => [newAnomaly, ...prev.slice(0, 4)]); // Keep only 5 most recent
    setShowAlert(true);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 10000);
  };

  const getSeverityColor = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-orange-600';
      case 'high': return 'from-orange-600 to-yellow-600';
      case 'medium': return 'from-yellow-600 to-amber-600';
      case 'low': return 'from-blue-600 to-cyan-600';
    }
  };

  const getSeverityIcon = (type: Anomaly['type']) => {
    switch (type) {
      case 'surge': return <TrendingUp className="w-4 h-4" />;
      case 'drop': return <TrendingUp className="w-4 h-4 rotate-180" />;
      case 'pattern_break': return <Zap className="w-4 h-4" />;
    }
  };

  const handleDismiss = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    onDismiss(anomalyId);
    if (anomalies.length <= 1) {
      setShowAlert(false);
    }
  };

  return (
    <>
      {/* Floating Alert Indicator */}
      <AnimatePresence>
        {showAlert && anomalies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="fixed top-24 right-6 z-40 max-w-sm"
          >
            <div className={`bg-gradient-to-r ${getSeverityColor(anomalies[0].severity)} p-1 rounded-xl`}>
              <div className="bg-black/90 backdrop-blur-xl rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Anomaly Detected</h4>
                      <p className="text-gray-300 text-xs">{anomalies[0].severity.toUpperCase()} PRIORITY</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismiss(anomalies[0].id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <h5 className="text-white font-medium text-sm mb-1">{anomalies[0].title}</h5>
                  <p className="text-gray-300 text-xs">{anomalies[0].description}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(anomalies[0].type)}
                    <span className="text-gray-300">
                      {anomalies[0].metrics.change > 0 ? '+' : ''}{anomalies[0].metrics.change}%
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {Math.round(anomalies[0].confidence * 100)}% confidence
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400">
                    Affected Vector: {anomalies[0].affectedVector}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anomaly History Panel */}
      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-space-grotesk">Anomaly Detection Engine</h3>
              <p className="text-red-300 text-sm">{anomalies.length} recent anomalies detected</p>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {anomalies.map((anomaly, index) => (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border bg-gradient-to-r ${getSeverityColor(anomaly.severity)}/10 border-white/10`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(anomaly.type)}
                    <h4 className="text-white font-medium text-sm">{anomaly.title}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    anomaly.severity === 'critical' ? 'bg-red-600/20 text-red-300' :
                    anomaly.severity === 'high' ? 'bg-orange-600/20 text-orange-300' :
                    anomaly.severity === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                    'bg-blue-600/20 text-blue-300'
                  }`}>
                    {anomaly.severity}
                  </span>
                </div>

                <p className="text-gray-300 text-xs mb-2">{anomaly.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-400">
                    {new Date(anomaly.detectedAt).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">
                      Change: {anomaly.metrics.change > 0 ? '+' : ''}{anomaly.metrics.change}%
                    </span>
                    <span className="text-gray-400">
                      Confidence: {Math.round(anomaly.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}