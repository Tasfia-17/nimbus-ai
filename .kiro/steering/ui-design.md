# NimbusAI UI Design Principles
## Visual Aesthetic
- **Glassmorphism**: Backdrop blur (16-24px), semi-transparent surfaces (rgba(255,255,255,0.08)).
- **Premium Dark Mode**: Primary background #050510.
- **Accents**: Gold (#E8C77C) and soft neon violet.
- **Floating Surfaces**: Everything feels like it's floating above an infinite canvas.

## Component Patterns
- **React Flow**: Used for the interactive infinite canvas.
- **Tailwind CSS**: Utility-first styling with custom glassmorphism classes.
- **Framer Motion**: Smooth, high-quality transitions (hover scale 1.02, fade+slide).

## Layout Zones
1. **Left Sidebar**: Tactile AWS service components.
2. **Top Bar**: High-level AI actions (Generate, Export).
3. **Main Canvas**: Dotted grid, interactive architecture nodes.
4. **Floating Cost Card**: Real-time feedback in the bottom-left.
