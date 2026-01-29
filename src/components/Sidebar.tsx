'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Server, 
  Database, 
  Network, 
  Shield,
  Key,
  Plus
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { awsServices, getServicesByCategory } from '@/lib/awsServices'
import { AWSServiceCategory, AWSService, APICredential } from '@/types/aws'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const categoryIcons = {
  [AWSServiceCategory.COMPUTE]: Server,
  [AWSServiceCategory.STORAGE]: Database,
  [AWSServiceCategory.DATABASE]: Database,
  [AWSServiceCategory.NETWORKING]: Network,
  [AWSServiceCategory.SECURITY]: Shield,
  [AWSServiceCategory.INTEGRATION]: Network,
  [AWSServiceCategory.ANALYTICS]: Database,
  [AWSServiceCategory.ML]: Server
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'services' | 'api'>('services')
  const [expandedCategory, setExpandedCategory] = useState<AWSServiceCategory | null>(
    AWSServiceCategory.COMPUTE
  )

  const [apiCredentials] = useState<APICredential[]>([
    { id: '1', name: 'AWS Production', type: 'aws', status: 'active', lastUsed: new Date() },
    { id: '2', name: 'Stripe Payments', type: 'stripe', status: 'active', lastUsed: new Date() },
    { id: '3', name: 'Twilio SMS', type: 'twilio', status: 'inactive' }
  ])

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, service: AWSService) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: 'awsService',
      service
    }))
    event.dataTransfer.effectAllowed = 'move'
  }

  const categories = Object.values(AWSServiceCategory)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-20 bottom-0 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <Card className="h-full m-4 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'services' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('services')}
                >
                  Services
                </Button>
                <Button
                  variant={activeTab === 'api' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('api')}
                >
                  API Keys
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-3"
              >
                {!isCollapsed ? (
                  categories.map((category) => {
                    const CategoryIcon = categoryIcons[category]
                    const services = getServicesByCategory(category)
                    const isExpanded = expandedCategory === category

                    return (
                      <div key={category} className="space-y-2">
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-white capitalize">
                              {category}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden space-y-1 ml-6"
                            >
                              {services.map((service) => {
                                const ServiceIcon = Icons[service.icon as keyof typeof Icons] as React.ComponentType<any>
                                
                                return (
                                  <div
                                    key={service.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, service)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 cursor-grab active:cursor-grabbing transition-colors hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                  >
                                    <div 
                                      className="p-1 rounded"
                                      style={{ backgroundColor: `${service.color}20` }}
                                    >
                                      {ServiceIcon && (
                                        <ServiceIcon 
                                          size={16} 
                                          style={{ color: service.color }}
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {service.name}
                                      </p>
                                      <p className="text-xs text-gray-400 truncate">
                                        {service.description}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const CategoryIcon = categoryIcons[category]
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            setIsCollapsed(false)
                            setExpandedCategory(category)
                          }}
                          className="w-full p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <CategoryIcon className="w-5 h-5 text-gray-400 mx-auto" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-3"
              >
                {!isCollapsed ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">API Credentials</h3>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {apiCredentials.map((credential) => (
                        <div
                          key={credential.id}
                          className="p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Key className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {credential.name}
                                </p>
                                <p className="text-xs text-gray-400 capitalize">
                                  {credential.type}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`w-2 h-2 rounded-full ${
                              credential.status === 'active' 
                                ? 'bg-green-400' 
                                : credential.status === 'expired'
                                ? 'bg-red-400'
                                : 'bg-gray-400'
                            }`} />
                          </div>
                          
                          {credential.lastUsed && (
                            <p className="text-xs text-gray-500 mt-2">
                              Last used: {credential.lastUsed.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <Key className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

export default Sidebar
