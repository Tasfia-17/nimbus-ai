import { NextRequest, NextResponse } from 'next/server'
import { executeArchitecturePlanner, executeCostAnalyst } from '@/lib/real-kiro-agents'

export async function POST(request: NextRequest) {
  try {
    const { scenario, architecturePrompt } = await request.json()

    if (!scenario || !architecturePrompt) {
      return NextResponse.json(
        { error: 'Missing scenario or architecturePrompt' },
        { status: 400 }
      )
    }

    // First, get the architecture from the planner
    const architectureResponse = await executeArchitecturePlanner(architecturePrompt)
    
    if (!architectureResponse.success) {
      return NextResponse.json(
        { error: `Architecture planning failed: ${architectureResponse.error}` },
        { status: 500 }
      )
    }

    // Then analyze costs with the scenario parameters
    const costResponse = await executeCostAnalyst(architectureResponse.data, scenario.parameters)
    
    if (!costResponse.success) {
      return NextResponse.json(
        { error: `Cost analysis failed: ${costResponse.error}` },
        { status: 500 }
      )
    }

    return NextResponse.json(costResponse.data)
  } catch (error) {
    console.error('Simulation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
