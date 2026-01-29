'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'strong'
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  hover = false 
}) => {
  const baseClasses = 'rounded-xl shadow-lg'
  const variants = {
    default: 'glass',
    strong: 'glass-strong'
  }

  const CardComponent = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <CardComponent
      className={cn(baseClasses, variants[variant], className)}
      {...motionProps}
    >
      {children}
    </CardComponent>
  )
}

export default Card
