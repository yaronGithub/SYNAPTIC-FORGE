import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, Edit3, Trash2, Upload, Download, RefreshCw, AlertCircle, CheckCircle, Globe, FileText, Link, Settings } from 'lucide-react';
import { useUserDataSources } from '../hooks/useUserDataSources';
import { useAnalytics } from '../hooks/useAnalytics';

interface DataSourceManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'api' | 'database' | 'url';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  recordCount?: number;
  config: Record<string, any>;
}

const DATA_SOURCE_TYPES = [
  { value: 'file', label: 'File Upload', icon: FileText, description: 'Upload CSV, JSON, or text files' },
  { value: 'api', label: 'API Endpoint', icon: Globe, description: 'Connect to REST APIs' },
  { value: 'url', label: 'Web URL', icon: Link, description: 'Scrape data from websites' },
  { value: 'database', label: 'Database', icon: Database, description: 'Connect to external databases' }
];

export function DataSourceManager({ isOpen, onClose }: DataSourceManagerProps) {
  const { dataSources, loading, addDataSource, removeDataSource } = useUserDataSources();
  const { trackEvent } = useAnalytics();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('file');
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    url: '',
    apiKey: '',
    headers: '',
    method: 'GET'
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackEvent('data_source_manager_opened', { total_sources: dataSources.length });
    }
  }, [isOpen, dataSources.length, trackEvent]);

  const handleAddDataSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setUploading(true);
    try {
      let content = formData.content;
      let sourceConfig: Record<string, any> = { type: selectedType };

      // Handle different data source types
      switch (selectedType) {
        case 'file':
          content = formData.content;
          break;
        case 'api':
          sourceConfig = {
            ...sourceConfig,
            url: formData.url,
            method: formData.method,
            headers: formData.headers ? JSON.parse(formData.headers) : {},
            apiKey: formData.apiKey
          };
          content = `API Endpoint: ${formData.url}`;
          break;
        case 'url':
          sourceConfig = { ...sourceConfig, url: formData.url };
          content = `Web URL: ${formData.url}`;
          break;
        case 'database':
          content = 'Database connection configured';
          break;
      }

      await addDataSource(formData.name.trim(), content, selectedType);
      
      // Reset form
      setFormData({
        name: '',
        content: '',
        url: '',
        apiKey: '',
        headers: '',
        method: 'GET'
      });
      setShowAddForm(false);
      
      trackEvent('data_source_added', { type: selectedType, name: formData.name });
    } catch (error) {
      console.error('Error adding data source:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        content,
        name: prev.name || file.name.replace(/\.[^/.]+$/, '')
      }));
    };
    reader.readAsText(file);
  };

  const handleRemove = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      try {
        await removeDataSource(id);
        trackEvent('data_source_removed', { name });
      } catch (error) {
        console.error('Error removing data source:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'syncing': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = DATA_SOURCE_TYPES.find(t => t.value === type);
    const Icon = typeConfig?.icon || Database;
    return <Icon className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-4 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-space-grotesk">Data Source Manager</h2>
                <p className="text-gray-400 text-sm">{dataSources.length} data sources configured</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowAddForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Data Source
              </motion.button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-6 bg-cyan-600/10 rounded-xl border border-cyan-500/20"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Data Source</h3>
                  
                  {/* Type Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {DATA_SOURCE_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            selectedType === type.value
                              ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs opacity-75">{type.description}</div>
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleAddDataSource} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Source Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Sales Data Q4 2024"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                        required
                      />
                    </div>

                    {/* Type-specific fields */}
                    {selectedType === 'file' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Upload File
                          </label>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".csv,.json,.txt,.xml"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-cyan-600 file:text-white file:cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Or Paste Content
                          </label>
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Paste your data here (CSV, JSON, text, etc.)"
                            rows={6}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm resize-none"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'api' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              API URL
                            </label>
                            <input
                              type="url"
                              value={formData.url}
                              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                              placeholder="https://api.example.com/data"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Method
                            </label>
                            <select
                              value={formData.method}
                              onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            API Key (Optional)
                          </label>
                          <input
                            type="password"
                            value={formData.apiKey}
                            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                            placeholder="Your API key"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'url' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://example.com/data-page"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                          required
                        />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <motion.button
                        type="submit"
                        disabled={uploading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Data Source
                          </>
                        )}
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Data Sources List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : dataSources.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No data sources configured</h3>
                <p className="text-gray-400 mb-4">Add your first data source to enable personalized AI analysis</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Data Source
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataSources.map((source) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600/20 rounded-lg">
                          {getTypeIcon(source.data_type)}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{source.name}</h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border mt-1 ${getStatusColor('connected')}`}>
                            {getStatusIcon('connected')}
                            Connected
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemove(source.id, source.name)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {source.data_content.substring(0, 100)}...
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Added {new Date(source.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{source.data_type}</span>
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