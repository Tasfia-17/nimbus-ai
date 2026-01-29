'use client'

import { useState } from 'react'
import InfiniteCanvas from '@/components/InfiniteCanvas'
import TopBar from '@/components/layout/TopBar'
import Sidebar from '@/components/Sidebar'
import CostCard from '@/components/layout/CostCard'
import SecurityPanel from '@/components/layout/SecurityPanel'
import BYOAPIPanel from '@/components/BYOAPIPanel'
import Onboarding from '@/components/layout/Onboarding'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ArchitectureProvider } from '@/contexts/ArchitectureContext'
import { AnimatePresence } from 'framer-motion'

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true)

  return (
    <ArchitectureProvider>
      <ErrorBoundary>
        <div className="relative w-full h-screen overflow-hidden bg-primary">
          <AnimatePresence mode="wait">
            {showOnboarding ? (
              <Onboarding key="onboarding" onGetStarted={() => setShowOnboarding(false)} />
            ) : (
              <div key="dashboard" className="w-full h-full">
                <TopBar />
                <Sidebar />
                <div className="pt-20 pl-4">
                  <ErrorBoundary>
                    <InfiniteCanvas />
                  </ErrorBoundary>
                </div>
                <CostCard />
                <SecurityPanel />
                <BYOAPIPanel />
              </div>
            )}
          </AnimatePresence>
        </div>
      </ErrorBoundary>
    </ArchitectureProvider>
  )
}
