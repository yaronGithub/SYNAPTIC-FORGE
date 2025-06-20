import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIInsight {
  type: 'trend' | 'opportunity' | 'risk' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  relevance: 'high' | 'medium' | 'low';
}

interface AIInsightCardProps {
  insights: AIInsight[];
}

export function AIInsightCard({ insights }: AIInsightCardProps) {
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'opportunity': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'risk': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'prediction': return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const getRelevanceColor = (relevance: AIInsight['relevance']) => {
    switch (relevance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center text-gray-500 border-2 border-dashed border-gray-200">
        <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="font-medium">AI Insights Loading...</p>
        <p className="text-sm">Analyzing current events for personalized insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        AI Insights
      </h3>
      
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getInsightIcon(insight.type)}
              <h4 className="font-semibold text-gray-900 capitalize">{insight.type}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(insight.relevance)}`}>
                {insight.relevance}
              </span>
              <span className="text-xs text-gray-500">{insight.confidence}%</span>
            </div>
          </div>
          
          <h5 className="font-medium text-gray-900 mb-1">{insight.title}</h5>
          <p className="text-sm text-gray-700">{insight.description}</p>
        </motion.div>
      ))}
    </div>
  );
}