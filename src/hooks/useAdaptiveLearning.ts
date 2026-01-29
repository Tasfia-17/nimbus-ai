import { useState, useCallback } from 'react'

interface LearningPattern {
  id: string
  pattern: string
  confidence: number
  occurrences: number
  lastSeen: Date
}

interface UserModification {
  architectureId: string
  action: 'add' | 'remove' | 'modify'
  service: string
  context: string
  timestamp: Date
}

export function useAdaptiveLearning() {
  const [patterns, setPatterns] = useState<LearningPattern[]>([])
  const [isLearning, setIsLearning] = useState(true)

  const recordModification = useCallback((modification: Omit<UserModification, 'timestamp'>) => {
    if (!isLearning) return

    const fullModification: UserModification = {
      ...modification,
      timestamp: new Date()
    }

    // Store in local encrypted storage
    const existing = JSON.parse(localStorage.getItem('nimbus_learning') || '[]')
    existing.push(fullModification)
    localStorage.setItem('nimbus_learning', JSON.stringify(existing))

    // Update patterns
    updatePatterns(fullModification)
  }, [isLearning])

  const updatePatterns = (modification: UserModification) => {
    setPatterns(prev => {
      const patternKey = `${modification.action}_${modification.service}_${modification.context}`
      const existingPattern = prev.find(p => p.pattern === patternKey)

      if (existingPattern) {
        return prev.map(p => 
          p.pattern === patternKey 
            ? { ...p, occurrences: p.occurrences + 1, confidence: Math.min(p.confidence + 0.1, 1), lastSeen: new Date() }
            : p
        )
      } else {
        return [...prev, {
          id: crypto.randomUUID(),
          pattern: patternKey,
          confidence: 0.1,
          occurrences: 1,
          lastSeen: new Date()
        }]
      }
    })
  }

  const getRecommendations = useCallback((context: string) => {
    return patterns
      .filter(p => p.pattern.includes(context) && p.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
  }, [patterns])

  const clearLearningData = useCallback(() => {
    localStorage.removeItem('nimbus_learning')
    setPatterns([])
  }, [])

  const toggleLearning = useCallback(() => {
    setIsLearning(prev => !prev)
  }, [])

  return {
    patterns,
    isLearning,
    recordModification,
    getRecommendations,
    clearLearningData,
    toggleLearning
  }
}
