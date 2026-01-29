export interface KiroArchitectureService {
  id: string
  service: string
  category: 'compute' | 'storage' | 'database' | 'networking' | 'integration' | 'security'
  purpose: string
  is_existing: boolean
  scaling_strategy: string
  connections: string[]
}

export interface KiroWellArchitectedScore {
  security: number
  cost: number
  reliability: number
}

export interface KiroArchitectureResponse {
  architecture_name: string
  version: string
  well_architected_score: KiroWellArchitectedScore
  assumptions: string[]
  external_integrations: string[]
  services: KiroArchitectureService[]
}

export interface KiroWorkflowStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface KiroWorkflowProgress {
  currentStep: string
  completedSteps: string[]
  totalSteps: number
  progress: number
  result?: KiroArchitectureResponse
  error?: string
}

export interface KiroStreamEvent {
  type: 'progress' | 'step' | 'result' | 'error'
  data: KiroWorkflowProgress | KiroWorkflowStep | KiroArchitectureResponse | { message: string }
}
