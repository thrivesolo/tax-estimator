"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@/components/ui"
import { calculateQuarterlyPayments } from "@/lib/tax-calculations"
import type { TaxCalculationInput, TaxCalculationResult } from "@/types"

const taxFormSchema = z.object({
  annualIncome: z
    .number({ invalid_type_error: "Please enter a valid number" })
    .min(0, "Income must be a positive number")
    .max(10000000, "Income must be less than $10,000,000"),
  previousYearTax: z
    .number({ invalid_type_error: "Please enter a valid number" })
    .min(0, "Tax liability must be a positive number")
    .max(5000000, "Tax liability must be less than $5,000,000"),
  currentYearPayments: z
    .number({ invalid_type_error: "Please enter a valid number" })
    .min(0, "Payments must be a positive number")
    .max(5000000, "Payments must be less than $5,000,000")
    .optional(),
})

type TaxFormData = z.infer<typeof taxFormSchema>

interface TaxCalculatorFormProps {
  onCalculate: (result: TaxCalculationResult) => void
}

export function TaxCalculatorForm({ onCalculate }: TaxCalculatorFormProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaxFormData>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      annualIncome: undefined,
      previousYearTax: undefined,
      currentYearPayments: 0,
    },
  })

  const onSubmit = async (data: TaxFormData) => {
    setIsCalculating(true)
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const input: TaxCalculationInput = {
      annualIncome: data.annualIncome,
      previousYearTax: data.previousYearTax,
      currentYearPaymentsMade: data.currentYearPayments || 0,
      filingStatus: 'single', // Default to single for MVP
      w2Income: 0, // All income is self-employment for MVP
      estimatedDeductions: 0, // Use standard deduction for MVP
      estimatedWithholding: 0, // No withholding for self-employed
    }
    
    const result = calculateQuarterlyPayments(input)
    onCalculate(result)
    setIsCalculating(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Tax Calculator</CardTitle>
        <CardDescription>
          Calculate your estimated quarterly tax payments for the current year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Estimated Annual Income"
            type="number"
            step="0.01"
            placeholder="75000"
            error={errors.annualIncome?.message}
            hint="Your total expected income for the year"
            icon={<span className="text-neutral-500">$</span>}
            {...register("annualIncome", { valueAsNumber: true })}
          />

          <Input
            label="Previous Year's Tax Liability"
            type="number"
            step="0.01"
            placeholder="15000"
            error={errors.previousYearTax?.message}
            hint="Total tax from your last year's return (Line 24 on Form 1040)"
            icon={<span className="text-neutral-500">$</span>}
            {...register("previousYearTax", { valueAsNumber: true })}
          />

          <Input
            label="Current Year Payments Made (Optional)"
            type="number"
            step="0.01"
            placeholder="0"
            error={errors.currentYearPayments?.message}
            hint="Any estimated tax payments you've already made this year"
            icon={<span className="text-neutral-500">$</span>}
            {...register("currentYearPayments", { valueAsNumber: true })}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isCalculating}
            className="relative"
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Calculating...
              </span>
            ) : (
              "Calculate Quarterly Payments"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}