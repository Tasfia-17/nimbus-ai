export interface SimulationScenario {
  id: string
  name: string
  description: string
  parameters: Record<string, any>
}

export interface SimulationComparison {
  current_usd: number
  simulated_usd: number
  delta_percentage: string
}

export interface CostAnalysisResult {
  total_monthly_usd: number
  simulation_comparison: SimulationComparison
  services: Array<{
    service: string
    estimate_usd: number
    assumptions: string
  }>
  savings_recommendations: string[]
}

export interface WhatIfSimulationState {
  isSimulating: boolean
  currentScenario: SimulationScenario | null
  scenarios: SimulationScenario[]
  result: CostAnalysisResult | null
  error: string | null
}

export interface SecurityAuditResult {
  security_score: number
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  compliance_status: {
    gdpr: boolean
    hipaa: boolean
    sox: boolean
  }
  recommendations: string[]
}
