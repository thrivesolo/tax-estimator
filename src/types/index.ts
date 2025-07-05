export interface TaxCalculationInput {
  annualIncome: number;
  previousYearTax: number;
  currentYearPaymentsMade?: number;
  filingStatus?: 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household';
  w2Income?: number;
  estimatedDeductions?: number;
  estimatedWithholding?: number;
}

export interface QuarterlyPayment {
  quarter: number;
  amountDue: number;
  dueDate: string;
  isPaid: boolean;
  amountPaid: number;
}

export interface TaxCalculationResult {
  totalEstimatedTax: number;
  safeHarborAmount: number;
  quarterlyPayments: QuarterlyPayment[];
  totalRemaining: number;
}