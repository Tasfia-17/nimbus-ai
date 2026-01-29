# Feature: Add What-if Simulation Toggle and AWS Well-Architected Score Display

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Enhance the Cost HUD (CostCard component) and create Security panels by adding a 'What-if' Simulation toggle that allows users to compare different architecture scenarios, and display AWS Well-Architected Framework scores with visual indicators for security, cost optimization, and reliability pillars.

## User Story

As a cloud architect using NimbusAI
I want to see AWS Well-Architected scores and run what-if simulations on my architecture
So that I can make informed decisions about cost optimization, security improvements, and reliability enhancements before deploying to production

## Problem Statement

Currently, the CostCard component shows static cost data without the ability to simulate different scenarios or view Well-Architected Framework scores. Users cannot explore "what-if" scenarios (like traffic spikes, multi-AZ deployments, or instance type changes) or understand how their architecture performs against AWS best practices across security, cost, and reliability dimensions.

## Solution Statement

Implement an interactive What-if simulation toggle in the CostCard that allows scenario comparison, and add Well-Architected score visualization with circular progress indicators. Create a new SecurityPanel component to display security-specific metrics and recommendations. Integrate with the existing Kiro CLI workflow to leverage the cost analyst and security auditor agents.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: CostCard, ArchitectureContext, Kiro Integration, New SecurityPanel
**Dependencies**: Existing Kiro CLI integration, framer-motion, lucide-react icons

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `src/components/layout/CostCard.tsx` (lines 1-108) - Why: Base component to enhance with what-if simulation and Well-Architected scores
- `src/contexts/ArchitectureContext.tsx` (lines 12-22) - Why: Contains well_architected_score structure that needs to be displayed
- `src/types/kiro.ts` (lines 8-14) - Why: KiroWellArchitectedScore interface definition
- `.kiro/prompts/04_cost_analyst.md` (lines 8-18) - Why: Shows simulation_comparison structure for what-if scenarios
- `.kiro/prompts/05_security_auditor.md` - Why: Security recommendations and audit structure
- `src/lib/kiro-cli.ts` (lines 1-187) - Why: CLI integration patterns for extending with simulation calls
- `src/hooks/useArchitectureStream.ts` (lines 1-156) - Why: Streaming patterns for real-time simulation updates

### New Files to Create

