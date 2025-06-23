import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, username, preferredName);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setPreferredName('');
    setError('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white font-space-grotesk">
                          {isSignUp ? 'Join SYNAPTIC FORGE' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          {isSignUp ? 'Create your AI-powered strategic intelligence account' : 'Access your personalized AI insights'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <User className="w-4 h-4" />
                            Username
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a unique username"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <User className="w-4 h-4" />
                            Preferred Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={preferredName}
                            onChange={(e) => setPreferredName(e.target.value)}
                            placeholder="How should the AI address you?"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                        required
                        minLength={6}
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-600/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 font-space-grotesk disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </div>
                      ) : (
                        isSignUp ? 'Create Account' : 'Sign In'
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={toggleMode}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
                    >
                      {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}