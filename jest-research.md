# Jest Testing Framework Research for Next.js TypeScript Projects

## 1. Basic Jest Setup for Next.js TypeScript

### Installation
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm install --save-dev @types/jest ts-jest
```

### Configuration Files

**jest.config.js**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**jest.setup.js**
```javascript
import '@testing-library/jest-dom'
```

**tsconfig.json** (add to compilerOptions)
```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

## 2. Testing React Components

### Basic Component Testing
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Components with Context
```typescript
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/ThemeContext'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('ThemedComponent', () => {
  it('applies theme styles', () => {
    renderWithTheme(<ThemedComponent />)
    // assertions
  })
})
```

## 3. Testing React Hooks

### Custom Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

### Testing Hooks with Dependencies
```typescript
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApiData } from '@/hooks/useApiData'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useApiData', () => {
  it('fetches data successfully', async () => {
    const { result, waitFor } = renderHook(() => useApiData('test-id'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
```

## 4. Testing API Routes

### Next.js API Route Testing
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/users'

describe('/api/users', () => {
  it('returns users on GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        users: expect.any(Array),
      })
    )
  })

  it('handles POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'John Doe', email: 'john@example.com' },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(201)
  })
})
```

### Testing with Database Mocks
```typescript
import { prismaMock } from '@/lib/__mocks__/prisma'
import handler from '@/pages/api/users'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}))

describe('/api/users', () => {
  it('creates user in database', async () => {
    const userData = { name: 'John', email: 'john@test.com' }
    prismaMock.user.create.mockResolvedValue({ id: 1, ...userData })

    const { req, res } = createMocks({
      method: 'POST',
      body: userData,
    })

    await handler(req, res)

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: userData,
    })
  })
})
```

## 5. Testing Utility Functions

### Pure Function Testing
```typescript
import { formatCurrency, validateEmail } from '@/utils/helpers'

describe('formatCurrency', () => {
  it('formats USD currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('handles zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })
})

describe('validateEmail', () => {
  it('validates correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('rejects invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
```

### Testing Async Utilities
```typescript
import { fetchWithRetry } from '@/utils/api'

// Mock fetch
global.fetch = jest.fn()

describe('fetchWithRetry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('succeeds on first attempt', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'success' }),
    })

    const result = await fetchWithRetry('/api/test')
    expect(result).toEqual({ data: 'success' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('retries on failure', async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' }),
      })

    const result = await fetchWithRetry('/api/test', { retries: 2 })
    expect(result).toEqual({ data: 'success' })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
```

## 6. Testing React Flow Components

### Basic React Flow Testing
```typescript
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from 'reactflow'
import FlowCanvas from '@/components/FlowCanvas'

const renderWithReactFlow = (ui: React.ReactElement) => {
  return render(
    <ReactFlowProvider>
      {ui}
    </ReactFlowProvider>
  )
}

describe('FlowCanvas', () => {
  it('renders nodes correctly', () => {
    const nodes = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }
    ]
    
    renderWithReactFlow(<FlowCanvas nodes={nodes} edges={[]} />)
    expect(screen.getByText('Node 1')).toBeInTheDocument()
  })
})
```

### Testing Custom Node Components
```typescript
import { render } from '@testing-library/react'
import CustomNode from '@/components/nodes/CustomNode'

describe('CustomNode', () => {
  const mockData = {
    label: 'Test Node',
    type: 'aws-ec2',
    config: { instanceType: 't3.micro' }
  }

  it('renders node with correct data', () => {
    render(<CustomNode data={mockData} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
    expect(screen.getByText('t3.micro')).toBeInTheDocument()
  })
})
```

### Testing Flow Interactions
```typescript
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactFlowProvider } from 'reactflow'
import FlowEditor from '@/components/FlowEditor'

describe('FlowEditor interactions', () => {
  it('adds node on button click', async () => {
    const { container } = render(
      <ReactFlowProvider>
        <FlowEditor />
      </ReactFlowProvider>
    )

    const addButton = screen.getByRole('button', { name: /add node/i })
    await userEvent.click(addButton)

    expect(container.querySelector('.react-flow__node')).toBeInTheDocument()
  })
})
```

## 7. Testing Framer Motion Animations

### Setup for Animation Testing
```typescript
// jest.setup.js
import { jest } from '@jest/globals'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    // Add other elements as needed
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))
```

### Testing Animated Components
```typescript
import { render, screen } from '@testing-library/react'
import AnimatedCard from '@/components/AnimatedCard'

