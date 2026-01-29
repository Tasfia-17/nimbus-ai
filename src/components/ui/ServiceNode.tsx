'use client'

import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { AWSService } from '@/types/aws'
import { CanvasNodeData } from '@/types/canvas'
import Card from './Card'

interface ServiceNodeProps extends NodeProps {
  data: CanvasNodeData
}

const ServiceNode: React.FC<ServiceNodeProps> = ({ data, selected }) => {
  const { service, label } = data
  const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<any>

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`p-4 min-w-[200px] border-2 transition-all duration-200 ${
          selected 
            ? 'border-gold shadow-lg shadow-gold/20' 
            : 'border-white/10 hover:border-white/20'
        }`}
        hover
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-violet border-2 border-white"
        />
        
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${service.color}20` }}
          >
            {IconComponent && (
              <IconComponent 
                size={24} 
                style={{ color: service.color }}
              />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-white">
              {label || service.name}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              {service.description}
            </p>
          </div>
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-violet border-2 border-white"
        />
      </Card>
    </motion.div>
  )
}

export default ServiceNode
