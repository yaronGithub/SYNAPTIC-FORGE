import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Save, X, LogOut, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';

export function UserProfileCard() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [preferredName, setPreferredName] = useState(profile?.preferred_name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      await updateProfile({
        preferred_name: preferredName || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreferredName(profile?.preferred_name || '');
    setIsEditing(false);
  };

  if (!user || !profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {profile.preferred_name || profile.username}
            </h3>
            <p className="text-gray-400 text-sm">@{profile.username}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 rounded-full">
            <Star className="w-3 h-3 text-purple-400" />
            <span className="text-purple-300 text-xs font-medium">
              Stage {profile.ai_personality_stage.toFixed(1)}
            </span>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={signOut}
            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-gray-400 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Preferred Name
            </label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              placeholder="How should the AI address you?"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <X className="w-3 h-3" />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        AI Personality Evolution: {profile.ai_personality_stage.toFixed(1)}/10.0
      </div>
    </motion.div>
  );
}