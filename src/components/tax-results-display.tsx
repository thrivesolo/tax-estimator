"use client"

import dynamic from "next/dynamic"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Alert, AlertDescription } from "@/components/ui"
import { formatCurrency, formatDate } from "@/lib/utils"
import { analytics } from "@/lib/analytics"
import type { TaxCalculationResult } from "@/types"

const AnimatedNumber = dynamic(() => import("@/components/ui/animated-number").then(mod => mod.AnimatedNumber), {
  loading: () => <span>Loading...</span>,
  ssr: false
})

interface TaxResultsDisplayProps {
  results: TaxCalculationResult
  onReset: () => void
}

export function TaxResultsDisplay({ results, onReset }: TaxResultsDisplayProps) {
  const totalRemaining = results.quarterlyPayments.reduce(
    (sum, payment) => sum + payment.amountDue,
    0
  )

  const hasPaymentsDue = results.quarterlyPayments.some(payment => payment.amountDue > 0)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Calculation Summary</CardTitle>
          <CardDescription>
            Based on your estimated income and safe harbor rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Total Estimated Tax</p>
              <p className="text-2xl font-semibold text-neutral-900">
                <AnimatedNumber value={results.totalEstimatedTax} />
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Safe Harbor Amount</p>
              <p className="text-2xl font-semibold text-neutral-900">
                <AnimatedNumber value={results.safeHarborAmount} />
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-neutral-600">Total Remaining to Pay</p>
            <p className="text-3xl font-bold text-primary">
              <AnimatedNumber value={totalRemaining} duration={1500} />
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Payment Schedule</CardTitle>
          <CardDescription>
            Your estimated tax payments for each quarter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.quarterlyPayments.map((payment) => (
              <div
                key={payment.quarter}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-neutral-900">
                      Quarter {payment.quarter}
                    </h4>
                    {payment.isPaid && (
                      <Badge variant="success">Paid</Badge>
                    )}
                    {!payment.isPaid && new Date(payment.dueDate) < new Date() && (
                      <Badge variant="error">Overdue</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    Due: {formatDate(payment.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-neutral-900">
                    {formatCurrency(payment.amountDue)}
                  </p>
                  {payment.isPaid && (
                    <p className="text-sm text-neutral-600">
                      Paid: {formatCurrency(payment.amountPaid)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      {hasPaymentsDue && (
        <Card>
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>
              Pay your quarterly taxes directly on the IRS website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              size="lg"
              fullWidth
              onClick={() => {
                analytics.trackPaymentClick()
                window.open('https://www.irs.gov/payments/direct-pay', '_blank')
              }}
            >
              Pay Now with IRS Direct Pay
            </Button>
            <p className="text-sm text-neutral-600 text-center">
              You&apos;ll be redirected to the official IRS payment website
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Alert variant="info">
        <AlertDescription>
          <strong>Important:</strong> This is not tax advice. Always consult a tax professional
          for guidance specific to your situation. These calculations are estimates based on
          current federal tax rates and may not reflect your actual tax liability.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex justify-center">
        <Button variant="secondary" onClick={onReset}>
          Calculate Again
        </Button>
      </div>
    </div>
  )
}