describe('AnimatedCard', () => {
  it('renders content correctly', () => {
    render(<AnimatedCard>Test Content</AnimatedCard>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies animation props', () => {
    const { container } = render(
      <AnimatedCard initial={{ opacity: 0 }}>
        Content
      </AnimatedCard>
    )
    
    // Test that the component renders (animation logic is mocked)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

### Testing Animation Triggers
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExpandablePanel from '@/components/ExpandablePanel'

// Mock intersection observer for scroll-triggered animations
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe('ExpandablePanel', () => {
  it('toggles expanded state', async () => {
    render(<ExpandablePanel title="Test Panel">Content</ExpandablePanel>)
    
    const trigger = screen.getByRole('button', { name: /test panel/i })
    await userEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeVisible()
    })
  })
})
```

## 8. Testing CLI Integrations

### Testing CLI Command Functions
```typescript
import { execSync } from 'child_process'
import { runKiroCommand } from '@/lib/cli'

// Mock child_process
jest.mock('child_process')
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>

describe('runKiroCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('executes kiro command successfully', async () => {
    mockExecSync.mockReturnValue(Buffer.from('{"status": "success"}'))

    const result = await runKiroCommand('generate', { type: 'infrastructure' })
    
    expect(mockExecSync).toHaveBeenCalledWith(
      'kiro-cli generate --type infrastructure',
      expect.any(Object)
    )
    expect(result).toEqual({ status: 'success' })
  })

  it('handles command errors', async () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed')
    })

    await expect(runKiroCommand('invalid')).rejects.toThrow('Command failed')
  })
})
```

### Testing CLI Output Parsing
```typescript
import { parseKiroOutput } from '@/lib/cli-parser'

describe('parseKiroOutput', () => {
  it('parses successful terraform output', () => {
    const output = `
      Plan: 3 to add, 0 to change, 0 to destroy.
      {"resources": [{"type": "aws_instance", "name": "web"}]}
    `

    const result = parseKiroOutput(output)
    expect(result.planSummary).toContain('3 to add')
    expect(result.resources).toHaveLength(1)
  })

  it('handles error output', () => {
    const output = 'Error: Invalid configuration'
    
    const result = parseKiroOutput(output)
    expect(result.error).toBe('Invalid configuration')
  })
})
```

## 9. Advanced Testing Patterns

### Testing with MSW (Mock Service Worker)
```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/infrastructure', (req, res, ctx) => {
    return res(ctx.json({ resources: [] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Snapshot Testing for Complex Components
```typescript
import { render } from '@testing-library/react'
import InfrastructureDiagram from '@/components/InfrastructureDiagram'

describe('InfrastructureDiagram', () => {
  it('matches snapshot', () => {
    const props = {
      nodes: [{ id: '1', type: 'aws-ec2', data: { label: 'Web Server' } }],
      edges: []
    }
    
    const { container } = render(<InfrastructureDiagram {...props} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

### Testing Error Boundaries
```typescript
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('catches and displays errors', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
})
```

## 10. Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Key Best Practices

1. **Use Testing Library queries in order of priority**: getByRole > getByLabelText > getByText
2. **Mock external dependencies** at the module level
3. **Test behavior, not implementation details**
4. **Use descriptive test names** that explain the expected behavior
5. **Group related tests** with describe blocks
6. **Clean up after tests** with beforeEach/afterEach hooks
7. **Use custom render functions** for components with providers
8. **Test error states** and edge cases
9. **Keep tests focused** - one assertion per test when possible
10. **Use snapshot testing sparingly** - only for stable, complex output