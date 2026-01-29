'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface SimulationToggleProps {
  scenarios: Array<{ id: string; name: string; description: string }>
  selectedScenario: string | null
  onScenarioChange: (scenarioId: string) => void
  disabled?: boolean
}

const SimulationToggle: React.FC<SimulationToggleProps> = ({
  scenarios,
  selectedScenario,
  onScenarioChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">What-if Scenario</label>
      <div className="space-y-1">
        {scenarios.map((scenario) => (
          <motion.button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            disabled={disabled}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
              selectedScenario === scenario.id
                ? 'bg-gold/10 border-gold/40 text-white'
                : 'glass border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{scenario.name}</div>
                <div className="text-xs text-gray-400 mt-1">{scenario.description}</div>
              </div>
              {selectedScenario === scenario.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-gold" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SimulationToggle
