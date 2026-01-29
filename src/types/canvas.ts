import { Node, Edge } from 'reactflow'
import { AWSService } from './aws'

export interface CanvasNodeData {
  label: string
  service: AWSService
  category: string
  icon?: string
  description?: string
}

export type CanvasNode = Node<CanvasNodeData>
export type CanvasEdge = Edge

export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL'

export interface LayoutOptions {
  direction: LayoutDirection
  nodeSpacing: number
  layerSpacing: number
}
