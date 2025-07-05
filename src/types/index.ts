export interface TaxCalculationInput {
  annualIncome: number;
  previousYearTax: number;
  currentYearPayments?: number;
  // Optional deductions
  includeQBI?: boolean;
  includeRetirementContributions?: boolean;
  retirementContributionAmount?: number;
}

export interface QuarterlyPayment {
  quarter: number;
  amount: number;
  dueDate: string;
}

export interface TaxCalculationResult {
  totalAnnualTax: number;
  quarterlyPayments: QuarterlyPayment[];
  totalDue: number;
  remainingPayments: number;
}