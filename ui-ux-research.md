# UI/UX Research: What-if Simulation Toggles & AWS Well-Architected Score Displays

## What-if Simulation Toggle Patterns

### 1. Scenario Comparison Toggles
- **Pattern**: Side-by-side comparison with toggle switches
- **Examples**: 
  - AWS Cost Calculator's "Compare scenarios" feature
  - Figma's component variant toggles
  - Stripe's pricing calculator toggles

### 2. Simulation Control Panels
- **Pattern**: Grouped controls with clear labels and instant feedback
- **Key Elements**:
  - Toggle switches with descriptive labels
  - Slider controls for variable inputs
  - Dropdown selectors for discrete options
  - Real-time preview updates

### 3. Interactive Toggle Design
```jsx
// Minimal toggle component pattern
const SimulationToggle = ({ label, enabled, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium">{label}</span>
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  </div>
);
```

## AWS Well-Architected Score Visualization

### 1. Circular Progress Indicators
- **Pattern**: Donut charts with score in center
- **Examples**: 
  - AWS Well-Architected Tool's pillar scores
  - Google PageSpeed Insights scores
  - Lighthouse performance scores

### 2. Score Breakdown Components
```jsx
// Minimal score display pattern
const WellArchitectedScore = ({ score, pillars }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="text-center mb-4">
      <div className="text-3xl font-bold text-green-600">{score}/100</div>
      <div className="text-sm text-gray-500">Overall Score</div>
    </div>
    <div className="space-y-2">
      {pillars.map(pillar => (
        <div key={pillar.name} className="flex justify-between">
          <span className="text-sm">{pillar.name}</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-blue-500 rounded"
                style={{ width: `${pillar.score}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{pillar.score}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
```

### 3. Status Indicators
- **Pattern**: Color-coded badges with clear status
- **Colors**: 
  - Green: Excellent (90-100)
  - Yellow: Good (70-89)
  - Orange: Needs Improvement (50-69)
  - Red: Critical (0-49)

## Dashboard Design Best Practices

### 1. Cost Analysis Interfaces
- **Layout**: Left panel for controls, right panel for results
- **Visual Hierarchy**: Large numbers for key metrics, smaller text for details
- **Comparison Views**: Before/after or side-by-side layouts

### 2. Security Scoring Interfaces
- **Priority Indicators**: High/Medium/Low risk badges
- **Action Items**: Clear next steps with severity levels
- **Trend Visualization**: Historical score changes over time

### 3. Interactive Elements
```jsx
// Minimal what-if control panel
const WhatIfPanel = ({ scenarios, activeScenario, onScenarioChange }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-medium mb-3">What-if Scenarios</h3>
    <div className="space-y-2">
      {scenarios.map(scenario => (
        <label key={scenario.id} className="flex items-center gap-2">
          <input
            type="radio"
            checked={activeScenario === scenario.id}
            onChange={() => onScenarioChange(scenario.id)}
            className="text-blue-600"
          />
          <span className="text-sm">{scenario.name}</span>
          <span className="text-xs text-gray-500 ml-auto">
            ${scenario.estimatedCost}/mo
          </span>
        </label>
      ))}
    </div>
  </div>
);
```

## Key Design Principles

1. **Immediate Feedback**: Changes should reflect instantly
2. **Clear Labeling**: Every control should have descriptive text
3. **Visual Hierarchy**: Most important metrics should be largest
4. **Consistent Spacing**: Use design system spacing tokens
5. **Accessible Colors**: Ensure sufficient contrast ratios
6. **Mobile Responsive**: Stack controls vertically on small screens

## Recommended Libraries
- **Toggles**: Headless UI, React Switch
- **Charts**: Recharts, Chart.js
- **Icons**: Heroicons, Lucide React
- **Styling**: Tailwind CSS for rapid prototyping