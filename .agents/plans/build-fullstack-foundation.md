# Feature: Build Full-Stack Foundation for NimbusAI

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build the complete full-stack foundation for NimbusAI, including enhanced Next.js setup, React Flow infinite canvas with auto-layout capabilities, glassmorphism UI design system, and interactive sidebar with AWS service components. This foundation will support the AI-driven architecture design workflow with visual drag-and-drop capabilities.

## User Story

As a DevOps engineer
I want to interact with a premium infinite canvas interface with AWS service components
So that I can visually design cloud architectures through an intuitive drag-and-drop experience

## Problem Statement

NimbusAI currently has a basic Next.js setup with minimal React Flow integration. It lacks the premium glassmorphism UI, interactive sidebar with AWS services, auto-layout capabilities, and the visual design system needed for professional architecture design.

## Solution Statement

Enhance the existing foundation with a complete UI design system featuring glassmorphism effects, an interactive sidebar with AWS service components, auto-layout engine using ElkJS, and a premium dark mode aesthetic that matches the steering document specifications.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: High
**Primary Systems Affected**: Frontend UI, Canvas System, Component Library
**Dependencies**: React Flow, ElkJS, Framer Motion, Tailwind CSS

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `src/components/InfiniteCanvas.tsx` (lines 1-25) - Why: Current basic React Flow implementation to enhance
- `src/app/globals.css` (lines 1-3) - Why: Base Tailwind setup to extend with glassmorphism
- `tailwind.config.ts` (lines 1-15) - Why: Tailwind configuration to extend with custom colors
- `package.json` (lines 1-20) - Why: Current dependencies to extend with new packages
- `.kiro/steering/ui-design.md` - Why: Contains exact UI specifications and design principles
- `.kiro/steering/api-rules.md` - Why: Security requirements for AWS service integration

### New Files to Create

