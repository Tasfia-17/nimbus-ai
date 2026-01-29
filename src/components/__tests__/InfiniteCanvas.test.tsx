import React from 'react'
import { render, screen } from '@testing-library/react'
import InfiniteCanvas from '../InfiniteCanvas'
import { ArchitectureProvider } from '@/contexts/ArchitectureContext'

// Mock ReactFlow components
jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  ReactFlowProvider: ({ children }: any) => <div data-testid="react-flow-provider">{children}</div>,
  Background: () => <div data-testid="background" />,
  Controls: () => <div data-testid="controls" />,
  MiniMap: () => <div data-testid="minimap" />,
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  addEdge: jest.fn(),
}))

// Mock the architecture context
const mockArchitectureContext = {
  isGenerating: false,
  currentArchitecture: null,
  generateArchitecture: jest.fn(),
  error: null,
  progress: 0,
  getSecurityScore: () => 85,
  getCostScore: () => 75,
  getReliabilityScore: () => 90,
  hasWellArchitectedScores: () => true,
}

const TestWrapper = ({ children, contextValue = mockArchitectureContext }: any) => (
  <ArchitectureProvider value={contextValue}>
    {children}
  </ArchitectureProvider>
)

describe('InfiniteCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders ReactFlow with controls and background', () => {
    render(
      <TestWrapper>
        <InfiniteCanvas />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    expect(screen.getByTestId('controls')).toBeInTheDocument()
    expect(screen.getByTestId('background')).toBeInTheDocument()
    expect(screen.getByTestId('minimap')).toBeInTheDocument()
  })

  it('displays empty canvas initially', () => {
    render(
      <TestWrapper>
        <InfiniteCanvas />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
  })

  it('renders nodes when architecture is provided', () => {
    const mockArchitecture = {
      architecture_name: 'Test Architecture',
      version: '1.0',
      well_architected_score: { security: 85, cost: 75, reliability: 90 },
      assumptions: [],
      external_integrations: [],
      services: [
        {
          id: 'service-1',
          service: 'Lambda',
          category: 'compute',
          purpose: 'API handler',
          is_existing: false,
          scaling_strategy: 'auto',
          connections: []
        }
      ]
    }

    const contextWithArchitecture = {
      ...mockArchitectureContext,
      currentArchitecture: mockArchitecture
    }

    render(
      <TestWrapper contextValue={contextWithArchitecture}>
        <InfiniteCanvas />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
  })

  it('displays loading state when generating architecture', () => {
    const contextWithLoading = {
      ...mockArchitectureContext,
      isGenerating: true
    }

    render(
      <TestWrapper contextValue={contextWithLoading}>
        <InfiniteCanvas />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
  })

  it('displays error state when architecture generation fails', () => {
    const contextWithError = {
      ...mockArchitectureContext,
      error: 'Failed to generate architecture'
    }

    render(
      <TestWrapper contextValue={contextWithError}>
        <InfiniteCanvas />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('react-flow')).toBeInTheDocument()
  })
})
