import React from 'react';
import { Brain, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIStatusIndicatorProps {
  isProcessing: boolean;
  hasApiKey: boolean;
  lastUpdate?: Date;
}

export function AIStatusIndicator({ isProcessing, hasApiKey, lastUpdate }: AIStatusIndicatorProps) {
  const getStatusColor = () => {
    if (isProcessing) return 'text-blue-500 bg-blue-50';
    if (hasApiKey) return 'text-green-500 bg-green-50';
    return 'text-orange-500 bg-orange-50';
  };

  const getStatusText = () => {
    if (isProcessing) return 'AI Processing...';
    if (hasApiKey) return 'AI Connected';
    return 'Demo Mode';
  };

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (hasApiKey) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor()}`}
    >
      <Brain className="w-4 h-4" />
      {getStatusIcon()}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{getStatusText()}</span>
        {lastUpdate && (
          <span className="text-xs opacity-75">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}