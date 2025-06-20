import React, { useState } from 'react';
import { UserContext } from '../types';
import { Settings, MapPin, Briefcase, Heart, X, Plus } from 'lucide-react';

interface UserContextPanelProps {
  userContext: UserContext;
  onUpdateContext: (context: UserContext) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PREDEFINED_INTERESTS = [
  'Technology', 'Climate Change', 'Local Politics', 'Healthcare', 'Education',
  'Finance', 'Real Estate', 'Transportation', 'Energy', 'Innovation',
  'Artificial Intelligence', 'Cryptocurrency', 'Sustainability', 'Urban Planning'
];

export function UserContextPanel({ userContext, onUpdateContext, isOpen, onToggle }: UserContextPanelProps) {
  const [location, setLocation] = useState(userContext.location);
  const [role, setRole] = useState(userContext.role);
  const [interests, setInterests] = useState<string[]>(userContext.interests);
  const [customInterest, setCustomInterest] = useState('');

  const handleApplyContext = () => {
    onUpdateContext({ location, role, interests });
    onToggle();
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Context</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Your Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Hod Hasharon, Israel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4" />
                Professional Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Heart className="w-4 h-4" />
                Your Interests
              </label>

              {/* Selected Interests */}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                />
                <button
                  onClick={addCustomInterest}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Predefined Interests */}
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 rounded-full text-sm transition-all ${
                      interests.includes(interest)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyContext}
            className="w-full mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Apply Context & Update Timeline
          </button>
        </div>
      </div>
    </div>
  );
}