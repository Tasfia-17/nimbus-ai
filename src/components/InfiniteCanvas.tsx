'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  Node
} from 'reactflow'
import { motion } from 'framer-motion'
import { RotateCcw, Maximize } from 'lucide-react'
import 'reactflow/dist/style.css'

import { getLayoutedElements } from '@/lib/elkLayout'
import { AWSService, AWSServiceCategory } from '@/types/aws'
import { CanvasNode, CanvasNodeData } from '@/types/canvas'
import { awsServices, getServiceById } from '@/lib/awsServices'
import { useArchitecture } from '@/contexts/ArchitectureContext'
import ServiceNode from '@/components/ui/ServiceNode'
import Button from '@/components/ui/Button'

const nodeTypes = {
  awsService: ServiceNode
}

const InfiniteCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null)
  const { currentArchitecture } = useArchitecture()

  // Convert generated architecture to canvas nodes
  useEffect(() => {
    if (!currentArchitecture) return

    const newNodes: Node<CanvasNodeData>[] = []
    const newEdges: Edge[] = []

    currentArchitecture.services.forEach((service, index) => {
      // Find matching AWS service or create a generic one
      const awsService = getServiceById(service.service.toLowerCase()) || {
        id: service.service.toLowerCase(),
        name: service.service,
        category: service.category as AWSServiceCategory,
        icon: 'Server',
        description: service.purpose,
        color: '#FF9900'
      }

      const node: Node<CanvasNodeData> = {
        id: service.id,
        type: 'awsService',
        position: { x: index * 250, y: 100 },
        data: {
          label: service.service,
          service: awsService,
          category: service.category,
          icon: awsService.icon,
          description: service.purpose
        }
      }

      newNodes.push(node)

      // Create edges based on connections
      service.connections.forEach(targetId => {
        newEdges.push({
          id: `${service.id}-${targetId}`,
          source: service.id,
          target: targetId,
          type: 'smoothstep'
        })
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)

    // Auto-layout after setting nodes
    setTimeout(async () => {
      if (newNodes.length > 0) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(
          newNodes,
          newEdges,
          { direction: 'TB', nodeSpacing: 200, layerSpacing: 200 }
        )
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
        
        setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.2 })
        }, 100)
      }
    }, 100)
  }, [currentArchitecture, setNodes, setEdges, reactFlowInstance])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!reactFlowBounds || !reactFlowInstance) return

      const data = event.dataTransfer.getData('application/reactflow')
      if (!data) return

      try {
        const { type, service }: { type: string; service: AWSService } = JSON.parse(data)
        
        if (type === 'awsService') {
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          })

          const newNode: Node<CanvasNodeData> = {
            id: `${service.id}-${Date.now()}`,
            type: 'awsService',
            position,
            data: {
              label: service.name,
              service: service,
              category: service.category,
              icon: service.icon,
              description: service.description
            }
          }

          setNodes((nds) => [...nds, newNode])
        }
      } catch (error) {
        console.error('Failed to parse drop data:', error)
      }
    },
    [reactFlowInstance, setNodes]
  )

  const onLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(
      nodes,
      edges,
      { direction: 'TB', nodeSpacing: 200, layerSpacing: 200 }
    )

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)

    // Fit view after layout
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.2 })
    }, 100)
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance])

  const onClear = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges])

  return (
    <div className="w-full h-screen relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-primary"
        defaultEdgeOptions={{
          style: { stroke: '#8B5CF6', strokeWidth: 2 },
          type: 'smoothstep'
        }}
      >
        <Background 
          color="#ffffff" 
          gap={20} 
          size={1}
          style={{ opacity: 0.1 }}
        />
        <Controls 
          className="glass rounded-lg border border-white/10"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
        />
        <MiniMap 
          className="glass rounded-lg border border-white/10"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
          nodeColor="#8B5CF6"
          maskColor="rgba(5, 5, 16, 0.8)"
        />
        
        {/* Canvas Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="absolute top-4 right-4 flex space-x-2 z-10"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onLayout}
            disabled={nodes.length === 0}
          >
            <Maximize className="w-4 h-4 mr-2" />
            Auto Layout
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={nodes.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </motion.div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                <Maximize className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Start Building Your Architecture
              </h3>
              <p className="text-gray-400 max-w-md">
                Drag AWS services from the sidebar to create your cloud architecture.
                Use the auto-layout feature to organize your design.
              </p>
            </div>
          </motion.div>
        )}
      </ReactFlow>
    </div>
  )
}

const InfiniteCanvasWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <InfiniteCanvas />
    </ReactFlowProvider>
  )
}

export default InfiniteCanvasWrapper