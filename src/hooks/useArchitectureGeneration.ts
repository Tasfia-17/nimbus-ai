import { useState, useCallback } from 'react'
import { executeKiroWorkflow } from '@/lib/kiro-cli'
import { KiroArchitectureResponse } from '@/types/kiro'

interface UseArchitectureGenerationReturn {
  isGenerating: boolean
  architecture: KiroArchitectureResponse | null
  error: string | null
  generateArchitecture: (prompt: string) => Promise<void>
  clearArchitecture: () => void
}

export function useArchitectureGeneration(): UseArchitectureGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [architecture, setArchitecture] = useState<KiroArchitectureResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateArchitecture = useCallback(async (prompt: string) => {
    if (!prompt || !prompt.trim()) {
      setError('Prompt is required')
      return
    }

    setIsGenerating(true)
    setError(null)
    setArchitecture(null)

    try {
      const result = await executeKiroWorkflow(prompt.trim())
      setArchitecture(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearArchitecture = useCallback(() => {
    setArchitecture(null)
    setError(null)
  }, [])

  return {
    isGenerating,
    architecture,
    error,
    generateArchitecture,
    clearArchitecture
  }
}