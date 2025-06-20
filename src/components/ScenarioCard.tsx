import React from 'react';
import { Scenario, RelevanceScore } from '../types';
import { TrendingUp, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScenarioCardProps {
  scenario: Scenario;
  relevance: RelevanceScore;
}

export function ScenarioCard({ scenario, relevance }: ScenarioCardProps) {
  const getRelevanceColor = (level: RelevanceScore['level']) => {
    switch (level) {
      case 'high': return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'moderate': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-accent-600';
    if (confidence >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 60) return <Target className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">{scenario.title}</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRelevanceColor(relevance.level)}`}>
                {relevance.level.charAt(0).toUpperCase() + relevance.level.slice(1)} Relevance
              </span>
            </div>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className={`flex items-center gap-1 ${getConfidenceColor(scenario.confidence)}`}>
            {getConfidenceIcon(scenario.confidence)}
            <span className="font-semibold">{scenario.confidence}%</span>
          </div>
          <p className="text-xs text-gray-500">Confidence</p>
        </div>
      </div>

      {/* Predicted Outcome */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Predicted Outcome</h4>
        <p className="text-gray-700 leading-relaxed">{scenario.predictedOutcome}</p>
      </div>

      {/* Key Implications */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Implications</h4>
        <ul className="space-y-2">
          {scenario.keyImplications.map((implication, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{implication}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Relevance Matches */}
      {relevance.matches.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Why This Matters to You
          </h4>
          <div className="flex flex-wrap gap-2">
            {relevance.matches.map((match, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs border border-primary-200"
              >
                {match}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}