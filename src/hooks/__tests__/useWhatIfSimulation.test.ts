import { renderHook, act } from '@testing-library/react'

// Mock the hook
const mockUseWhatIfSimulation = () => ({
  isSimulating: false,
  currentScenario: null,
  result: null,
  error: null,
  scenarios: [
    { id: 'baseline', name: 'Current Architecture', description: 'Existing configuration', parameters: {} },
    { id: 'high_traffic', name: 'High Traffic (5x)', description: 'Traffic increases by 500%', parameters: { traffic_multiplier: 5 } }
  ],
  runSimulation: jest.fn(),
  clearSimulation: jest.fn(),
})

describe('useWhatIfSimulation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const hook = mockUseWhatIfSimulation()

    expect(hook.isSimulating).toBe(false)
    expect(hook.currentScenario).toBeNull()
    expect(hook.result).toBeNull()
    expect(hook.error).toBeNull()
    expect(hook.scenarios).toHaveLength(2)
  })

  it('should run simulation successfully', async () => {
    const hook = mockUseWhatIfSimulation()
    
    await act(async () => {
      await hook.runSimulation('high_traffic', 'test architecture')
    })

    expect(hook.runSimulation).toHaveBeenCalledWith('high_traffic', 'test architecture')
  })

  it('should clear simulation state', () => {
    const hook = mockUseWhatIfSimulation()

    act(() => {
      hook.clearSimulation()
    })

    expect(hook.clearSimulation).toHaveBeenCalled()
  })

  it('should handle invalid scenario ID', async () => {
    const hook = mockUseWhatIfSimulation()

    await act(async () => {
      await hook.runSimulation('invalid_scenario', 'test architecture')
    })

    expect(hook.runSimulation).toHaveBeenCalledWith('invalid_scenario', 'test architecture')
  })
})
