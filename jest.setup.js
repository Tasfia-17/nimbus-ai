import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock child_process for Kiro CLI integration
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}))

// Mock React Flow
jest.mock('reactflow', () => ({
  ReactFlow: ({ children }) => React.createElement('div', { 'data-testid': 'react-flow' }, children),
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  addEdge: jest.fn(),
  Background: () => React.createElement('div', { 'data-testid': 'background' }),
  Controls: () => React.createElement('div', { 'data-testid': 'controls' }),
  MiniMap: () => React.createElement('div', { 'data-testid': 'minimap' }),
  ReactFlowProvider: ({ children }) => React.createElement('div', null, children),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123'
  }
})

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    button: ({ children, ...props }) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }) => React.createElement('div', null, children),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Settings: () => React.createElement('div', { 'data-testid': 'settings-icon' }),
  Eye: () => React.createElement('div', { 'data-testid': 'eye-icon' }),
  EyeOff: () => React.createElement('div', { 'data-testid': 'eye-off-icon' }),
  Check: () => React.createElement('div', { 'data-testid': 'check-icon' }),
  X: () => React.createElement('div', { 'data-testid': 'x-icon' }),
  Loader: () => React.createElement('div', { 'data-testid': 'loader-icon' }),
  RotateCcw: () => React.createElement('div', { 'data-testid': 'rotate-icon' }),
  Maximize: () => React.createElement('div', { 'data-testid': 'maximize-icon' }),
}))
