"use client"

import { useState } from "react"
import { TaxCalculatorForm } from "./tax-calculator-form"
import { TaxResultsDisplay } from "./tax-results-display"
import type { TaxCalculationResult } from "@/types"

export function TaxCalculator() {
  const [results, setResults] = useState<TaxCalculationResult | null>(null)

  const handleCalculate = (calculationResults: TaxCalculationResult) => {
    setResults(calculationResults)
  }

  const handleReset = () => {
    setResults(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="transition-all duration-300 ease-in-out">
        {!results ? (
          <div className="animate-in fade-in duration-300">
            <TaxCalculatorForm onCalculate={handleCalculate} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TaxResultsDisplay results={results} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}