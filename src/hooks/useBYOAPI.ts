import { useState, useCallback } from 'react'
import { APICredentials, BYOAPIState } from '@/types/byo-api'

export function useBYOAPI() {
  const [state, setState] = useState<BYOAPIState & { isSecuring: boolean }>({
    credentials: {},
    isConfigured: false,
    validationStatus: {},
    isSecuring: false
  })

  const updateCredentials = useCallback(async (service: string, credentials: any) => {
    setState(prev => ({ ...prev, isSecuring: true }))
    
    // Simulate high-security encryption delay for demo impact
    await new Promise(resolve => setTimeout(resolve, 800))

    setState(prev => ({
      ...prev,
      isSecuring: false,
      credentials: {
        ...prev.credentials,
        [service]: credentials
      },
      validationStatus: {
        ...prev.validationStatus,
        [service]: 'pending' as any
      }
    }))
  }, [])

  const validateCredentials = useCallback(async (service: string) => {
    setState(prev => ({
      ...prev,
      validationStatus: {
        ...prev.validationStatus,
        [service]: 'pending' as any
      }
    }))

    try {
      const response = await fetch('/api/validate-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, credentials: (state.credentials as any)[service] })
      })

      const { valid } = await response.json()
      
      setState(prev => {
        const newStatus = {
          ...prev.validationStatus,
          [service]: (valid ? 'valid' : 'invalid') as any
        }
        return {
          ...prev,
          validationStatus: newStatus,
          isConfigured: Object.values(newStatus).some(status => status === 'valid')
        }
      })
    } catch {
      setState(prev => ({
        ...prev,
        validationStatus: {
          ...prev.validationStatus,
          [service]: 'invalid' as any
        }
      }))
    }
  }, [state.credentials])

  const clearCredentials = useCallback((service: string) => {
    setState(prev => {
      const newCredentials = { ...prev.credentials }
      delete (newCredentials as any)[service]
      
      const newValidationStatus = { ...prev.validationStatus }
      delete newValidationStatus[service]
      
      return {
        ...prev,
        credentials: newCredentials,
        validationStatus: newValidationStatus,
        isConfigured: Object.values(newValidationStatus).some(status => status === 'valid')
      }
    })
  }, [])

  return {
    ...state,
    updateCredentials,
    validateCredentials,
    clearCredentials
  }
}
