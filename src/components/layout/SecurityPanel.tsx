'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, ChevronUp, XCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import ScoreIndicator from '@/components/ui/ScoreIndicator'
import { useArchitecture } from '@/contexts/ArchitectureContext'

const SecurityPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentArchitecture } = useArchitecture()

  const wellArchitectedScore = currentArchitecture?.well_architected_score
  const securityScore = wellArchitectedScore?.security || 0

  // Mock security data - in real implementation this would come from security auditor agent
  const mockVulnerabilities = [
    {
      severity: 'high' as const,
      description: 'S3 bucket allows public read access',
      recommendation: 'Enable bucket-level encryption and restrict public access'
    },
    {
      severity: 'medium' as const,
      description: 'EC2 instances missing security groups',
      recommendation: 'Configure restrictive security groups with minimal required ports'
    },
    {
      severity: 'low' as const,
      description: 'CloudTrail logging not enabled',
      recommendation: 'Enable CloudTrail for audit logging and compliance'
    }
  ]

  const mockCompliance = {
    gdpr: true,
    hipaa: false,
    sox: true
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle className="w-4 h-4" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />
      case 'low':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Card className="w-80">
        <div className="p-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-white">Security Analysis</h3>
            </div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">
                  {Math.round(securityScore)}
                </span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
              <ScoreIndicator 
                score={securityScore} 
                label="Security" 
                size="sm" 
              />
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                  {/* Compliance Status */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Compliance</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(mockCompliance).map(([standard, compliant]) => (
                        <div key={standard} className="flex items-center space-x-1">
                          {compliant ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="text-xs text-gray-300 uppercase">{standard}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Issues */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Security Issues</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {mockVulnerabilities.map((vuln, index) => (
                        <div key={index} className={`p-2 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                          <div className="flex items-start space-x-2">
                            {getSeverityIcon(vuln.severity)}
                            <div className="flex-1">
                              <p className="text-xs font-medium capitalize">{vuln.severity}</p>
                              <p className="text-xs text-gray-300 mt-1">{vuln.description}</p>
                              <p className="text-xs text-gray-400 mt-1 italic">{vuln.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Quick Actions</h4>
                    <div className="space-y-1">
                      <button className="w-full text-left p-2 rounded-lg glass border border-white/10 hover:border-white/20 transition-colors">
                        <span className="text-xs text-white">Enable AWS Config</span>
                      </button>
                      <button className="w-full text-left p-2 rounded-lg glass border border-white/10 hover:border-white/20 transition-colors">
                        <span className="text-xs text-white">Configure Security Groups</span>
                      </button>
                      <button className="w-full text-left p-2 rounded-lg glass border border-white/10 hover:border-white/20 transition-colors">
                        <span className="text-xs text-white">Enable GuardDuty</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

export default SecurityPanel
