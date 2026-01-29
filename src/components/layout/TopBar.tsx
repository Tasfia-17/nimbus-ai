'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Download, Settings, Zap, Loader2, AlertCircle, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useArchitecture } from '@/contexts/ArchitectureContext'

const TopBar: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const { isGenerating, generateArchitecture, error, progress } = useArchitecture()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    generateArchitecture(prompt)
    setPrompt('')
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <Card className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-gold" />
              <h1 className="text-xl font-bold text-white">NimbusAI</h1>
            </div>
            <span className="text-sm text-gray-400">Your AI Cloud Architect</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Describe your architecture..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 w-64"
                disabled={isGenerating}
              />
              {isGenerating && progress > 0 && (
                <div className="absolute -bottom-1 left-0 h-0.5 bg-gold/30 rounded-full w-full">
                  <div 
                    className="h-full bg-gold rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}
        
        {/* Progress Display */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="flex items-center space-x-2 text-gold bg-gold/10 border border-gold/20 rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              <span className="text-sm">
                Generating architecture with Kiro CLI... {progress > 0 && `${progress}%`}
              </span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

export default TopBar