- `src/components/Sidebar.tsx` - Interactive sidebar with AWS service components
- `src/components/ui/` - UI component library directory
- `src/components/ui/Button.tsx` - Glassmorphism button component
- `src/components/ui/Card.tsx` - Floating card component
- `src/components/ui/ServiceNode.tsx` - AWS service node component
- `src/components/layout/` - Layout components directory
- `src/components/layout/TopBar.tsx` - Top navigation bar
- `src/components/layout/CostCard.tsx` - Floating cost feedback card
- `src/lib/` - Utility functions directory
- `src/lib/elkLayout.ts` - Auto-layout engine using ElkJS
- `src/lib/awsServices.ts` - AWS service definitions and metadata
- `src/types/` - TypeScript type definitions
- `src/types/canvas.ts` - Canvas and node type definitions
- `src/types/aws.ts` - AWS service type definitions

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [React Flow Documentation](https://reactflow.dev/docs/introduction)
  - Specific section: Custom Nodes and Auto-Layout
  - Why: Required for implementing custom AWS service nodes
- [ElkJS Documentation](https://github.com/kieler/elkjs)
  - Specific section: Layout Options and Configuration
  - Why: Shows proper auto-layout implementation patterns
- [Framer Motion Documentation](https://www.framer.com/motion/introduction/)
  - Specific section: Hover animations and transitions
  - Why: Required for premium interaction animations
- [Tailwind CSS Backdrop Blur](https://tailwindcss.com/docs/backdrop-blur)
  - Specific section: Glassmorphism effects
  - Why: Essential for implementing the premium aesthetic

### Patterns to Follow

**Glassmorphism Pattern:**
```css
.glass {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Color Scheme:**
- Primary background: #050510
- Gold accent: #E8C77C
- Soft neon violet: #8B5CF6
- Semi-transparent surfaces: rgba(255,255,255,0.08)

**Animation Pattern:**
```tsx
// Hover scale 1.02, fade+slide transitions
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>
```

**Component Structure Pattern:**
```tsx
// All components should be client-side for React Flow compatibility
'use client'
```

---

## IMPLEMENTATION PLAN

### Phase 1: Enhanced Dependencies & Configuration

Set up additional dependencies and extend configuration for premium UI features.

**Tasks:**
- Install ElkJS for auto-layout capabilities
- Install Framer Motion for smooth animations
- Extend Tailwind configuration with custom glassmorphism utilities
- Add custom CSS variables for the premium color scheme

### Phase 2: UI Design System

Create the foundational UI components with glassmorphism effects and premium styling.

**Tasks:**
- Build glassmorphism Button component with hover animations
- Create floating Card component for various UI elements
- Implement ServiceNode component for AWS services
- Add custom Tailwind utilities for backdrop blur effects

### Phase 3: Layout Components

Implement the main layout structure with sidebar, top bar, and floating elements.

**Tasks:**
- Create interactive Sidebar with AWS service categories
- Build TopBar with AI action buttons
- Implement floating CostCard for real-time feedback
- Set up responsive layout grid system

### Phase 4: Enhanced Canvas System

Upgrade the React Flow canvas with auto-layout and premium interactions.

**Tasks:**
- Integrate ElkJS auto-layout engine
- Add custom AWS service node types
- Implement drag-and-drop from sidebar to canvas
- Add dotted grid background with premium styling

### Phase 5: AWS Service Integration

Create the AWS service component library and metadata system.

**Tasks:**
- Define AWS service categories and metadata
- Create draggable service components
- Implement service-to-node conversion logic
- Add service icons and descriptions

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### INSTALL elkjs framer-motion lucide-react

- **IMPLEMENT**: Add auto-layout and animation dependencies
- **PATTERN**: Follow existing package.json structure
- **IMPORTS**: elkjs, framer-motion, lucide-react for icons
- **GOTCHA**: Ensure version compatibility with React 18
- **VALIDATE**: `npm install && npm run build`

### UPDATE tailwind.config.ts

- **IMPLEMENT**: Extend theme with glassmorphism utilities and custom colors
- **PATTERN**: Follow existing Tailwind configuration structure
- **IMPORTS**: Add backdrop-blur utilities and custom color palette
- **GOTCHA**: Ensure all glassmorphism utilities are properly configured
- **VALIDATE**: `npm run build`

### UPDATE src/app/globals.css

- **IMPLEMENT**: Add custom CSS variables and glassmorphism base styles
- **PATTERN**: Extend existing Tailwind directives
- **IMPORTS**: CSS custom properties for color scheme
- **GOTCHA**: Maintain existing Tailwind directive order
- **VALIDATE**: Check styles load correctly in browser

### CREATE src/types/canvas.ts

- **IMPLEMENT**: TypeScript definitions for canvas nodes and edges
- **PATTERN**: Standard TypeScript interface definitions
- **IMPORTS**: React Flow types for extension
- **GOTCHA**: Ensure compatibility with React Flow's Node and Edge types
- **VALIDATE**: `npx tsc --noEmit`

### CREATE src/types/aws.ts

- **IMPLEMENT**: AWS service type definitions and categories
- **PATTERN**: Enum and interface patterns for service metadata
- **IMPORTS**: Standard TypeScript types
- **GOTCHA**: Include all major AWS service categories
- **VALIDATE**: `npx tsc --noEmit`

### CREATE src/lib/awsServices.ts

- **IMPLEMENT**: AWS service definitions with icons and metadata
- **PATTERN**: Export const arrays and objects for service data
- **IMPORTS**: AWS service types from ../types/aws
- **GOTCHA**: Use consistent naming and categorization
- **VALIDATE**: Import in test file to verify structure

### CREATE src/lib/elkLayout.ts

- **IMPLEMENT**: Auto-layout engine using ElkJS
- **PATTERN**: Mirror the Medium article implementation with React Flow integration
- **IMPORTS**: elkjs, reactflow types
- **GOTCHA**: Handle async layout calculation and error cases
- **VALIDATE**: Test with sample nodes and edges

### CREATE src/components/ui/Button.tsx

- **IMPLEMENT**: Glassmorphism button with Framer Motion animations
- **PATTERN**: Forwardref pattern with TypeScript generics
- **IMPORTS**: framer-motion, React, className utilities
- **GOTCHA**: Support all button variants (primary, secondary, ghost)
- **VALIDATE**: Render in Storybook or test page

### CREATE src/components/ui/Card.tsx

- **IMPLEMENT**: Floating card component with glassmorphism effects
- **PATTERN**: Flexible container with children prop
- **IMPORTS**: React, className utilities
- **GOTCHA**: Support different card sizes and padding variants
- **VALIDATE**: Test with various content types

### CREATE src/components/ui/ServiceNode.tsx

- **IMPLEMENT**: AWS service node component for React Flow
- **PATTERN**: React Flow custom node pattern with Handle components
- **IMPORTS**: reactflow, lucide-react for icons, AWS service types
- **GOTCHA**: Include source and target handles for connections
- **VALIDATE**: Register as custom node type in React Flow

### CREATE src/components/layout/TopBar.tsx

- **IMPLEMENT**: Top navigation with AI action buttons
- **PATTERN**: Horizontal flex layout with glassmorphism styling
- **IMPORTS**: UI components, framer-motion
- **GOTCHA**: Include Generate, Export, and other AI actions
- **VALIDATE**: Test responsive behavior

### CREATE src/components/layout/CostCard.tsx

- **IMPLEMENT**: Floating cost feedback card in bottom-left
- **PATTERN**: Fixed positioned card with real-time updates
- **IMPORTS**: UI Card component, cost calculation utilities
- **GOTCHA**: Position absolute with proper z-index
- **VALIDATE**: Test positioning across screen sizes

### CREATE src/components/Sidebar.tsx

- **IMPLEMENT**: Interactive sidebar with AWS service categories
- **PATTERN**: Collapsible sidebar with service drag sources
- **IMPORTS**: AWS services data, UI components, framer-motion
- **GOTCHA**: Implement drag-and-drop source functionality
- **VALIDATE**: Test drag interaction with canvas

### UPDATE src/components/InfiniteCanvas.tsx

- **IMPLEMENT**: Enhanced canvas with auto-layout and custom nodes
- **PATTERN**: Extend existing React Flow implementation
- **IMPORTS**: elkLayout utility, custom node types, React Flow addons
- **GOTCHA**: Register all custom node types and handle drag-drop
- **VALIDATE**: Test auto-layout functionality and node creation

### UPDATE src/app/page.tsx

- **IMPLEMENT**: Complete layout with sidebar, canvas, and top bar
- **PATTERN**: Grid layout with proper component composition
- **IMPORTS**: All layout components and enhanced canvas
- **GOTCHA**: Ensure proper z-index layering for floating elements
- **VALIDATE**: Test complete UI interaction flow

### CREATE src/app/layout.tsx

- **IMPLEMENT**: Enhanced root layout with metadata and fonts
- **PATTERN**: Next.js App Router layout pattern
- **IMPORTS**: Next.js metadata, font optimization
- **GOTCHA**: Include proper viewport and theme-color meta tags
- **VALIDATE**: Test SEO and performance metrics

---

## TESTING STRATEGY

### Unit Tests

Design unit tests for utility functions and individual components using Jest and React Testing Library following Next.js testing patterns.

**Key Test Areas:**
- ElkJS layout calculations with various node configurations
- AWS service data structure validation
- Component rendering with different props
- Drag and drop functionality

### Integration Tests

**Key Integration Areas:**
- Sidebar to canvas drag-and-drop workflow
- Auto-layout engine with real architecture data
- Responsive layout behavior across screen sizes
- Theme and glassmorphism effect rendering

### Edge Cases

**Specific Edge Cases:**
- Empty canvas state handling
- Large number of nodes performance
- Invalid drag-drop operations
- Auto-layout with circular dependencies
- Responsive behavior on mobile devices

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npm run build
```

### Level 2: Development Server

```bash
npm run dev
# Verify localhost:3000 loads without errors
```

### Level 3: Component Testing

```bash
# Manual testing checklist:
# 1. Sidebar opens/closes smoothly
# 2. AWS services can be dragged to canvas
# 3. Auto-layout button repositions nodes
# 4. Glassmorphism effects render correctly
# 5. Responsive layout works on different screen sizes
```

### Level 4: Performance Validation

```bash
# Check bundle size and performance
npm run build
# Verify build output size is reasonable
# Test canvas performance with 20+ nodes
```

---

## ACCEPTANCE CRITERIA

- [ ] Complete glassmorphism UI design system implemented
- [ ] Interactive sidebar with AWS service categories
- [ ] Drag-and-drop from sidebar to canvas functionality
- [ ] Auto-layout engine using ElkJS working correctly
- [ ] Premium dark mode aesthetic (#050510 background)
- [ ] Floating cost card positioned in bottom-left
- [ ] Top bar with AI action buttons
- [ ] Responsive layout across desktop and tablet
- [ ] Smooth Framer Motion animations (hover scale 1.02)
- [ ] Dotted grid background on canvas
- [ ] All validation commands pass with zero errors
- [ ] TypeScript strict mode compliance
- [ ] No console errors or warnings
- [ ] Performance optimized for 50+ nodes

---

## COMPLETION CHECKLIST

- [ ] All dependencies installed and configured
- [ ] UI design system components created
- [ ] Layout components implemented
- [ ] Enhanced canvas with auto-layout
- [ ] AWS service integration complete
- [ ] All validation commands executed successfully
- [ ] Manual testing confirms all features work
- [ ] Acceptance criteria all met
- [ ] Code follows NimbusAI design principles
- [ ] Performance meets requirements for interactive canvas

---

## NOTES

**Design Decisions:**
- ElkJS chosen over Dagre for better maintenance and features
- Framer Motion for premium animation experience
- Client-side rendering for all interactive components
- Modular component architecture for maintainability

**Performance Considerations:**
- React Flow optimized for large node counts
- Lazy loading for AWS service icons
- Memoized layout calculations
- Efficient re-rendering with proper React patterns

**Security Considerations:**
- No AWS credentials stored in frontend code
- Secure drag-drop implementation
- XSS protection for dynamic content
