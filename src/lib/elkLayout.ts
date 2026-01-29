import { Node, Edge } from 'reactflow'
import { LayoutDirection, LayoutOptions } from '@/types/canvas'

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {
    direction: 'TB',
    nodeSpacing: 200,
    layerSpacing: 200
  }
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = options.direction === 'LR' || options.direction === 'RL'
  const nodeSpacing = options.nodeSpacing
  const layerSpacing = options.layerSpacing

  // Simple grid layout algorithm
  const layoutedNodes = nodes.map((node, index) => {
    const row = Math.floor(index / 3) // 3 nodes per row
    const col = index % 3

    const x = col * (nodeSpacing + 200) // 200 is default node width
    const y = row * (layerSpacing + 100) // 100 is default node height

    return {
      ...node,
      position: isHorizontal 
        ? { x: y, y: x } // Swap x and y for horizontal layout
        : { x, y }
    }
  })

  return {
    nodes: layoutedNodes,
    edges
  }
}
