import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Database, Users, Settings, Star, Menu, X, Search, Bell, User } from 'lucide-react';
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 right-6 z-40 lg:hidden bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20"
      >
        <Menu className="w-6 h-6" />
      </motion.button>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 space-y-3"
        >
          {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </motion.button>
            );
          })}
          
          {/* Settings button */}
          <motion.button
            onClick={onOpenSettings}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-400">Customize your experience</div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white font-space-grotesk">SYNAPTIC FORGE</h2>
                      {user && profile && (
                        <p className="text-sm text-gray-400">
                          {profile.preferred_name || profile.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="space-y-3">
                    {mainNavigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                        >
                          <div className={`p-2 bg-gradient-to-r ${item.color} rounded-lg`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{item.label}</div>
                            <div className="text-gray-400 text-xs">{item.description}</div>
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                    >
                      <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">Settings</div>
                        <div className="text-gray-400 text-xs">Customize your experience</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                  <div className="text-center text-xs text-gray-500">
                    SYNAPTIC FORGE v1.0
                    <br />
                    The Adaptive Foresight Engine
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