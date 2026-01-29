# Next.js 14+ Setup Research for NimbusAI

## Project Structure & Configuration

### Next.js 14 App Router Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── canvas/
│       └── page.tsx
├── components/
│   ├── ui/
│   └── flow/
├── lib/
│   ├── utils.ts
│   └── flow-utils.ts
└── types/
    └── flow.ts
```

### Essential Configuration Files

#### package.json
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "reactflow": "^11.10.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}
```

#### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
}
module.exports = nextConfig
```

#### tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## React Flow Integration Best Practices

### Core Canvas Component
```tsx
'use client'
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState 
} from 'reactflow'
import 'reactflow/dist/style.css'

export default function InfiniteCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
```

### Performance Optimizations
- Use `React.memo` for custom nodes
- Implement viewport-based rendering for large datasets
- Lazy load node components
- Use `useCallback` for event handlers

### State Management Pattern
```tsx
// lib/flow-store.ts
import { create } from 'zustand'
import { Node, Edge } from 'reactflow'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  addNode: (node: Node) => void
  updateNode: (id: string, data: any) => void
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, data } : n)
  }))
}))
```

## Key Documentation Sources

1. **Next.js 14 App Router**: https://nextjs.org/docs/app
2. **React Flow Documentation**: https://reactflow.dev/docs/introduction
3. **Tailwind CSS with Next.js**: https://tailwindcss.com/docs/guides/nextjs
4. **TypeScript with Next.js**: https://nextjs.org/docs/app/building-your-application/configuring/typescript

## Infinite Canvas Specific Considerations

### Viewport Management
- Implement custom zoom controls
- Add keyboard shortcuts for navigation
- Use `fitView()` for auto-centering
- Implement minimap for large canvases

### Performance for Large Datasets
- Virtual rendering for 1000+ nodes
- Connection pooling for real-time updates
- Debounced save operations
- Optimistic UI updates

### Architecture Visualization Features
- Custom node types for AWS services
- Connection validation
- Auto-layout algorithms
- Export to various formats (PNG, SVG, JSON)