# Feature: Integrate Kiro CLI Agents for Architecture Generation

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Replace the mock architecture generation in NimbusAI with real Kiro CLI agent integration using the text_to_infra workflow. This enables users to generate actual AWS architectures through the 7-step Kiro workflow: architecture planning, diagram generation, Terraform export, cost estimation, security auditing, architecture explanation, and UI design.

## User Story

As a NimbusAI user
I want to generate real AWS architectures using Kiro CLI agents
So that I can create production-ready, auditable infrastructure designs with accurate cost estimates and security validations

## Problem Statement

Currently, NimbusAI uses mock data for architecture generation (see ArchitectureContext.tsx line 52-85). Users cannot generate real architectures, limiting the application's value as a cloud architecture tool. The text_to_infra workflow exists in .kiro/settings/text_to_infra.yaml but is not integrated with the frontend.

## Solution Statement

Implement a secure Node.js CLI integration layer that executes the Kiro text_to_infra workflow, streams real-time progress updates to the frontend, and processes the multi-step workflow results into the existing canvas visualization system.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: High
**Primary Systems Affected**: ArchitectureContext, API Routes, CLI Integration
**Dependencies**: Kiro CLI, Node.js child_process, Server-Sent Events

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `src/contexts/ArchitectureContext.tsx` (lines 52-85) - Why: Contains mock generateArchitecture function to replace
- `src/components/layout/TopBar.tsx` (lines 15-25) - Why: Shows prompt input and generate button integration
- `src/components/InfiniteCanvas.tsx` (lines 30-70) - Why: Architecture visualization and node creation patterns
- `.kiro/settings/text_to_infra.yaml` - Why: Defines the 7-step workflow structure
- `.kiro/prompts/01_architecture_planner.md` - Why: Shows expected JSON output format
- `src/lib/awsServices.ts` - Why: Service mapping and category definitions
- `src/types/aws.ts` - Why: Type definitions for AWS services
- `src/types/canvas.ts` - Why: Canvas node data structures

### New Files to Create

- `src/lib/kiro-cli.ts` - Kiro CLI wrapper with type safety and error handling
- `src/app/api/architecture/generate/route.ts` - Streaming API route for workflow execution
- `src/hooks/useArchitectureStream.ts` - React hook for streaming architecture generation
- `src/types/kiro.ts` - Type definitions for Kiro workflow responses
- `src/middleware/security.ts` - Input validation and rate limiting

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Node.js Child Process](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options)
  - Specific section: spawn() method and stdio options
  - Why: Required for secure CLI execution
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
  - Specific section: Streaming responses
  - Why: Needed for real-time workflow progress
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
  - Specific section: EventSource API
  - Why: Client-side streaming integration

### Patterns to Follow

**Error Handling Pattern:**
```typescript
// From existing codebase pattern
try {
  // operation
} catch (error) {
  console.error('Failed to...:', error)
  // cleanup
} finally {
  setIsGenerating(false)
}
```

**Async State Management:**
```typescript
// From ArchitectureContext.tsx lines 52-85
const [isGenerating, setIsGenerating] = useState(false)
setIsGenerating(true)
// async operation
setIsGenerating(false)
```

**Type Safety Pattern:**
```typescript
// From existing types/aws.ts
interface AWSService {
  id: string
  name: string
  category: AWSServiceCategory
  // ...
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Set up CLI integration infrastructure and type definitions before implementing workflow execution.

**Tasks:**
- Create Kiro CLI wrapper with secure command execution
- Define TypeScript interfaces for workflow responses
- Implement input validation and sanitization
- Set up error handling and logging patterns

### Phase 2: Core Integration

Implement the main CLI workflow execution and API integration.

**Tasks:**
- Create streaming API route for workflow execution
- Implement workflow step parsing and progress tracking
- Add timeout and error recovery mechanisms
- Integrate with existing ArchitectureContext

### Phase 3: Frontend Integration

Connect the streaming workflow to the React frontend with real-time updates.

**Tasks:**
- Create React hook for streaming architecture generation
- Update ArchitectureContext to use real CLI integration
- Add progress indicators and error states to UI
- Implement workflow cancellation

### Phase 4: Testing & Validation

Ensure robust error handling and validate against all workflow steps.

**Tasks:**
- Test each workflow step individually
- Validate JSON parsing and type safety
- Test error scenarios and recovery
- Verify canvas integration with real data

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE src/types/kiro.ts

- **IMPLEMENT**: TypeScript interfaces for Kiro workflow responses
- **PATTERN**: Mirror existing types/aws.ts structure
- **IMPORTS**: None required
- **GOTCHA**: Match exact JSON structure from 01_architecture_planner.md
- **VALIDATE**: `npx tsc --noEmit`

### CREATE src/lib/kiro-cli.ts

- **IMPLEMENT**: Secure CLI wrapper with spawn() and streaming support
- **PATTERN**: Follow async/await pattern from ArchitectureContext.tsx
- **IMPORTS**: `import { spawn } from 'child_process'`
- **GOTCHA**: Handle CLI not installed, timeout scenarios, and stderr parsing
- **VALIDATE**: `node -e "require('./src/lib/kiro-cli.ts')"`

### CREATE src/middleware/security.ts

- **IMPLEMENT**: Input validation, rate limiting, and sanitization
- **PATTERN**: Use try/catch pattern from existing error handling
- **IMPORTS**: None required for basic validation
- **GOTCHA**: Prevent command injection, validate prompt length
- **VALIDATE**: `npx tsc --noEmit`

### CREATE src/app/api/architecture/generate/route.ts

- **IMPLEMENT**: Next.js API route with Server-Sent Events streaming
- **PATTERN**: Follow Next.js 14 App Router API pattern
- **IMPORTS**: `import { NextRequest } from 'next/server'`
- **GOTCHA**: Proper SSE headers, error handling, and stream cleanup
- **VALIDATE**: `curl -N http://localhost:3000/api/architecture/generate`

