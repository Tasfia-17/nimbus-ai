'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Shield, BarChart3, ArrowRight, Code2, Cpu, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface OnboardingProps {
  onGetStarted: () => void
}

const Onboarding: React.FC<OnboardingProps> = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020205] overflow-hidden">
      {/* Dynamic Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet/5 rounded-full blur-[150px]" 
      />

      {/* Main Content (Merged into Backdrop) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            Nimbus<span className="text-gold">AI</span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The next generation of <span className="text-white font-medium">Design Engineering</span>. 
            Transform architectural vision into production-ready cloud assets.
          </p>
        </motion.div>

        {/* Feature Grid - Ultra Clean */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-12 w-full mb-16"
        >
          {[
            { 
              icon: Cpu, 
              title: 'Agentic Architect', 
              desc: '7 coordinated agents turning natural language into deterministic AWS infrastructure.' 
            },
            { 
              icon: Lock, 
              title: 'Secure by Design', 
              desc: 'Continuous auditing against CIS benchmarks with real-time auto-remediation snippets.' 
            },
            { 
              icon: BarChart3, 
              title: 'FinOps Intelligence', 
              desc: 'What-if simulations to forecast costs and optimize resource allocation at scale.' 
            },
          ].map((feature, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-white/[0.02] border border-white/5 rounded-2xl -m-4 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-500" />
              <div className="relative">
                <feature.icon className="w-8 h-8 text-gold mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Action Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <Button 
            size="md" 
            onClick={onGetStarted}
            className="group px-8 py-3 bg-transparent border border-gold/30 hover:border-gold/60 rounded-full text-gold font-semibold transition-all relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent skew-x-12"
            />
            <span className="relative flex items-center">
              Enter Workspace
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          
          <div className="mt-8 flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <Code2 className="w-3 h-3" />
              <span>Kiro CLI Powered</span>
            </div>
            <div className="w-1 h-1 bg-gray-800 rounded-full" />
            <div className="flex items-center space-x-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
              <Shield className="w-3 h-3" />
              <span>Well-Architected Compliance</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Glass Backdrop Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[80px] pointer-events-none" />
    </div>
  )
}

export default Onboarding
