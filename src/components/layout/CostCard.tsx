'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, AlertCircle, ChevronUp, ChevronDown, BarChart3 } from 'lucide-react'
import Card from '@/components/ui/Card'
import ScoreIndicator from '@/components/ui/ScoreIndicator'
import SimulationToggle from '@/components/ui/SimulationToggle'
import { useArchitecture } from '@/contexts/ArchitectureContext'
import { useWhatIfSimulation } from '@/hooks/useWhatIfSimulation'

interface CostData {
  current: number
  projected: number
  savings: number
  trend: 'up' | 'down' | 'stable'
}

const CostCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [costData] = useState<CostData>({
    current: 247.50,
    projected: 312.80,
    savings: 65.30,
    trend: 'up'
  })

  const { currentArchitecture } = useArchitecture()
  const { 
    scenarios, 
    currentScenario, 
    result: simulationResult, 
    isSimulating,
    runSimulation 
  } = useWhatIfSimulation()

  const handleScenarioChange = (scenarioId: string) => {
    if (currentArchitecture) {
      runSimulation(scenarioId, currentArchitecture.architecture_name)
    }
  }

  const displayCost = simulationResult?.total_monthly_usd || costData.current
  const wellArchitectedScore = currentArchitecture?.well_architected_score

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <Card className="w-80">
        <div className="p-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gold" />
              <h3 className="font-semibold text-white">Cost Analysis</h3>
            </div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
          
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">
                ${displayCost}
              </span>
              <span className="text-sm text-gray-400">/month</span>
              {simulationResult?.simulation_comparison && (
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-3 h-3 text-gold" />
                  <span className="text-xs text-gold">
                    {simulationResult.simulation_comparison.delta_percentage}
                  </span>
                </div>
              )}
              {!simulationResult && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-3 h-3 ${
                    costData.trend === 'up' ? 'text-red-400' : 'text-green-400'
                  }`} />
                  <span className={`text-xs ${
                    costData.trend === 'up' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    +12%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Well-Architected Scores */}
          {wellArchitectedScore && (
            <div className="mt-4 flex justify-between">
              <ScoreIndicator 
                score={wellArchitectedScore.security} 
                label="Security" 
                size="sm" 
              />
              <ScoreIndicator 
                score={wellArchitectedScore.cost} 
                label="Cost" 
                size="sm" 
              />
              <ScoreIndicator 
                score={wellArchitectedScore.reliability} 
                label="Reliability" 
                size="sm" 
              />
            </div>
          )}
          
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
                  {/* What-if Simulation */}
                  <SimulationToggle
                    scenarios={scenarios}
                    selectedScenario={currentScenario?.id || null}
                    onScenarioChange={handleScenarioChange}
                    disabled={isSimulating || !currentArchitecture}
                  />

                  {isSimulating && (
                    <div className="flex items-center space-x-2 text-gold">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </motion.div>
                      <span className="text-sm">Running simulation...</span>
                    </div>
                  )}

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Projected</span>
                      <span className="text-sm text-white">${costData.projected}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Potential Savings</span>
                      <span className="text-sm text-green-400">-${costData.savings}</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {simulationResult?.savings_recommendations && simulationResult.savings_recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Recommendations</h4>
                      {simulationResult.savings_recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!simulationResult && (
                    <div className="flex items-start space-x-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-yellow-400 font-medium">Optimization Available</p>
                        <p className="text-xs text-gray-300 mt-1">
                          Switch to Reserved Instances for 26% savings
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

export default CostCard