### CREATE src/hooks/useArchitectureStream.ts

- **IMPLEMENT**: React hook for EventSource integration
- **PATTERN**: Mirror useState pattern from ArchitectureContext.tsx
- **IMPORTS**: `import { useEffect, useState } from 'react'`
- **GOTCHA**: Cleanup EventSource on unmount, handle connection errors
- **VALIDATE**: Test in React component

### UPDATE src/contexts/ArchitectureContext.tsx

- **IMPLEMENT**: Replace mock generateArchitecture with real CLI integration
- **PATTERN**: Keep existing interface, replace implementation (lines 52-85)
- **IMPORTS**: `import { executeKiroWorkflow } from '@/lib/kiro-cli'`
- **GOTCHA**: Maintain backward compatibility with existing UI components
- **VALIDATE**: Test Generate button functionality

### UPDATE src/components/layout/TopBar.tsx

- **IMPLEMENT**: Add progress indicators and error states
- **PATTERN**: Follow existing Button and loading state patterns
- **IMPORTS**: Add progress-related icons from lucide-react
- **GOTCHA**: Handle streaming states and cancellation
- **VALIDATE**: Test UI states during generation

### UPDATE package.json

- **IMPLEMENT**: Add any missing dependencies for CLI integration
- **PATTERN**: Follow existing dependency structure
- **IMPORTS**: None
- **GOTCHA**: Ensure compatibility with Next.js 14
- **VALIDATE**: `npm install && npm run build`

---

## TESTING STRATEGY

### Unit Tests

Test CLI wrapper, validation middleware, and React hooks in isolation using Jest framework (to be added).

Design unit tests with mocked child_process and EventSource:
- CLI command execution and error handling
- Input validation and sanitization
- Stream parsing and progress tracking
- React hook state management

### Integration Tests

Test complete workflow from API route to frontend integration:
- End-to-end architecture generation
- Streaming progress updates
- Error recovery and timeout handling
- Canvas visualization with real data

### Edge Cases

- Kiro CLI not installed or wrong version
- Invalid JSON responses from workflow steps
- Network interruptions during streaming
- Concurrent workflow executions
- Large architecture responses exceeding limits

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npm run build
```

### Level 2: Unit Tests

```bash
# After adding Jest
npm test -- --coverage
```

### Level 3: Integration Tests

```bash
# Start dev server
npm run dev

# Test API endpoint
curl -N -X POST http://localhost:3000/api/architecture/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a simple web application"}'

# Test Kiro CLI availability
kiro-cli --version
```

### Level 4: Manual Validation

- Open http://localhost:3000
- Enter architecture prompt in TopBar input
- Click Generate button
- Verify streaming progress indicators
- Confirm architecture appears on canvas
- Test error scenarios (invalid prompts, CLI errors)

### Level 5: Additional Validation

```bash
# Validate workflow configuration
kiro-cli agent validate

# Test text_to_infra workflow directly
echo "Build a simple web app" | kiro-cli --workflow text_to_infra
```

---

## ACCEPTANCE CRITERIA

- [ ] Generate button executes real Kiro CLI text_to_infra workflow
- [ ] All 7 workflow steps stream progress to frontend
- [ ] Architecture JSON is parsed and visualized on canvas
- [ ] Error handling covers CLI failures and invalid responses
- [ ] UI shows loading states and progress indicators
- [ ] Workflow can be cancelled by user
- [ ] Input validation prevents command injection
- [ ] Rate limiting prevents abuse
- [ ] No regressions in existing drag-and-drop functionality
- [ ] TypeScript compilation passes with no errors
- [ ] All validation commands execute successfully

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in dependency order
- [ ] Each task validation passed immediately
- [ ] CLI integration works with real Kiro installation
- [ ] Streaming API provides real-time feedback
- [ ] Frontend displays actual architecture data
- [ ] Error scenarios handled gracefully
- [ ] Security validation prevents injection attacks
- [ ] Performance acceptable for typical workflows
- [ ] Code follows existing project patterns
- [ ] Documentation updated for new integration

---

## NOTES

**Security Considerations:**
- All user inputs must be validated and sanitized
- CLI execution should be isolated and timeout-protected
- Rate limiting prevents resource exhaustion
- Error messages should not expose system information

**Performance Considerations:**
- Workflow execution may take 30-60 seconds
- Streaming prevents UI blocking during generation
- Consider caching for repeated identical prompts
- Monitor memory usage during CLI execution

**Future Enhancements:**
- Workflow step customization (skip certain steps)
- Multiple architecture comparison
- Export integration (Terraform, CloudFormation)
- Cost estimation integration with real AWS pricing
