// 2025 Federal Tax Brackets for Single Filers
export const FEDERAL_TAX_BRACKETS_2025 = [
  { min: 0, max: 11700, rate: 0.10 },
  { min: 11700, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// Standard deduction for 2025
export const STANDARD_DEDUCTION_2025 = 15000;

// Self-employment tax rates
export const SELF_EMPLOYMENT_TAX_RATE = 0.153; // 15.3%
export const SELF_EMPLOYMENT_TAX_DEDUCTION = 0.0765; // Half of SE tax is deductible

// Quarterly payment due dates for 2025
export const QUARTERLY_DUE_DATES_2025 = [
  { quarter: 1, dueDate: '2025-04-15' },
  { quarter: 2, dueDate: '2025-06-16' },
  { quarter: 3, dueDate: '2025-09-15' },
  { quarter: 4, dueDate: '2026-01-15' },
];

// Safe harbor rules
export const SAFE_HARBOR_THRESHOLD = 1000; // Minimum tax liability to require estimated payments
export const SAFE_HARBOR_PERCENTAGE = 0.9; // Must pay 90% of current year tax
export const SAFE_HARBOR_PERCENTAGE_PRIOR_YEAR = 1.0; // Or 100% of prior year tax
export const HIGH_INCOME_SAFE_HARBOR = 1.1; // 110% for high income earners
export const HIGH_INCOME_THRESHOLD = 150000; // AGI threshold for higher safe harbor

// QBI (Qualified Business Income) deduction
export const QBI_DEDUCTION_RATE = 0.20; // 20% deduction
export const QBI_PHASE_OUT_START = 191950; // Phase-out starts (single filer)
export const QBI_PHASE_OUT_END = 241950; // Complete phase-out (single filer)

// Retirement contribution limits (2025)
export const RETIREMENT_401K_LIMIT = 23500; // 401(k) contribution limit
export const RETIREMENT_IRA_LIMIT = 7000; // Traditional/Roth IRA limit