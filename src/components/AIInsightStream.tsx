import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity } from 'lucide-react';

interface AIInsightStreamProps {
  insights: string[];
  maxVisible?: number;
}

export function AIInsightStream({ insights, maxVisible = 8 }: AIInsightStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new insights arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [insights]);

  const visibleInsights = insights.slice(-maxVisible);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-96"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">AI Thought Stream</h3>
          <p className="text-gray-400 text-sm">Real-time cognitive processing</p>
        </div>
        <div className="ml-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="space-y-3 overflow-y-auto h-72 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={`${insight}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex-shrink-0 mt-1">
                {insight.includes('🧠') && <Brain className="w-4 h-4 text-purple-400" />}
                {insight.includes('⚡') && <Zap className="w-4 h-4 text-yellow-400" />}
                {insight.includes('📡') && <Activity className="w-4 h-4 text-blue-400" />}
                {!insight.includes('🧠') && !insight.includes('⚡') && !insight.includes('📡') && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {insight}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
            <p className="text-gray-400">AI thought stream will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}