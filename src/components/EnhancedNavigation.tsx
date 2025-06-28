import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Users, Settings, Star, Menu, X, Search, Bell, User, Zap, Cpu, Sparkles, Orbit } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';

interface EnhancedNavigationProps {
  onOpenInsightManager: () => void;
  onOpenDataSourceManager: () => void;
  onOpenCollaborationHub: () => void;
  onOpenSettings: () => void;
  onOpenQueryForge: () => void;
}

export function EnhancedNavigation({
  onOpenInsightManager,
  onOpenDataSourceManager,
  onOpenCollaborationHub,
  onOpenSettings,
  onOpenQueryForge
}: EnhancedNavigationProps) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavigationItems = [
    {
      id: 'query-forge',
      label: 'New Analysis',
      icon: Brain,
      description: 'Generate strategic insights',
      onClick: onOpenQueryForge,
      color: 'from-emerald-600 to-cyan-600'
    },
    {
      id: 'insights',
      label: 'My Insights',
      icon: Star,
      description: 'View saved insights',
      onClick: onOpenInsightManager,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'data-sources',
      label: 'Data Sources',
      icon: Database,
      description: 'Connect your data',
      onClick: onOpenDataSourceManager,
      color: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'collaboration',
      label: 'Share',
      icon: Users,
      description: 'Share with team',
      onClick: onOpenCollaborationHub,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMenuOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 right-6 z-40 lg:hidden bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 hover:shadow-emerald-500/25"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Desktop Navigation - Enhanced Vertical Menu */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl p-6 space-y-6"
        >
          {mainNavigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1, 
                  x: 5,
                  boxShadow: `0 10px 25px -5px ${item.color.includes('emerald') ? 'rgba(16, 185, 129, 0.2)' : 
                                                 item.color.includes('blue') ? 'rgba(37, 99, 235, 0.2)' : 
                                                 item.color.includes('purple') ? 'rgba(139, 92, 246, 0.2)' : 
                                                 'rgba(236, 72, 153, 0.2)'}`
                }}
                whileTap={{ scale: 0.9 }}
                className="group relative w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-r"
                  style={{ background: `linear-gradient(to right, ${item.color.replace('from-', '').replace('to-', ', ')})` }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                
                {/* Enhanced Tooltip */}
                <motion.div 
                  className="absolute left-full ml-4 px-4 py-3 bg-gradient-to-r from-gray-900/95 to-black/95 text-white text-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 backdrop-blur-xl"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-bold text-lg">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10"></div>
                </motion.div>
              </motion.button>
            );
          })}
          
          {/* Settings button */}
          <motion.button
            onClick={onOpenSettings}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mainNavigationItems.length * 0.1 }}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="group relative w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
          >
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700"
              whileHover={{ scale: 1.1 }}
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Enhanced Tooltip */}
            <motion.div 
              className="absolute left-full ml-4 px-4 py-3 bg-gradient-to-r from-gray-900/95 to-black/95 text-white text-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 backdrop-blur-xl"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-bold text-lg">Settings</div>
              <div className="text-sm text-gray-400">Customize your experience</div>
              
              {/* Tooltip Arrow */}
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10"></div>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Navigation Menu - Enhanced Design */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-3xl shadow-2xl z-50 lg:hidden border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="p-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl shadow-lg"
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white font-space-grotesk">SYNAPTIC FORGE</h2>
                      {user && profile && (
                        <p className="text-lg text-emerald-400">
                          {profile.preferred_name || profile.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="space-y-4">
                    {mainNavigationItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.03, x: 5 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-2xl transition-all duration-300 text-left border border-white/10 hover:border-white/20"
                        >
                          <div className={`p-3 bg-gradient-to-r ${item.color} rounded-xl shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-white text-xl font-bold">{item.label}</div>
                            <div className="text-gray-400">{item.description}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                    
                    {/* Settings */}
                    <motion.button
                      onClick={() => {
                        onOpenSettings();
                        setIsMenuOpen(false);
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mainNavigationItems.length * 0.1 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-2xl transition-all duration-300 text-left border border-white/10 hover:border-white/20"
                    >
                      <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl shadow-lg">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-xl font-bold">Settings</div>
                        <div className="text-gray-400">Customize your experience</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Footer */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-center text-sm">
                      <div className="text-gray-400 font-medium">SYNAPTIC FORGE v1.0</div>
                      <div className="text-emerald-400">The Adaptive Foresight Engine</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {['emerald', 'cyan', 'purple', 'pink'].map((color, i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 bg-${color}-500 rounded-full`}
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}