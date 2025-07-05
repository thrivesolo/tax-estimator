import {
  FEDERAL_TAX_BRACKETS_2025,
  STANDARD_DEDUCTION_2025,
  QUARTERLY_DUE_DATES_2025,
  SAFE_HARBOR_THRESHOLD,
  SAFE_HARBOR_PERCENTAGE,
  SAFE_HARBOR_PERCENTAGE_PRIOR_YEAR,
  HIGH_INCOME_SAFE_HARBOR,
  HIGH_INCOME_THRESHOLD,
  QBI_DEDUCTION_RATE,
  QBI_PHASE_OUT_START,
  QBI_PHASE_OUT_END,
} from './tax-constants';
import { TaxCalculationInput, TaxCalculationResult } from '@/types';

/**
 * Calculate federal income tax based on taxable income using 2025 brackets
 */
export function calculateFederalIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of FEDERAL_TAX_BRACKETS_2025) {
    if (remainingIncome <= 0) break;
    
    const taxableAtBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    tax += taxableAtBracket * bracket.rate;
    remainingIncome -= taxableAtBracket;
  }
  
  return Math.round(tax);
}

/**
 * Calculate self-employment tax (Social Security + Medicare)
 */
export function calculateSelfEmploymentTax(netSelfEmploymentIncome: number): number {
  if (netSelfEmploymentIncome <= 0) return 0;
  
  // SE tax is calculated on 92.35% of net earnings
  const adjustedIncome = netSelfEmploymentIncome * 0.9235;
  
  let seTax = 0;
  
  // Social Security tax (12.4% on first $168,600 for 2025)
  const socialSecurityWageBase = 168600;
  const socialSecurityTaxableIncome = Math.min(adjustedIncome, socialSecurityWageBase);
  seTax += socialSecurityTaxableIncome * 0.124;
  
  // Medicare tax (2.9% on all income)
  seTax += adjustedIncome * 0.029;
  
  // Additional Medicare tax (0.9% on income over $200,000)
  if (adjustedIncome > 200000) {
    seTax += (adjustedIncome - 200000) * 0.009;
  }
  
  return Math.round(seTax);
}

/**
 * Calculate deductible portion of self-employment tax
 */
export function calculateSelfEmploymentTaxDeduction(seTax: number): number {
  return Math.round(seTax * 0.5);
}

/**
 * Calculate QBI (Qualified Business Income) deduction with phase-out
 */
export function calculateQBIDeduction(
  qualifiedBusinessIncome: number,
  taxableIncomeBeforeQBI: number
): number {
  if (qualifiedBusinessIncome <= 0 || taxableIncomeBeforeQBI <= 0) return 0;
  
  // Base QBI deduction (20% of qualified business income)
  let qbiDeduction = qualifiedBusinessIncome * QBI_DEDUCTION_RATE;
  
  // Limit to 20% of taxable income before QBI deduction
  const taxableIncomeLimit = taxableIncomeBeforeQBI * QBI_DEDUCTION_RATE;
  qbiDeduction = Math.min(qbiDeduction, taxableIncomeLimit);
  
  // Apply phase-out based on taxable income
  if (taxableIncomeBeforeQBI > QBI_PHASE_OUT_START) {
    if (taxableIncomeBeforeQBI >= QBI_PHASE_OUT_END) {
      // Complete phase-out
      qbiDeduction = 0;
    } else {
      // Partial phase-out
      const phaseOutRange = QBI_PHASE_OUT_END - QBI_PHASE_OUT_START;
      const excessIncome = taxableIncomeBeforeQBI - QBI_PHASE_OUT_START;
      const phaseOutPercentage = excessIncome / phaseOutRange;
      qbiDeduction = qbiDeduction * (1 - phaseOutPercentage);
    }
  }
  
  return Math.round(qbiDeduction);
}

/**
 * Calculate adjusted gross income (AGI)
 */
export function calculateAGI(
  grossIncome: number,
  seTaxDeduction: number,
  retirementContributions: number = 0,
  otherDeductions: number = 0
): number {
  return Math.max(0, grossIncome - seTaxDeduction - retirementContributions - otherDeductions);
}

/**
 * Calculate taxable income
 */
export function calculateTaxableIncome(
  agi: number,
  qbiDeduction: number = 0
): number {
  const taxableIncomeBeforeQBI = Math.max(0, agi - STANDARD_DEDUCTION_2025);
  return Math.max(0, taxableIncomeBeforeQBI - qbiDeduction);
}

