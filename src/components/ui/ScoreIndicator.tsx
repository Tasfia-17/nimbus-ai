'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ScoreIndicatorProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ 
  score, 
  label, 
  size = 'md',
  className = '' 
}) => {
  const normalizedScore = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981' // green-500
    if (score >= 60) return '#F59E0B' // amber-500
    if (score >= 40) return '#F97316' // orange-500
    return '#EF4444' // red-500
  }

  const sizes = {
    sm: { width: 60, height: 60, fontSize: 'text-xs', strokeWidth: 6 },
    md: { width: 80, height: 80, fontSize: 'text-sm', strokeWidth: 8 },
    lg: { width: 100, height: 100, fontSize: 'text-base', strokeWidth: 10 }
  }

  const { width, height, fontSize, strokeWidth } = sizes[size]

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="transform -rotate-90"
          aria-label={`${label} score: ${normalizedScore}%`}
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={45}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={45}
            stroke={getScoreColor(normalizedScore)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-white ${fontSize}`}>
            {Math.round(normalizedScore)}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  )
}

export default ScoreIndicator
