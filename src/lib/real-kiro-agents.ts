import { KiroWorkflowError } from './kiro-cli'

// Dynamic import for Node.js modules to avoid webpack issues
const getChildProcess = async () => {
  if (typeof window === 'undefined') {
    const { spawn } = await import('child_process')
    return { spawn }
  }
  throw new Error('Child process not available in browser environment')
}

export interface AgentResponse {
  success: boolean
  data?: any
  error?: string
}

export interface CostAnalysisResult {
  total_monthly_usd: number
  simulation_comparison: {
    current_usd: number
    simulated_usd: number
    delta_percentage: string
  }
  services: Array<{
    service: string
    estimate_usd: number
    assumptions: string
  }>
  savings_recommendations: string[]
}

export interface SecurityAuditResult {
  security_score: number
  vulnerabilities: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low'
    category: string
    description: string
    remediation: string
  }>
  compliance_status: {
    gdpr: boolean
    hipaa: boolean
    sox: boolean
  }
}

export interface DiagramLayout {
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    data: { label: string; service: string }
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    type: string
  }>
}

async function executeKiroAgent(agentName: string, prompt: string, timeout = 60000): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const { spawn } = await getChildProcess()
      
      const kiroProcess = spawn('kiro-cli', ['chat'], {
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let output = ''
      let errorOutput = ''
      
      const timeoutId = setTimeout(() => {
        kiroProcess.kill('SIGTERM')
        reject(new KiroWorkflowError('Agent timeout exceeded', agentName, -1))
      }, timeout)

      kiroProcess.stdout?.on('data', (data) => {
        output += data.toString()
      })

      kiroProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString()
      })

      kiroProcess.on('error', (error) => {
        clearTimeout(timeoutId)
        reject(new KiroWorkflowError(`Failed to start Kiro CLI: ${error.message}`, agentName))
      })

      kiroProcess.on('close', (code) => {
        clearTimeout(timeoutId)
        
        if (code !== 0 && code !== null) {
          reject(new KiroWorkflowError(`Agent ${agentName} failed: ${errorOutput}`, agentName, code))
          return
        }

        try {
          const jsonMatch = output.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            reject(new KiroWorkflowError(`No JSON response found from agent ${agentName}`, agentName))
            return
          }
          
          const result = JSON.parse(jsonMatch[0])
          resolve(result)
        } catch (error) {
          reject(new KiroWorkflowError(`Failed to parse ${agentName} output: ${error instanceof Error ? error.message : 'Unknown error'}`, agentName))
        }
      })

      const agentPrompt = `@${agentName}\n\n${prompt}\n\nPlease provide the response in JSON format.`
      kiroProcess.stdin?.write(agentPrompt)
      kiroProcess.stdin?.end()
    } catch (error) {
      reject(new KiroWorkflowError(`Failed to initialize agent ${agentName}: ${error instanceof Error ? error.message : 'Unknown error'}`, agentName))
    }
  })
}

export async function executeArchitecturePlanner(prompt: string): Promise<AgentResponse> {
  try {
    const result = await executeKiroAgent('01_architecture_planner', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Architecture planning failed' 
    }
  }
}

export async function executeDiagramGenerator(architectureData: any): Promise<AgentResponse> {
  try {
    const prompt = `Generate diagram layout for this architecture:\n${JSON.stringify(architectureData, null, 2)}`
    const result = await executeKiroAgent('02_diagram_generator', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Diagram generation failed' 
    }
  }
}

export async function executeTerraformEngineer(architectureData: any): Promise<AgentResponse> {
  try {
    const prompt = `Generate Terraform code for this architecture:\n${JSON.stringify(architectureData, null, 2)}`
    const result = await executeKiroAgent('03_terraform_engineer', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terraform generation failed' 
    }
  }
}

export async function executeCostAnalyst(architectureData: any, scenario?: any): Promise<AgentResponse> {
  try {
    let prompt = `Analyze costs for this architecture:\n${JSON.stringify(architectureData, null, 2)}`
    if (scenario) {
      prompt += `\n\nScenario parameters:\n${JSON.stringify(scenario, null, 2)}`
    }
    const result = await executeKiroAgent('04_cost_analyst', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Cost analysis failed' 
    }
  }
}

export async function executeSecurityAuditor(architectureData: any): Promise<AgentResponse> {
  try {
    const prompt = `Perform security audit for this architecture:\n${JSON.stringify(architectureData, null, 2)}`
    const result = await executeKiroAgent('05_security_auditor', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Security audit failed' 
    }
  }
}

export async function executeArchitectureExplainer(architectureData: any): Promise<AgentResponse> {
  try {
    const prompt = `Generate documentation for this architecture:\n${JSON.stringify(architectureData, null, 2)}`
    const result = await executeKiroAgent('06_architecture_explainer', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Documentation generation failed' 
    }
  }
}

export async function executeUILayoutDesigner(componentRequirements: any): Promise<AgentResponse> {
  try {
    const prompt = `Design UI layout for these requirements:\n${JSON.stringify(componentRequirements, null, 2)}`
    const result = await executeKiroAgent('07_ui_layout_designer', prompt)
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'UI layout design failed' 
    }
  }
}
