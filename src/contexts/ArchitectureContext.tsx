'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useArchitectureStream } from '@/hooks/useArchitectureStream'

interface ArchitectureService {
  id: string
  service: string
  category: string
  purpose: string
  is_existing: boolean
  scaling_strategy: string
  connections: string[]
}

interface ArchitectureData {
  architecture_name: string
  version: string
  well_architected_score: {
    security: number
    cost: number
    reliability: number
  }
  assumptions: string[]
  external_integrations: string[]
  services: ArchitectureService[]
}

interface ArchitectureContextType {
  isGenerating: boolean
  currentArchitecture: ArchitectureData | null
  generateArchitecture: (prompt: string) => void
  error: string | null
  progress: number
  // Well-Architected score access methods
  getSecurityScore: () => number
  getCostScore: () => number
  getReliabilityScore: () => number
  hasWellArchitectedScores: () => boolean
}

const ArchitectureContext = createContext<ArchitectureContextType | undefined>(undefined)

export const useArchitecture = () => {
  const context = useContext(ArchitectureContext)
  if (!context) {
    throw new Error('useArchitecture must be used within an ArchitectureProvider')
  }
  return context
}

interface ArchitectureProviderProps {
  children: ReactNode
}

export const ArchitectureProvider: React.FC<ArchitectureProviderProps> = ({ children }) => {
  const { 
    isGenerating, 
    result, 
    error, 
    progress: workflowProgress,
    generateArchitecture: streamGenerate 
  } = useArchitectureStream()

  const generateArchitecture = (prompt: string) => {
    streamGenerate(prompt)
  }

  const getSecurityScore = () => result?.well_architected_score?.security || 0
  const getCostScore = () => result?.well_architected_score?.cost || 0
  const getReliabilityScore = () => result?.well_architected_score?.reliability || 0
  const hasWellArchitectedScores = () => !!result?.well_architected_score

  return (
    <ArchitectureContext.Provider value={{
      isGenerating,
      currentArchitecture: result,
      generateArchitecture,
      error,
      progress: workflowProgress?.progress || 0,
      getSecurityScore,
      getCostScore,
      getReliabilityScore,
      hasWellArchitectedScores
    }}>
      {children}
    </ArchitectureContext.Provider>
  )
}
