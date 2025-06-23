import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, StarOff, Plus, Edit3, Trash2, Download, Share, Tag, Calendar, Brain, Folder, Grid, List } from 'lucide-react';
import { useInteractionHistory } from '../hooks/useInteractionHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useAnalytics } from '../hooks/useAnalytics';
import { AIInteraction } from '../lib/supabase';

interface InsightManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InsightFilter {
  search: string;
  type: string;
  dateRange: string;
  favorites: boolean;
  tags: string[];
}

export function InsightManager({ isOpen, onClose }: InsightManagerProps) {
  const { interactions, loading } = useInteractionHistory();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { trackEvent } = useAnalytics();
  
  const [filter, setFilter] = useState<InsightFilter>({
    search: '',
    type: 'all',
    dateRange: 'all',
    favorites: false,
    tags: []
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [editingInsight, setEditingInsight] = useState<string | null>(null);
  const [customTags, setCustomTags] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (isOpen) {
      trackEvent('insight_manager_opened', { total_insights: interactions.length });
    }
  }, [isOpen, interactions.length, trackEvent]);

  const filteredInsights = interactions.filter(insight => {
    // Search filter
    if (filter.search && !insight.query_text.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter.type !== 'all' && insight.query_type !== filter.type) {
      return false;
    }
    
    // Favorites filter
    if (filter.favorites && !isFavorite(insight.id)) {
      return false;
    }
    
    // Date range filter
    if (filter.dateRange !== 'all') {
      const insightDate = new Date(insight.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - insightDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filter.dateRange) {
        case 'today':
          if (daysDiff > 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
      }
    }
    
    return true;
  });

  const handleToggleFavorite = async (insightId: string) => {
    try {
      if (isFavorite(insightId)) {
        await removeFromFavorites(insightId);
        trackEvent('insight_unfavorited', { insight_id: insightId });
      } else {
        await addToFavorites(insightId);
        trackEvent('insight_favorited', { insight_id: insightId });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleExportInsight = (insight: AIInteraction) => {
    const exportData = {
      title: insight.query_text,
      type: insight.query_type,
      created_at: insight.created_at,
      strategic_vector: insight.strategic_vector,
      foresight_construct: insight.foresight_construct,
      ai_thought_stream: insight.ai_thought_stream
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synaptic-forge-insight-${insight.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent('insight_exported', { insight_id: insight.id, format: 'json' });
  };

  const handleBulkExport = () => {
    const selectedData = interactions.filter(i => selectedInsights.includes(i.id));
    const exportData = {
      exported_at: new Date().toISOString(),
      total_insights: selectedData.length,
      insights: selectedData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synaptic-forge-insights-bulk-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent('insights_bulk_exported', { count: selectedData.length });
    setSelectedInsights([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'strategic_analysis': return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'innovation_opportunities': return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30';
      case 'risk_assessment': return 'bg-red-600/20 text-red-300 border-red-500/30';
      case 'market_disruption': return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-4 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-space-grotesk">Insight Manager</h2>
                <p className="text-gray-400 text-sm">{filteredInsights.length} of {interactions.length} insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedInsights.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleBulkExport}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export Selected ({selectedInsights.length})
                </motion.button>
              )}
              
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="strategic_analysis">Strategic Analysis</option>
                <option value="innovation_opportunities">Innovation Opportunities</option>
                <option value="risk_assessment">Risk Assessment</option>
                <option value="market_disruption">Market Disruption</option>
              </select>

              {/* Date Range */}
              <select
                value={filter.dateRange}
                onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              {/* Favorites Toggle */}
              <button
                onClick={() => setFilter(prev => ({ ...prev, favorites: !prev.favorites }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  filter.favorites 
                    ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' 
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <Star className={`w-4 h-4 ${filter.favorites ? 'fill-current' : ''}`} />
                Favorites Only
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : filteredInsights.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No insights found</h3>
                <p className="text-gray-400">Try adjusting your filters or create new insights</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all ${
                      viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedInsights.includes(insight.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInsights(prev => [...prev, insight.id]);
                            } else {
                              setSelectedInsights(prev => prev.filter(id => id !== insight.id));
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getInsightTypeColor(insight.query_type)}`}>
                          {insight.query_type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavorite(insight.id)}
                          className={`p-1 rounded transition-colors ${
                            isFavorite(insight.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                        >
                          {isFavorite(insight.id) ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleExportInsight(insight)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-white font-medium mb-2 line-clamp-2">
                      {insight.query_text}
                    </h3>

                    {insight.foresight_construct && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                        {(insight.foresight_construct as any).conciseActionableRecommendation}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(insight.created_at)}
                      </div>
                      {insight.ai_thought_stream && (
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {insight.ai_thought_stream.length} thoughts
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}