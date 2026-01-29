import React from 'react'
import { motion } from 'framer-motion'

interface CanvasControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onToggleGrid: () => void
  showGrid: boolean
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  showGrid
}) => (
  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onZoomIn}
      className="glass-panel p-2 rounded-lg text-white hover:text-accent"
    >
      +
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onZoomOut}
      className="glass-panel p-2 rounded-lg text-white hover:text-accent"
    >
      -
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onFitView}
      className="glass-panel p-2 rounded-lg text-white hover:text-accent"
    >
      ⌂
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleGrid}
      className={`glass-panel p-2 rounded-lg ${showGrid ? 'text-accent' : 'text-white'} hover:text-accent`}
    >
      ⊞
    </motion.button>
  </div>
)

interface NodeToolbarProps {
  selectedNode: any
  onDelete: () => void
  onEdit: () => void
  onDuplicate: () => void
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  selectedNode,
  onDelete,
  onEdit,
  onDuplicate
}) => {
  if (!selectedNode) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-panel p-2 rounded-lg flex gap-2"
    >
      <button onClick={onEdit} className="text-white hover:text-accent p-1">
        ✏️
      </button>
      <button onClick={onDuplicate} className="text-white hover:text-accent p-1">
        📋
      </button>
      <button onClick={onDelete} className="text-white hover:text-red-400 p-1">
        🗑️
      </button>
    </motion.div>
  )
}
