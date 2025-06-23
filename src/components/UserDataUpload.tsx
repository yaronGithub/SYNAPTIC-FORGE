import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Plus, Database } from 'lucide-react';
import { useUserDataSources } from '../hooks/useUserDataSources';

export function UserDataUpload() {
  const { dataSources, loading, addDataSource, removeDataSource } = useUserDataSources();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsUploading(true);
    try {
      await addDataSource(name.trim(), content.trim());
      setName('');
      setContent('');
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error uploading data:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeDataSource(id);
    } catch (error) {
      console.error('Error removing data source:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-space-grotesk">Custom Data Sources</h3>
            <p className="text-gray-400 text-sm">Upload your data for personalized AI analysis</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Data
        </button>
      </div>

      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-cyan-600/10 rounded-lg border border-cyan-500/20"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Source Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q4 Sales Data, Market Research Notes"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your data here (CSV, text, notes, etc.)"
                rows={6}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm resize-none"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Data'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {dataSources.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-50" />
          <p className="text-gray-400">No custom data sources yet</p>
          <p className="text-gray-500 text-sm">Upload your data to enable hyper-personalized AI analysis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dataSources.map((dataSource) => (
            <motion.div
              key={dataSource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg border border-white/10 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-white font-medium text-sm">{dataSource.name}</h4>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">
                    Uploaded {new Date(dataSource.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {dataSource.data_content.substring(0, 150)}
                    {dataSource.data_content.length > 150 && '...'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemove(dataSource.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-cyan-600/10 rounded-lg border border-cyan-500/20">
        <p className="text-cyan-300 text-xs">
          💡 <strong>Enterprise Feature:</strong> Your uploaded data is securely stored and will be incorporated into AI analysis when you mention "my data" or "custom data" in queries.
        </p>
      </div>
    </motion.div>
  );
}