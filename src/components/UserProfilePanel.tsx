import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { User, MapPin, Briefcase, Heart, Target, Settings, X, Sparkles } from 'lucide-react';

interface UserProfilePanelProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PREDEFINED_INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cloud Computing',
  'Cybersecurity', 'Blockchain', 'IoT', 'Robotics', 'Quantum Computing',
  'Sustainability', 'Green Technology', 'Renewable Energy', 'Climate Tech',
  'Digital Marketing', 'E-commerce', 'Fintech', 'Healthtech', 'Edtech',
  'Project Management', 'Leadership', 'Innovation', 'Entrepreneurship'
];

const PREDEFINED_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'Git', 'Agile', 'Scrum', 'DevOps', 'CI/CD',
  'Data Analysis', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving'
];

const CAREER_GOALS = [
  'Become a Tech Lead', 'Start My Own Company', 'Transition to AI/ML',
  'Move to Management', 'Become a Consultant', 'Work Remotely',
  'Join a Startup', 'Work at FAANG', 'Become a Data Scientist',
  'Lead Digital Transformation', 'Become a Product Manager'
];

export function UserProfilePanel({ userProfile, onUpdateProfile, isOpen, onToggle }: UserProfilePanelProps) {
  const [currentRole, setCurrentRole] = useState(userProfile.currentRole);
  const [location, setLocation] = useState(userProfile.location);
  const [interests, setInterests] = useState<string[]>(userProfile.interests);
  const [currentSkills, setCurrentSkills] = useState<string[]>(userProfile.currentSkills);
  const [careerGoals, setCareerGoals] = useState<string[]>(userProfile.careerGoals);
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel);
  const [customInterest, setCustomInterest] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const handleApplyProfile = () => {
    onUpdateProfile({
      currentRole,
      location,
      interests,
      currentSkills,
      careerGoals,
      experienceLevel
    });
    onToggle();
  };

  const toggleItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCustomItem = (custom: string, setCustom: (value: string) => void, list: string[], setList: (items: string[]) => void) => {
    if (custom.trim() && !list.includes(custom.trim())) {
      setList([...list, custom.trim()]);
      setCustom('');
    }
  };

  const removeItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    setList(list.filter(i => i !== item));
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onToggle}
            className="fixed top-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
          >
            <Settings className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Panel Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl overflow-y-auto z-50 border-l border-white/10"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-orbitron">Professional Profile</h2>
                    <p className="text-gray-400 text-sm">Define your career context for AI analysis</p>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 text-green-400" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    Experience Level
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['entry', 'mid', 'senior', 'executive'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setExperienceLevel(level as any)}
                        className={`px-4 py-3 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          experienceLevel === level
                            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border-purple-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                    <Heart className="w-4 h-4 text-pink-400" />
                    Professional Interests
                  </label>

                  {/* Selected Interests */}
                  {interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {interests.map((interest) => (
                        <motion.span
                          key={interest}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm"
                        >
                          {interest}
                          <button
                            onClick={() => removeItem(interest, interests, setInterests)}
                            className="hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Interest */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="Add custom interest..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-white placeholder-gray-500 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomItem(customInterest, setCustomInterest, interests, setInterests)}
                    />
                    <button
                      onClick={() => addCustomItem(customInterest, setCustomInterest, interests, setInterests)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {/* Predefined Interests */}
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {PREDEFINED_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleItem(interest, interests, setInterests)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          interests.includes(interest)
                            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-300 border-purple-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Skills */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Current Skills
                  </label>

                  {/* Selected Skills */}
                  {currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentSkills.map((skill) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30 backdrop-blur-sm"
                        >
                          {skill}
                          <button
                            onClick={() => removeItem(skill, currentSkills, setCurrentSkills)}
                            className="hover:bg-cyan-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Skill */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="Add current skill..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm text-white placeholder-gray-500 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomItem(customSkill, setCustomSkill, currentSkills, setCurrentSkills)}
                    />
                    <button
                      onClick={() => addCustomItem(customSkill, setCustomSkill, currentSkills, setCurrentSkills)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {/* Predefined Skills */}
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {PREDEFINED_SKILLS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleItem(skill, currentSkills, setCurrentSkills)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          currentSkills.includes(skill)
                            ? 'bg-gradient-to-r from-cyan-600/30 to-teal-600/30 text-cyan-300 border-cyan-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Career Goals
                  </label>

                  {/* Selected Goals */}
                  {careerGoals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {careerGoals.map((goal) => (
                        <motion.span
                          key={goal}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30 backdrop-blur-sm"
                        >
                          {goal}
                          <button
                            onClick={() => removeItem(goal, careerGoals, setCareerGoals)}
                            className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Goal */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Add career goal..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-white placeholder-gray-500 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomItem(customGoal, setCustomGoal, careerGoals, setCareerGoals)}
                    />
                    <button
                      onClick={() => addCustomItem(customGoal, setCustomGoal, careerGoals, setCareerGoals)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {/* Predefined Goals */}
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {CAREER_GOALS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleItem(goal, careerGoals, setCareerGoals)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm border ${
                          careerGoals.includes(goal)
                            ? 'bg-gradient-to-r from-emerald-600/30 to-green-600/30 text-emerald-300 border-emerald-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                onClick={handleApplyProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-orbitron text-lg shadow-lg"
              >
                Analyze Future Skills
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}