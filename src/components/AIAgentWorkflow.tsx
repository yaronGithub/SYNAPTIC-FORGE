import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Search, Database, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  icon: React.ReactNode;
  duration: number;
}

interface AIAgentWorkflowProps {
  query: string;
  isActive: boolean;
  onComplete: (result: any) => void;
}

export function AIAgentWorkflow({ query, isActive, onComplete }: AIAgentWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    if (isActive && query) {
      initializeWorkflow();
    }
  }, [isActive, query]);

  const initializeWorkflow = () => {
    const workflowSteps: WorkflowStep[] = [
      {
        id: 'deconstruct',
        title: 'Query Deconstruction',
        description: 'Breaking down complex query into analyzable components',
        status: 'pending',
        icon: <Brain className="w-4 h-4" />,
        duration: 2000
      },
      {
        id: 'research',
        title: 'Autonomous Research',
        description: 'Sourcing global trend data and market intelligence',
        status: 'pending',
        icon: <Search className="w-4 h-4" />,
        duration: 3000
      },
      {
        id: 'cross-reference',
        title: 'Historical Analysis',
        description: 'Cross-referencing with historical market patterns',
        status: 'pending',
        icon: <Database className="w-4 h-4" />,
        duration: 2500
      },
      {
        id: 'synthesis',
        title: 'Insight Synthesis',
        description: 'Generating comprehensive strategic recommendations',
        status: 'pending',
        icon: <Zap className="w-4 h-4" />,
        duration: 2000
      },
      {
        id: 'validation',
        title: 'Confidence Validation',
        description: 'Validating insights against multiple data sources',
        status: 'pending',
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 1500
      }
    ];

    setSteps(workflowSteps);
    executeWorkflow(workflowSteps);
  };

  const executeWorkflow = async (workflowSteps: WorkflowStep[]) => {
    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStep(i);
      
      // Update step status to active
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'active' : index < i ? 'completed' : 'pending'
      })));

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, workflowSteps[i].duration));

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= i ? 'completed' : 'pending'
      })));
    }

    // Complete workflow
    onComplete({
      workflowCompleted: true,
      stepsExecuted: workflowSteps.length,
      totalDuration: workflowSteps.reduce((acc, step) => acc + step.duration, 0)
    });
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-space-grotesk">Autonomous AI Agent Workflow</h3>
          <p className="text-purple-300 text-sm">Multi-step reasoning in progress...</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              step.status === 'active' 
                ? 'bg-purple-600/30 border border-purple-400/50' 
                : step.status === 'completed'
                ? 'bg-emerald-600/20 border border-emerald-400/30'
                : 'bg-gray-800/30 border border-gray-600/20'
            }`}
          >
            <div className={`p-2 rounded-full ${
              step.status === 'active' 
                ? 'bg-purple-500 animate-pulse' 
                : step.status === 'completed'
                ? 'bg-emerald-500'
                : 'bg-gray-600'
            }`}>
              {step.icon}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.status === 'completed' ? 'text-emerald-300' : 'text-white'
              }`}>
                {step.title}
              </h4>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>

            {step.status === 'active' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full"
              />
            )}

            {step.status === 'completed' && (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}

            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-500" />
            )}
          </motion.div>
        ))}
      </div>

      {currentStep === steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-emerald-600/20 rounded-lg border border-emerald-400/30"
        >
          <p className="text-emerald-300 text-sm font-medium">
            ✅ Autonomous workflow completed - Comprehensive strategic analysis ready
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}