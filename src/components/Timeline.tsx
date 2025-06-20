import React from 'react';
import { Event } from '../types';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedEventId?: string;
}

export function Timeline({ events, onEventClick, selectedEventId }: TimelineProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getImpactColor = (impact: Event['impact']) => {
    switch (impact) {
      case 'high': return 'bg-error-500 border-error-600';
      case 'medium': return 'bg-warning-500 border-warning-600';
      case 'low': return 'bg-accent-500 border-accent-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getImpactIcon = (impact: Event['impact']) => {
    switch (impact) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No relevant events found</p>
          <p className="text-sm">Try adjusting your context settings to see more events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200"></div>

      {/* Events */}
      <div className="space-y-8">
        {sortedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-20"
          >
            {/* Timeline Dot */}
            <div
              className={`absolute left-6 w-4 h-4 rounded-full border-2 ${getImpactColor(event.impact)} ${
                selectedEventId === event.id ? 'ring-4 ring-primary-200' : ''
              }`}
            ></div>

            {/* Event Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEventClick(event)}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                selectedEventId === event.id ? 'ring-2 ring-primary-500 bg-primary-50/50' : 'hover:bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getImpactColor(event.impact).replace('bg-', 'bg-').replace('-500', '-100')}`}>
                    {getImpactIcon(event.impact)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  event.impact === 'high' ? 'bg-error-100 text-error-800' :
                  event.impact === 'medium' ? 'bg-warning-100 text-warning-800' :
                  'bg-accent-100 text-accent-800'
                }`}>
                  {event.impact} Impact
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{event.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs capitalize"
                  >
                    {tag.replace('-', ' ')}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                    +{event.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Future Impact Date */}
              {event.predictedImpactDate && (
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Predicted impact: {formatDate(event.predictedImpactDate)}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}