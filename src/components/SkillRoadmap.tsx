import React from 'react';
import { motion } from 'framer-motion';
import { PersonalizedSkill, LearningDirective } from '../types';
import { Target, Clock, DollarSign, CheckCircle, Star, BookOpen } from 'lucide-react';

interface SkillRoadmapProps {
  skills: PersonalizedSkill[];
  onDirectiveComplete: (skillId: string, directiveId: string) => void;
  className?: string;
}

export function SkillRoadmap({ skills, onDirectiveComplete, className = '' }: SkillRoadmapProps) {
  const getStrategicValueColor = (value: number) => {
    if (value >= 8) return 'from-emerald-500 to-green-400';
    if (value >= 6) return 'from-yellow-500 to-amber-400';
    return 'from-blue-500 to-cyan-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCostIcon = (cost: string) => {
    switch (cost) {
      case 'free': return '🆓';
      case 'low': return '💰';
      case 'medium': return '💰💰';
      case 'high': return '💰💰💰';
      default: return '💰';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-orbitron">Personalized Skill Roadmap</h3>
          <p className="text-gray-400 text-sm">AI-generated learning pathways for your future</p>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm"
          >
            {/* Skill Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">{skill.name}</h4>
                <p className="text-gray-300 text-sm mb-2">{skill.description}</p>
                <p className="text-cyan-400 text-xs">{skill.careerImpact}</p>
              </div>
              
              <div className="text-right ml-4">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold">{skill.strategicValue}/10</span>
                </div>
                <div className="text-xs text-gray-400">Strategic Value</div>
              </div>
            </div>

            {/* Skill Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Time to Proficiency</span>
                </div>
                <p className="text-blue-300 text-sm">{skill.timeToProficiency}</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Skill Gap</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${skill.currentGap * 10}%` }}
                    />
                  </div>
                  <span className="text-purple-300 text-sm">{skill.currentGap}/10</span>
                </div>
              </div>
            </div>

            {/* Learning Directives */}
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learning Directives
              </h5>
              
              <div className="space-y-3">
                {skill.learningDirectives.map((directive, dirIndex) => (
                  <motion.div
                    key={directive.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (dirIndex * 0.05) }}
                    className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-white/5"
                  >
                    <button
                      onClick={() => onDirectiveComplete(skill.id, directive.id)}
                      className="mt-1 p-1 rounded-full border border-gray-600 hover:border-green-400 hover:bg-green-400/10 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 text-gray-400 hover:text-green-400" />
                    </button>
                    
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{directive.action}</p>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {directive.timeframe}
                        </span>
                        
                        <span className={`px-2 py-1 rounded border ${getDifficultyColor(directive.difficulty)}`}>
                          {directive.difficulty}
                        </span>
                        
                        <span className="text-gray-400">
                          {getCostIcon(directive.cost)} {directive.cost}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400">{directive.priority}/10</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-gray-400">Set your profile to generate personalized skills</p>
        </div>
      )}
    </motion.div>
  );
}