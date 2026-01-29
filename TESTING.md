# NimbusAI Testing Guide

## Overview
This document outlines the comprehensive testing strategy for NimbusAI, including unit tests, integration tests, and testing best practices.

## Test Structure

### Unit Tests
- **Location**: `src/**/__tests__/` and `src/**/*.test.ts`
- **Framework**: Jest + React Testing Library
- **Coverage**: 80% minimum across all metrics

### Test Categories

#### 1. Kiro CLI Integration Tests
- `src/lib/__tests__/kiro-cli.test.ts`
- Tests workflow execution, streaming, and error handling
- Mocks child_process for isolated testing

#### 2. Hook Tests
- `src/hooks/__tests__/useWhatIfSimulation.test.ts`
- `src/hooks/__tests__/useArchitectureGeneration.test.ts`
- Tests React hooks with proper state management

#### 3. Utility Tests
- `src/lib/__tests__/utils.test.ts`
- `src/lib/__tests__/awsServices.test.ts`
- Tests pure functions and data structures

#### 4. API Route Tests
- `src/app/api/architecture/generate/__tests__/route.test.ts`
- Tests Next.js API routes with proper request/response handling

## Running Tests

### Quick Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run full test suite (includes linting and type checking)
./test.sh
```

### Coverage Requirements
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- JSDOM environment for React components
- Custom setup file for global mocks

### Setup File (`jest.setup.js`)
- Global test utilities
- Mock configurations for Next.js router, child_process, and React Flow
- ResizeObserver mock for browser APIs

## Mocking Strategy

### External Dependencies
- **child_process**: Mocked for Kiro CLI integration
- **Next.js router**: Mocked for navigation testing
- **React Flow**: Mocked for canvas components

### Test Utilities
- Custom render functions for React components
- Mock data generators for consistent test data
- Helper functions for async testing

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Async Testing
- Use proper async/await patterns
- Handle promises and streams correctly
- Test both success and error scenarios

### 3. Mock Management
- Clear mocks between tests
- Use specific mocks for each test case
- Avoid over-mocking

### 4. Coverage Goals
- Focus on critical business logic
- Test edge cases and error conditions
- Maintain high coverage without sacrificing quality

## Continuous Integration

### Pre-commit Hooks
- Run linting and type checking
- Execute fast unit tests
- Prevent commits with failing tests

### CI Pipeline
- Full test suite execution
- Coverage reporting
- Performance regression testing

## Debugging Tests

### Common Issues
1. **Async timing**: Use proper async/await patterns
2. **Mock cleanup**: Ensure mocks are cleared between tests
3. **DOM cleanup**: Use proper cleanup in React tests

### Debug Commands
```bash
# Run specific test file
npm test -- useWhatIfSimulation.test.ts

# Run tests with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="should run simulation successfully"
```

## Future Enhancements

### Planned Additions
- E2E tests with Playwright
- Visual regression testing
- Performance benchmarking
- Integration tests with real Kiro CLI

### Test Data Management
- Fixture files for consistent test data
- Factory functions for generating test objects
- Snapshot testing for complex outputs