- `src/components/layout/SecurityPanel.tsx` - Security-focused panel with Well-Architected security scores
- `src/hooks/useWhatIfSimulation.ts` - React hook for managing simulation scenarios and state
- `src/types/simulation.ts` - TypeScript interfaces for simulation data structures
- `src/components/ui/ScoreIndicator.tsx` - Reusable circular progress component for Well-Architected scores
- `src/components/ui/SimulationToggle.tsx` - Toggle component for what-if scenario selection

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Framer Motion Animations](https://www.framer.com/motion/animation/)
  - Specific section: AnimatePresence and layout animations
  - Why: Required for smooth what-if simulation transitions
- [React Hook Patterns](https://react.dev/reference/react/hooks)
  - Specific section: Custom hooks and state management
  - Why: Needed for useWhatIfSimulation hook implementation
- [Tailwind CSS Utilities](https://tailwindcss.com/docs/utility-first)
  - Specific section: Responsive design and color utilities
  - Why: Consistent styling with existing glassmorphism theme

### Patterns to Follow

**Glassmorphism Styling Pattern:**
```typescript
// From existing CostCard.tsx
className="glass rounded-lg border border-white/10"
style={{ background: 'rgba(255, 255, 255, 0.08)' }}
```

**Animation Pattern:**
```typescript
// From CostCard.tsx lines 65-70
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.2 }}
>
```

**Context Usage Pattern:**
```typescript
// From ArchitectureContext.tsx lines 35-45
const { 
  isGenerating, 
  result, 
  error, 
  progress: workflowProgress,
  generateArchitecture: streamGenerate 
} = useArchitectureStream()
```

**Icon and Color Pattern:**
```typescript
// From CostCard.tsx lines 35-40
<DollarSign className="w-5 h-5 text-gold" />
<span className="text-sm text-green-400">-${costData.savings}</span>
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

Set up type definitions and base components for simulation and scoring functionality.

**Tasks:**
- Create TypeScript interfaces for simulation scenarios and Well-Architected scores
- Build reusable ScoreIndicator component for circular progress displays
- Create SimulationToggle component with glassmorphism styling
- Set up useWhatIfSimulation hook structure

### Phase 2: Core Implementation

Implement the main what-if simulation logic and Well-Architected score display.

**Tasks:**
- Enhance CostCard with simulation toggle and scenario comparison
- Add Well-Architected score visualization to CostCard
- Create SecurityPanel component with security-specific metrics
- Implement simulation workflow integration with Kiro CLI

### Phase 3: Integration

Connect simulation functionality with existing architecture generation workflow.

**Tasks:**
- Extend ArchitectureContext with simulation state
- Integrate with cost analyst and security auditor agents
- Add real-time simulation updates via streaming API
- Connect SecurityPanel to architecture data

### Phase 4: Polish & Validation

Add animations, error handling, and comprehensive testing.

**Tasks:**
- Implement smooth transitions for scenario switching
- Add loading states and error handling for simulations
- Validate integration with existing workflow
- Test responsive design and accessibility

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE src/types/simulation.ts

- **IMPLEMENT**: TypeScript interfaces for simulation scenarios and Well-Architected data
- **PATTERN**: Mirror existing types/kiro.ts structure (lines 1-46)
- **IMPORTS**: None required
- **GOTCHA**: Match exact structure from 04_cost_analyst.md simulation_comparison format
- **VALIDATE**: `npx tsc --noEmit`

### CREATE src/components/ui/ScoreIndicator.tsx

- **IMPLEMENT**: Circular progress component for Well-Architected scores with glassmorphism styling
- **PATTERN**: Follow Card.tsx component structure (lines 1-42)
- **IMPORTS**: `import { motion } from 'framer-motion'`
- **GOTCHA**: Use CSS conic-gradient for circular progress, ensure accessibility with aria-labels
- **VALIDATE**: Test with different score values (0, 50, 100)

### CREATE src/components/ui/SimulationToggle.tsx

- **IMPLEMENT**: Toggle component for what-if scenario selection with smooth animations
- **PATTERN**: Follow Button.tsx variant patterns (lines 1-46)
- **IMPORTS**: `import { motion } from 'framer-motion'`, `import { Check } from 'lucide-react'`
- **GOTCHA**: Ensure toggle states are clearly visible in dark theme, use gold accent color
- **VALIDATE**: Test toggle interactions and visual states

### CREATE src/hooks/useWhatIfSimulation.ts

- **IMPLEMENT**: React hook for managing simulation scenarios and API calls
- **PATTERN**: Mirror useArchitectureStream.ts structure (lines 1-156)
- **IMPORTS**: `import { useState, useCallback } from 'react'`, simulation types
- **GOTCHA**: Handle async simulation calls, manage loading states, integrate with existing context
- **VALIDATE**: Test hook with mock simulation scenarios

### UPDATE src/components/layout/CostCard.tsx

- **IMPLEMENT**: Add what-if simulation toggle and Well-Architected score display
- **PATTERN**: Extend existing expandable structure (lines 65-105)
- **IMPORTS**: Add ScoreIndicator, SimulationToggle, useWhatIfSimulation, useArchitecture
- **GOTCHA**: Maintain existing animation patterns, ensure scores update when architecture changes
- **VALIDATE**: Test expanded/collapsed states with new simulation features

### CREATE src/components/layout/SecurityPanel.tsx

- **IMPLEMENT**: Security-focused panel with Well-Architected security scores and recommendations
- **PATTERN**: Mirror CostCard.tsx structure and positioning (lines 1-108)
- **IMPORTS**: Same as CostCard plus security-specific icons from lucide-react
- **GOTCHA**: Position in bottom-right to complement CostCard, use red/orange colors for security alerts
- **VALIDATE**: Test panel positioning and security score display

### UPDATE src/contexts/ArchitectureContext.tsx

- **IMPLEMENT**: Add simulation state and Well-Architected score access methods
- **PATTERN**: Extend existing context interface (lines 25-32)
- **IMPORTS**: Add simulation types and useWhatIfSimulation hook
- **GOTCHA**: Maintain backward compatibility, ensure scores are available when architecture is loaded
- **VALIDATE**: Test context provides simulation data to components

### UPDATE src/app/page.tsx

- **IMPLEMENT**: Add SecurityPanel to main layout
- **PATTERN**: Follow existing component placement pattern (lines 1-20)
- **IMPORTS**: `import SecurityPanel from '@/components/layout/SecurityPanel'`
- **GOTCHA**: Ensure SecurityPanel doesn't overlap with existing components
- **VALIDATE**: Test layout with both CostCard and SecurityPanel visible

---

## TESTING STRATEGY

### Unit Tests

Test individual components and hooks in isolation using existing project patterns.

Design unit tests with mocked data and assertions:
- ScoreIndicator component with various score values
- SimulationToggle component state changes
- useWhatIfSimulation hook scenario management
- Well-Architected score calculations and display

### Integration Tests

Test complete what-if simulation workflow from UI to Kiro CLI integration:
- End-to-end simulation scenario execution
- Real-time score updates during architecture changes
- SecurityPanel integration with architecture data
- CostCard simulation toggle functionality

### Edge Cases

- Zero or invalid Well-Architected scores
- Simulation API failures and timeout handling
- Large cost differences in what-if scenarios
- Missing security audit data
- Concurrent simulation requests

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npm run build
```

### Level 2: Component Testing

```bash
# Test individual components
npm run dev
# Navigate to http://localhost:3000
# Test CostCard expansion with simulation toggle
# Test SecurityPanel display and interactions
# Verify Well-Architected scores display correctly
```

### Level 3: Integration Testing

```bash
# Test complete workflow
npm run dev
# Generate architecture with Kiro CLI
# Verify Well-Architected scores appear in both panels
# Test what-if simulation scenarios
# Confirm real-time updates work correctly
```

### Level 4: Manual Validation

- Open http://localhost:3000
- Generate an architecture using the TopBar
- Verify CostCard shows Well-Architected scores
- Test what-if simulation toggle functionality
- Confirm SecurityPanel appears with security metrics
- Test responsive behavior on different screen sizes
- Verify glassmorphism styling consistency

### Level 5: Accessibility Validation

```bash
# Test keyboard navigation
# Verify screen reader compatibility
# Check color contrast ratios for score indicators
# Validate ARIA labels on interactive elements
```

---

## ACCEPTANCE CRITERIA

- [ ] CostCard displays Well-Architected scores with circular progress indicators
- [ ] What-if simulation toggle allows scenario comparison with real-time cost updates
- [ ] SecurityPanel shows security-specific Well-Architected metrics and recommendations
- [ ] All components follow existing glassmorphism design patterns
- [ ] Smooth animations for simulation scenario switching
- [ ] Integration with existing Kiro CLI workflow maintains functionality
- [ ] Responsive design works on mobile and desktop
- [ ] TypeScript compilation passes with no errors
- [ ] All validation commands execute successfully
- [ ] Accessibility standards met for score indicators and toggles
- [ ] No regressions in existing architecture generation workflow

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in dependency order
- [ ] Each component tested individually
- [ ] Integration with ArchitectureContext verified
- [ ] Well-Architected scores display correctly from Kiro CLI data
- [ ] What-if simulation scenarios work end-to-end
- [ ] SecurityPanel positioned and styled correctly
- [ ] Animations and transitions smooth and consistent
- [ ] Error handling covers simulation failures
- [ ] Code follows existing project patterns and conventions
- [ ] Documentation updated for new components and hooks

---

## NOTES

**Design Considerations:**
- CostCard remains primary cost interface, SecurityPanel complements with security focus
- What-if simulations should feel immediate and responsive
- Well-Architected scores use standard AWS color coding (green/yellow/orange/red)
- Maintain glassmorphism aesthetic throughout new components

**Performance Considerations:**
- Simulation API calls should be debounced to prevent excessive requests
- Score calculations should be memoized when architecture data doesn't change
- Animations should be optimized for smooth 60fps performance
- Consider lazy loading for SecurityPanel if not immediately visible

**Future Enhancements:**
- Historical score tracking and trend analysis
- Custom simulation scenario creation
- Integration with AWS Cost Explorer API for real pricing data
- Export simulation results to PDF or CSV formats
