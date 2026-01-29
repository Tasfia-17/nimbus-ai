import { useState, useCallback } from 'react'
import { SimulationScenario, CostAnalysisResult, WhatIfSimulationState } from '@/types/simulation'
import { executeCostAnalyst, executeArchitecturePlanner } from '@/lib/real-kiro-agents'

interface UseWhatIfSimulationReturn extends WhatIfSimulationState {
  runSimulation: (scenarioId: string, architecturePrompt: string) => Promise<void>
  clearSimulation: () => void
}

const defaultScenarios: SimulationScenario[] = [
  {
    id: 'baseline',
    name: 'Current Architecture',
    description: 'Existing configuration',
    parameters: {}
  },
  {
    id: 'high_traffic',
    name: 'High Traffic (5x)',
    description: 'Traffic increases by 500%',
    parameters: { traffic_multiplier: 5 }
  },
  {
    id: 'multi_az',
    name: 'Multi-AZ Deployment',
    description: 'High availability across zones',
    parameters: { multi_az: true }
  },
  {
    id: 'reserved_instances',
    name: 'Reserved Instances',
    description: '1-year reserved capacity',
    parameters: { reserved_instances: true }
  }
]

export function useWhatIfSimulation(): UseWhatIfSimulationReturn {
  const [state, setState] = useState<WhatIfSimulationState>({
    isSimulating: false,
    currentScenario: null,
    scenarios: defaultScenarios,
    result: null,
    error: null
  })

  const runSimulation = useCallback(async (scenarioId: string, architecturePrompt: string) => {
    const scenario = state.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return

    setState(prev => ({
      ...prev,
      isSimulating: true,
      currentScenario: scenario,
      error: null
    }))

    try {
      // Use real Kiro agents for simulation
      const architectureResponse = await executeArchitecturePlanner(architecturePrompt)
      
      if (!architectureResponse.success) {
        throw new Error(architectureResponse.error || 'Architecture planning failed')
      }

      const costResponse = await executeCostAnalyst(architectureResponse.data, scenario.parameters)
      
      if (!costResponse.success) {
        throw new Error(costResponse.error || 'Cost analysis failed')
      }

      setState(prev => ({
        ...prev,
        isSimulating: false,
        result: costResponse.data
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSimulating: false,
        error: error instanceof Error ? error.message : 'Simulation failed'
      }))
    }
  }, [state.scenarios])

  const clearSimulation = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentScenario: null,
      result: null,
      error: null
    }))
  }, [])

  return {
    ...state,
    runSimulation,
    clearSimulation
  }
}
