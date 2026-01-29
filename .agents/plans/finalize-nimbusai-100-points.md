# Feature: Finalize NimbusAI for 100 Points

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Complete the NimbusAI hackathon submission by filling empty steering documents with expert AWS rules, replacing mock simulation data with real Kiro agent logic, and creating a comprehensive Jest unit test suite to achieve the perfect 100/100 score.

## User Story

As a hackathon judge
I want to see a production-ready NimbusAI with complete documentation, real agent integration, and comprehensive testing
So that I can award the full 100 points for application quality, Kiro CLI usage, and code completeness

## Problem Statement

NimbusAI currently has gaps that prevent it from achieving a perfect score:
1. Some steering documents may be incomplete or lack expert-level AWS guidance
2. Simulation features use mock data instead of real Kiro agent integration
3. Jest test suite needs to be comprehensive and actually executable
4. Missing production-ready error handling and validation

## Solution Statement

Systematically complete all missing components by leveraging AWS Well-Architected Framework expertise, implementing real Kiro CLI agent workflows, and creating a robust test suite that validates all functionality.

## Feature Metadata

**Feature Type**: Enhancement/Completion
**Estimated Complexity**: High
**Primary Systems Affected**: Steering documents, Kiro CLI integration, Testing infrastructure, Agent workflows
**Dependencies**: Jest, Kiro CLI, AWS expertise, existing codebase patterns

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `.kiro/steering/architecture.md` (lines 1-50) - Why: Contains existing AWS architecture patterns to extend
- `.kiro/steering/infra-rules.md` (lines 1-60) - Why: Infrastructure rules pattern to follow
- `src/lib/kiro-cli.ts` (lines 1-150) - Why: Existing Kiro CLI integration patterns
- `src/hooks/useWhatIfSimulation.ts` (lines 1-100) - Why: Current mock implementation to replace
- `jest.config.js` - Why: Jest configuration and coverage requirements
- `src/hooks/__tests__/useWhatIfSimulation.test.ts` - Why: Existing test patterns to follow

### New Files to Create

- `.kiro/steering/aws-well-architected.md` - Comprehensive AWS Well-Architected Framework rules
- `.kiro/steering/cost-optimization.md` - Expert cost optimization strategies
- `.kiro/steering/security-best-practices.md` - AWS security best practices
- `src/lib/real-kiro-agents.ts` - Real Kiro agent integration replacing mocks
- `src/app/api/simulation/route.ts` - Real simulation API using Kiro agents
- Additional comprehensive test files for full coverage

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
  - Specific section: All 6 pillars overview
  - Why: Required for creating expert-level steering documents
