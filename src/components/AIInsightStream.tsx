import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity, Cpu, Sparkles, Orbit } from 'lucide-react';

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

  // Get icon based on insight content
  const getInsightIcon = (insight: string) => {
    if (insight.includes('🧠') || insight.includes('neural') || insight.includes('thinking')) 
      return <Brain className="w-5 h-5 text-purple-400" />;
    if (insight.includes('⚡') || insight.includes('processing') || insight.includes('analyzing')) 
      return <Zap className="w-5 h-5 text-yellow-400" />;
    if (insight.includes('📡') || insight.includes('data') || insight.includes('stream')) 
      return <Activity className="w-5 h-5 text-blue-400" />;
    if (insight.includes('🤖') || insight.includes('agent') || insight.includes('workflow')) 
      return <Cpu className="w-5 h-5 text-emerald-400" />;
    if (insight.includes('✨') || insight.includes('generated') || insight.includes('created')) 
      return <Sparkles className="w-5 h-5 text-pink-400" />;
    if (insight.includes('🔮') || insight.includes('future') || insight.includes('prediction')) 
      return <Orbit className="w-5 h-5 text-cyan-400" />;
    
    // Default icon
    return <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900/60 via-black/80 to-gray-900/60 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 h-96 shadow-2xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-white font-space-grotesk">AI Thought Stream</h3>
          <p className="text-purple-300 text-lg">Real-time cognitive processing</p>
        </div>
        <div className="ml-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="space-y-4 overflow-y-auto h-72 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={`${insight}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/8 group"
            >
              <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
                {getInsightIcon(insight)}
              </div>
              <div className="flex-1">
                <p className="text-gray-200 text-lg leading-relaxed">
                  {insight}
                </p>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length === 0 && (
          <div className="text-center py-12">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500/50" />
            </motion.div>
            <p className="text-gray-400 text-lg font-medium">AI thought stream will appear here</p>
            <p className="text-gray-500 mt-2">Watch the AI's reasoning process in real-time</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}