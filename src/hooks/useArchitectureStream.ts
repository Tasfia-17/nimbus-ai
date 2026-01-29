import { useEffect, useState, useCallback, useRef } from 'react'
import { KiroStreamEvent, KiroArchitectureResponse, KiroWorkflowProgress } from '@/types/kiro'

interface UseArchitectureStreamState {
  isGenerating: boolean
  progress: KiroWorkflowProgress | null
  result: KiroArchitectureResponse | null
  error: string | null
}

interface UseArchitectureStreamReturn extends UseArchitectureStreamState {
  generateArchitecture: (prompt: string) => void
  cancelGeneration: () => void
}

export function useArchitectureStream(): UseArchitectureStreamReturn {
  const [state, setState] = useState<UseArchitectureStreamState>({
    isGenerating: false,
    progress: null,
    result: null,
    error: null
  })
  
  const eventSourceRef = useRef<EventSource | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cancelGeneration = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    setState(prev => ({
      ...prev,
      isGenerating: false
    }))
  }, [])

  const generateArchitecture = useCallback(async (prompt: string) => {
    // Cancel any existing generation
    cancelGeneration()
    
    setState({
      isGenerating: true,
      progress: null,
      result: null,
      error: null
    })

    try {
      abortControllerRef.current = new AbortController()
      
      const response = await fetch('/api/architecture/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start architecture generation')
      }

      if (!response.body) {
        throw new Error('No response body received')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            
            if (data === '[DONE]') {
              setState(prev => ({ ...prev, isGenerating: false }))
              return
            }

            try {
              const event: KiroStreamEvent = JSON.parse(data)
              
              switch (event.type) {
                case 'progress':
                  setState(prev => ({
                    ...prev,
                    progress: event.data as KiroWorkflowProgress
                  }))
                  break
                  
                case 'result':
                  setState(prev => ({
                    ...prev,
                    result: event.data as KiroArchitectureResponse,
                    isGenerating: false
                  }))
                  break
                  
                case 'error':
                  const errorData = event.data as { message: string }
                  setState(prev => ({
                    ...prev,
                    error: errorData.message,
                    isGenerating: false
                  }))
                  break
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Generation was cancelled, don't set error state
        return
      }
      
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isGenerating: false
      }))
    }
  }, [cancelGeneration])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelGeneration()
    }
  }, [cancelGeneration])

  return {
    ...state,
    generateArchitecture,
    cancelGeneration
  }
}