/**
 * Main tax calculation function
 */
export function calculateTotalTax(
  grossIncome: number,
  includeQBI: boolean = false,
  includeRetirementContributions: boolean = false,
  retirementContributionAmount: number = 0
): {
  incomeTax: number;
  seTax: number;
  totalTax: number;
  agi: number;
  qbiDeduction?: number;
  retirementContributions?: number;
} {
  // Calculate self-employment tax
  const seTax = calculateSelfEmploymentTax(grossIncome);
  
  // Calculate deductible portion of SE tax
  const seTaxDeduction = calculateSelfEmploymentTaxDeduction(seTax);
  
  // Apply retirement contributions if enabled
  const retirementContributions = includeRetirementContributions ? retirementContributionAmount : 0;
  
  // Calculate AGI
  const agi = calculateAGI(grossIncome, seTaxDeduction, retirementContributions);
  
  // Calculate taxable income before QBI deduction
  const taxableIncomeBeforeQBI = Math.max(0, agi - STANDARD_DEDUCTION_2025);
  
  // Calculate QBI deduction if enabled
  const qbiDeduction = includeQBI ? calculateQBIDeduction(grossIncome, taxableIncomeBeforeQBI) : 0;
  
  // Calculate final taxable income
  const taxableIncome = calculateTaxableIncome(agi, qbiDeduction);
  
  // Calculate federal income tax
  const incomeTax = calculateFederalIncomeTax(taxableIncome);
  
  // Total tax liability
  const totalTax = incomeTax + seTax;
  
  const result: {
    incomeTax: number;
    seTax: number;
    totalTax: number;
    agi: number;
    qbiDeduction?: number;
    retirementContributions?: number;
  } = {
    incomeTax,
    seTax,
    totalTax,
    agi,
  };
  
  // Include optional deduction amounts in result for transparency
  if (includeQBI) {
    result.qbiDeduction = qbiDeduction;
  }
  if (includeRetirementContributions) {
    result.retirementContributions = retirementContributions;
  }
  
  return result;
}

/**
 * Calculate quarterly estimated tax payments
 */
export function calculateQuarterlyPayments(input: TaxCalculationInput): TaxCalculationResult {
  const { 
    annualIncome, 
    previousYearTax, 
    currentYearPayments = 0,
    includeQBI = false,
    includeRetirementContributions = false,
    retirementContributionAmount = 0
  } = input;
  
  // Calculate current year tax liability with optional deductions
  const currentYearTaxCalc = calculateTotalTax(
    annualIncome,
    includeQBI,
    includeRetirementContributions,
    retirementContributionAmount
  );
  const currentYearTax = currentYearTaxCalc.totalTax;
  
  // Determine safe harbor amount
  let safeHarborAmount = previousYearTax * SAFE_HARBOR_PERCENTAGE_PRIOR_YEAR;
  
  // Use higher safe harbor for high income earners
  if (currentYearTaxCalc.agi > HIGH_INCOME_THRESHOLD) {
    safeHarborAmount = previousYearTax * HIGH_INCOME_SAFE_HARBOR;
  }
  
  // Use the lower of current year 90% or prior year safe harbor
  const currentYearSafeHarbor = currentYearTax * SAFE_HARBOR_PERCENTAGE;
  const requiredAnnualPayment = Math.min(currentYearSafeHarbor, safeHarborAmount);
  
  // Check if estimated payments are even required
  if (currentYearTax < SAFE_HARBOR_THRESHOLD) {
    return {
      totalAnnualTax: currentYearTax,
      quarterlyPayments: QUARTERLY_DUE_DATES_2025.map(q => ({
        quarter: q.quarter,
        amount: 0,
        dueDate: q.dueDate,
      })),
      totalDue: 0,
      remainingPayments: 0,
    };
  }
  
  // Calculate quarterly payment amount
  const quarterlyAmount = Math.round(requiredAnnualPayment / 4);
  
  // Calculate total payments needed
  const totalPaymentsNeeded = quarterlyAmount * 4;
  const remainingPayments = Math.max(0, totalPaymentsNeeded - currentYearPayments);
  
  // Create quarterly payment schedule
  const quarterlyPayments = QUARTERLY_DUE_DATES_2025.map(q => ({
    quarter: q.quarter,
    amount: quarterlyAmount,
    dueDate: q.dueDate,
  }));
  
  return {
    totalAnnualTax: currentYearTax,
    quarterlyPayments,
    totalDue: totalPaymentsNeeded,
    remainingPayments,
  };
}