"use client"

import { useState, useRef, useEffect } from "react"
import { TaxCalculatorForm } from "./tax-calculator-form"
import { TaxResultsDisplay } from "./tax-results-display"
import type { TaxCalculationResult } from "@/types"

export function TaxCalculator() {
  const [results, setResults] = useState<TaxCalculationResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleCalculate = (calculationResults: TaxCalculationResult) => {
    setResults(calculationResults)
  }

  const handleReset = () => {
    setResults(null)
  }

  useEffect(() => {
    if (results && resultsRef.current) {
      // Focus on results when they appear
      resultsRef.current.focus()
    }
  }, [results])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="transition-all duration-300 ease-in-out">
        {!results ? (
          <div className="animate-in fade-in duration-300">
            <TaxCalculatorForm onCalculate={handleCalculate} />
          </div>
        ) : (
          <div 
            ref={resultsRef}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            tabIndex={-1}
            aria-label="Tax calculation results"
          >
            <TaxResultsDisplay results={results} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}