- [AWS Cost Optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
  - Specific section: Cost optimization strategies
  - Why: Needed for cost optimization steering document
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
  - Specific section: Testing React components
  - Why: Required for comprehensive test suite

### Patterns to Follow

**Kiro Agent Integration Pattern:**
```typescript
// From existing kiro-cli.ts
const architecturePrompt = `@01_architecture_planner\n\n${prompt}\n\nPlease provide the response in the exact JSON format specified in your prompt.`
```

**Testing Pattern:**
```typescript
// From existing test files
import { renderHook, act } from '@testing-library/react'
jest.mock('child_process')
```

**Steering Document Pattern:**
```markdown
# Title
## Section
- Bullet points with specific rules
- Technical specifications
- Implementation guidelines
```

---

## IMPLEMENTATION PLAN

### Phase 1: Expert AWS Steering Documents

Complete the steering documents with production-ready AWS expertise based on Well-Architected Framework.

### Phase 2: Real Kiro Agent Integration

Replace mock simulation data with actual Kiro CLI agent calls for authentic multi-agent workflows.

### Phase 3: Comprehensive Test Suite

Create complete Jest test coverage for all components, hooks, and utilities.

### Phase 4: Production Validation

Ensure all validation commands pass and the application is production-ready.

---

## STEP-BY-STEP TASKS

### CREATE .kiro/steering/aws-well-architected.md

- **IMPLEMENT**: Comprehensive AWS Well-Architected Framework rules with all 6 pillars
- **PATTERN**: Follow existing steering document format from architecture.md
- **CONTENT**: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability
- **VALIDATE**: `grep -c "##" .kiro/steering/aws-well-architected.md` (should be 6+ sections)

### CREATE .kiro/steering/cost-optimization.md

- **IMPLEMENT**: Expert-level AWS cost optimization strategies
- **PATTERN**: Mirror infra-rules.md structure with specific cost rules
- **CONTENT**: Reserved Instances, Spot Instances, Storage Classes, Right-sizing, Monitoring
- **VALIDATE**: `wc -l .kiro/steering/cost-optimization.md` (should be 50+ lines)

### CREATE .kiro/steering/security-best-practices.md

- **IMPLEMENT**: AWS security best practices and compliance guidelines
- **PATTERN**: Follow api-rules.md security-first approach
- **CONTENT**: IAM, Encryption, Network Security, Monitoring, Compliance
- **VALIDATE**: `grep -c "encryption\|IAM\|security" .kiro/steering/security-best-practices.md` (should be 10+)

### CREATE src/lib/real-kiro-agents.ts

- **IMPLEMENT**: Real Kiro agent integration for all 7 agents
- **PATTERN**: Extend existing kiro-cli.ts patterns
- **IMPORTS**: spawn, KiroWorkflowError, agent prompt references
- **FUNCTIONS**: executeArchitecturePlanner, executeCostAnalyst, executeSecurityAuditor, etc.
- **VALIDATE**: `npm run build` (should compile without errors)

### CREATE src/app/api/simulation/route.ts

- **IMPLEMENT**: Real simulation API using Kiro agents instead of mocks
- **PATTERN**: Mirror existing API route structure
- **IMPORTS**: real-kiro-agents functions, NextRequest, NextResponse
- **LOGIC**: Call appropriate Kiro agents based on simulation scenario
- **VALIDATE**: `curl -X POST http://localhost:3000/api/simulation -d '{"test":true}'` (should return JSON)

### UPDATE src/hooks/useWhatIfSimulation.ts

- **IMPLEMENT**: Replace mock API calls with real Kiro agent integration
- **PATTERN**: Keep existing hook interface, update implementation
- **IMPORTS**: Add real-kiro-agents imports
- **LOGIC**: Use actual agent responses instead of mock data
- **VALIDATE**: `npm run test -- useWhatIfSimulation.test.ts`

### CREATE src/components/__tests__/InfiniteCanvas.test.tsx

- **IMPLEMENT**: Comprehensive tests for InfiniteCanvas component
- **PATTERN**: Follow existing component test patterns
- **IMPORTS**: @testing-library/react, jest mocks for ReactFlow
- **TESTS**: Rendering, node creation, edge handling, error states
- **VALIDATE**: `npm run test -- InfiniteCanvas.test.tsx`

### CREATE src/components/__tests__/BYOAPIPanel.test.tsx

- **IMPLEMENT**: Complete test coverage for BYO-API functionality
- **PATTERN**: Mirror existing hook test structure
- **TESTS**: Credential validation, UI interactions, error handling
- **VALIDATE**: `npm run test -- BYOAPIPanel.test.tsx`

### CREATE src/contexts/__tests__/ArchitectureContext.test.tsx

- **IMPLEMENT**: Context provider and consumer tests
- **PATTERN**: React context testing patterns
- **TESTS**: Provider functionality, state management, context updates
- **VALIDATE**: `npm run test -- ArchitectureContext.test.tsx`

### UPDATE jest.setup.js

- **IMPLEMENT**: Add comprehensive mocks for all external dependencies
- **PATTERN**: Extend existing mock setup
- **MOCKS**: ReactFlow, child_process, fetch, localStorage
- **VALIDATE**: `npm run test` (all tests should run)

### CREATE src/lib/__tests__/real-kiro-agents.test.ts

- **IMPLEMENT**: Unit tests for all Kiro agent integration functions
- **PATTERN**: Follow kiro-cli.test.ts structure
- **TESTS**: Each agent function, error handling, timeout scenarios
- **VALIDATE**: `npm run test -- real-kiro-agents.test.ts`

---

## TESTING STRATEGY

### Unit Tests

- **Coverage Target**: 90%+ for all new files
- **Framework**: Jest + React Testing Library
- **Mocking**: Mock child_process, fetch, external APIs
- **Assertions**: Test both success and error scenarios

### Integration Tests

- **API Routes**: Test all endpoints with real request/response cycles
- **Component Integration**: Test component interactions with contexts
- **Kiro CLI Integration**: Test agent workflow orchestration

### Edge Cases

- Network failures during Kiro CLI calls
- Invalid JSON responses from agents
- Timeout scenarios for long-running simulations
- Invalid user inputs and credential validation
- Canvas performance with large architectures

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npm run lint
npm run build
npx tsc --noEmit
```

### Level 2: Unit Tests

```bash
npm run test
npm run test:coverage
```

### Level 3: Integration Tests

```bash
npm run dev &
sleep 5
curl -X POST http://localhost:3000/api/architecture/generate -H "Content-Type: application/json" -d '{"prompt":"test"}'
curl -X POST http://localhost:3000/api/simulation -H "Content-Type: application/json" -d '{"scenario":{"id":"test"},"architecturePrompt":"test"}'
pkill -f "next dev"
```

### Level 4: Manual Validation

```bash
# Test Kiro CLI integration
kiro-cli chat "@01_architecture_planner" <<< "Build a simple web application"
# Test steering document completeness
find .kiro/steering -name "*.md" -exec wc -l {} \;
# Test coverage thresholds
npm run test:coverage | grep "All files"
```

---

## ACCEPTANCE CRITERIA

- [ ] All steering documents contain expert-level AWS guidance (50+ lines each)
- [ ] Real Kiro agent integration replaces all mock data
- [ ] Jest test suite achieves 90%+ coverage
- [ ] All validation commands pass with zero errors
- [ ] Simulation API uses actual Kiro agents
- [ ] What-if scenarios generate real cost and security analysis
- [ ] Error handling covers all edge cases
- [ ] Performance meets requirements (canvas with 100+ nodes)
- [ ] Security considerations fully addressed
- [ ] Documentation updated to reflect real functionality

---

## COMPLETION CHECKLIST

- [ ] AWS Well-Architected steering document created (6 pillars)
- [ ] Cost optimization steering document created
- [ ] Security best practices steering document created
- [ ] Real Kiro agent integration implemented
- [ ] Simulation API uses real agents
- [ ] Comprehensive test suite created (90%+ coverage)
- [ ] All validation commands pass
- [ ] Manual testing confirms real functionality
- [ ] No mock data remaining in production code
- [ ] Performance optimized for large architectures

---

## NOTES

**Key Success Factors:**
- Steering documents must contain production-ready AWS expertise
- Kiro agent integration must be authentic, not simulated
- Test coverage must be comprehensive and meaningful
- All functionality must work with real Kiro CLI

**Risk Mitigation:**
- Test Kiro CLI availability before implementing agent calls
- Implement proper error handling for agent failures
- Ensure graceful degradation when agents are unavailable
- Maintain backward compatibility during transition from mocks

**Quality Assurance:**
- Each steering document should be reviewed against AWS documentation
- Agent integration should be tested with actual Kiro CLI
- Test suite should cover both happy path and error scenarios
- Performance testing with realistic data volumes
