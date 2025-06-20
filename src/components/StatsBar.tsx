import React from 'react';
import { Event, UserContext } from '../types';
import { TrendingUp, Calendar, MapPin, Briefcase } from 'lucide-react';
import { calculateRelevance } from '../utils/relevanceCalculator';

interface StatsBarProps {
  events: Event[];
  userContext: UserContext;
}

export function StatsBar({ events, userContext }: StatsBarProps) {
  const highRelevanceCount = events.filter(event => 
    calculateRelevance(event, userContext).level === 'high'
  ).length;

  const upcomingEvents = events.filter(event => 
    event.predictedImpactDate && new Date(event.predictedImpactDate) > new Date()
  ).length;

  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'High Relevance',
      value: highRelevanceCount,
      color: 'text-accent-600 bg-accent-50'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Total Events',
      value: events.length,
      color: 'text-primary-600 bg-primary-50'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Future Impacts',
      value: upcomingEvents,
      color: 'text-secondary-600 bg-secondary-50'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: userContext.location || 'Not set',
      color: 'text-warning-600 bg-warning-50'
    }
  ];

  const contextSummary = [
    userContext.role && { icon: <Briefcase className="w-4 h-4" />, text: userContext.role },
    userContext.location && { icon: <MapPin className="w-4 h-4" />, text: userContext.location },
  ].filter(Boolean);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${stat.color} mb-1`}>
                {stat.icon}
                <span className="font-semibold text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Context Summary */}
        {contextSummary.length > 0 && (
          <div className="lg:border-l lg:border-gray-200 lg:pl-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Context</h3>
            <div className="space-y-1">
              {contextSummary.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  {item?.icon}
                  <span>{item?.text}</span>
                </div>
              ))}
            </div>
            {userContext.interests.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">{userContext.interests.length} interests selected</p>
                <div className="flex flex-wrap gap-1">
                  {userContext.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {interest}
                    </span>
                  ))}
                  {userContext.interests.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      +{userContext.interests.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}