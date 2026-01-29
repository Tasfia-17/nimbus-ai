import { KiroArchitectureResponse, KiroWorkflowProgress, KiroStreamEvent } from '@/types/kiro'

// Dynamic import for Node.js modules to avoid webpack issues
const getChildProcess = async () => {
  if (typeof window === 'undefined') {
    const { spawn } = await import('child_process')
    return { spawn }
  }
  throw new Error('Child process not available in browser environment')
}

export class KiroWorkflowError extends Error {
  constructor(message: string, public step?: string, public code?: number) {
    super(message)
    this.name = 'KiroWorkflowError'
  }
}

export interface KiroWorkflowOptions {
  timeout?: number
  workingDirectory?: string
}

export async function executeKiroWorkflow(
  prompt: string,
  options: KiroWorkflowOptions = {}
): Promise<KiroArchitectureResponse> {
  const { timeout = 120000, workingDirectory = process.cwd() } = options

  return new Promise(async (resolve, reject) => {
    try {
      const { spawn } = await getChildProcess()
      
      // Use the architecture planner agent directly
      const kiroProcess = spawn('kiro-cli', ['chat'], {
        cwd: workingDirectory,
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let output = ''
      let errorOutput = ''
      
      const timeoutId = setTimeout(() => {
        kiroProcess.kill('SIGTERM')
        reject(new KiroWorkflowError('Workflow timeout exceeded', undefined, -1))
      }, timeout)

      kiroProcess.stdout?.on('data', (data) => {
        output += data.toString()
      })

      kiroProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString()
      })

      kiroProcess.on('error', (error) => {
        clearTimeout(timeoutId)
        reject(new KiroWorkflowError(`Failed to start Kiro CLI: ${error.message}`))
      })

      kiroProcess.on('close', (code) => {
        clearTimeout(timeoutId)
        
        if (code !== 0 && code !== null) {
          reject(new KiroWorkflowError(`Kiro workflow failed: ${errorOutput}`, undefined, code))
          return
        }

        try {
          // Parse the JSON output from the architecture planner
          // Look for JSON in the output
          const jsonMatch = output.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            reject(new KiroWorkflowError('No JSON response found in Kiro output'))
            return
          }
          
          const result = JSON.parse(jsonMatch[0])
          resolve(result as KiroArchitectureResponse)
        } catch (error) {
          reject(new KiroWorkflowError(`Failed to parse Kiro output: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      })

      // Send the prompt to Kiro CLI with the architecture planner context
      const architecturePrompt = `@01_architecture_planner\n\n${prompt}\n\nPlease provide the response in the exact JSON format specified in your prompt.`
      kiroProcess.stdin?.write(architecturePrompt)
      kiroProcess.stdin?.end()
    } catch (error) {
      reject(new KiroWorkflowError(`Failed to initialize Kiro workflow: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}

export async function* streamKiroWorkflow(
  prompt: string,
  options: KiroWorkflowOptions = {}
): AsyncGenerator<KiroStreamEvent, void, unknown> {
  const { timeout = 120000, workingDirectory = process.cwd() } = options
  
  try {
    const { spawn } = await getChildProcess()
    
    const kiroProcess = spawn('kiro-cli', ['chat'], {
      cwd: workingDirectory,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let output = ''
    let currentStep = 0
    const totalSteps = 7 // Based on text_to_infra.yaml
    
    const timeoutId = setTimeout(() => {
      kiroProcess.kill('SIGTERM')
    }, timeout)

    try {
      yield {
        type: 'progress',
        data: {
          currentStep: 'plan_architecture',
          completedSteps: [],
          totalSteps,
          progress: 14
        }
      }

      // Send the prompt to Kiro CLI with the architecture planner context
      const architecturePrompt = `@01_architecture_planner\n\n${prompt}\n\nPlease provide the response in the exact JSON format specified in your prompt.`
      kiroProcess.stdin?.write(architecturePrompt)
      kiroProcess.stdin?.end()

      yield {
        type: 'progress',
        data: {
          currentStep: 'processing',
          completedSteps: ['plan_architecture'],
          totalSteps,
          progress: 50
        }
      }

      if (kiroProcess.stdout) {
        for await (const chunk of kiroProcess.stdout) {
          output += chunk.toString()
          currentStep++
          
          yield {
            type: 'progress',
            data: {
              currentStep: `step_${currentStep}`,
              completedSteps: Array.from({ length: currentStep - 1 }, (_, i) => `step_${i + 1}`),
              totalSteps,
              progress: Math.min(90, Math.round((currentStep / totalSteps) * 100))
            }
          }
        }
      }

      // Parse the JSON output
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON response found in Kiro output')
      }
      
      const result = JSON.parse(jsonMatch[0]) as KiroArchitectureResponse
      yield {
        type: 'progress',
        data: {
          currentStep: 'complete',
          completedSteps: Array.from({ length: totalSteps }, (_, i) => `step_${i + 1}`),
          totalSteps,
          progress: 100
        }
      }
      
      yield {
        type: 'result',
        data: result
      }
    } catch (error) {
      yield {
        type: 'error',
        data: { message: error instanceof Error ? error.message : 'Unknown error' }
      }
    } finally {
      clearTimeout(timeoutId)
      kiroProcess.kill('SIGTERM')
    }
  } catch (error) {
    throw new Error(`Failed to initialize streaming workflow: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function validateKiroCLI(): Promise<boolean> {
  try {
    const { spawn } = await getChildProcess()
    const result = await new Promise<boolean>((resolve) => {
      const process = spawn('kiro-cli', ['--version'], { stdio: 'pipe' })
      process.on('close', (code) => resolve(code === 0))
      process.on('error', () => resolve(false))
    })
    return result
  } catch {
    return false
  }
}
