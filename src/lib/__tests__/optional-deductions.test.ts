import { calculateQuarterlyPayments, calculateTotalTax, calculateQBIDeduction } from '../tax-calculations';
import { TaxCalculationInput } from '@/types';

describe('Optional Deductions', () => {
  describe('QBI Deduction', () => {
    it('should calculate QBI deduction correctly for moderate income', () => {
      // $100,000 income - below phase-out threshold
      const qbiDeduction = calculateQBIDeduction(100000, 77935); // taxable income before QBI
      expect(qbiDeduction).toBe(15587); // 20% of $77,935 (limited by taxable income)
    });

    it('should limit QBI to 20% of taxable income', () => {
      // High QBI but low taxable income
      const qbiDeduction = calculateQBIDeduction(200000, 50000);
      expect(qbiDeduction).toBe(10000); // 20% of $50,000 taxable income (not 20% of $200k QBI)
    });

    it('should apply phase-out for high income', () => {
      // Income in phase-out range
      const midPhaseOut = (191950 + 241950) / 2; // $216,950
      const qbiDeduction = calculateQBIDeduction(250000, midPhaseOut);
      expect(qbiDeduction).toBeGreaterThan(0);
      expect(qbiDeduction).toBeLessThan(50000); // Should be less than full 20%
    });

    it('should eliminate QBI for very high income', () => {
      // Income above phase-out threshold
      const qbiDeduction = calculateQBIDeduction(300000, 250000);
      expect(qbiDeduction).toBe(0);
    });
  });

  describe('Tax Calculations with Optional Deductions', () => {
    it('should reduce taxes with QBI deduction', () => {
      const income = 150000;
      const withoutQBI = calculateTotalTax(income, false);
      const withQBI = calculateTotalTax(income, true);
      
      expect(withQBI.totalTax).toBeLessThan(withoutQBI.totalTax);
      expect(withQBI.qbiDeduction).toBeGreaterThan(0);
    });

    it('should reduce taxes with retirement contributions', () => {
      const income = 100000;
      const retirementAmount = 20000;
      
      const withoutRetirement = calculateTotalTax(income, false, false);
      const withRetirement = calculateTotalTax(income, false, true, retirementAmount);
      
      expect(withRetirement.totalTax).toBeLessThan(withoutRetirement.totalTax);
      expect(withRetirement.agi).toBe(withoutRetirement.agi - retirementAmount);
      expect(withRetirement.retirementContributions).toBe(retirementAmount);
    });

    it('should handle both QBI and retirement contributions together', () => {
      const income = 150000;
      const retirementAmount = 23500; // Max 401k contribution
      
      const noDeductions = calculateTotalTax(income, false, false);
      const bothDeductions = calculateTotalTax(income, true, true, retirementAmount);
      
      expect(bothDeductions.totalTax).toBeLessThan(noDeductions.totalTax);
      expect(bothDeductions.qbiDeduction).toBeGreaterThan(0);
      expect(bothDeductions.retirementContributions).toBe(retirementAmount);
      
      // Tax savings should be significant
      const taxSavings = noDeductions.totalTax - bothDeductions.totalTax;
      expect(taxSavings).toBeGreaterThan(5000);
    });
  });

  describe('Quarterly Payments with Optional Deductions', () => {
    it('should calculate lower quarterly payments with QBI', () => {
      const input: TaxCalculationInput = {
        annualIncome: 200000,
        previousYearTax: 50000,
        currentYearPayments: 0,
        includeQBI: false
      };

      const inputWithQBI: TaxCalculationInput = {
        ...input,
        includeQBI: true
      };

      const withoutQBI = calculateQuarterlyPayments(input);
      const withQBI = calculateQuarterlyPayments(inputWithQBI);
      
      expect(withQBI.totalAnnualTax).toBeLessThan(withoutQBI.totalAnnualTax);
    });

    it('should calculate lower quarterly payments with retirement contributions', () => {
      const input: TaxCalculationInput = {
        annualIncome: 150000,
        previousYearTax: 35000,
        currentYearPayments: 0,
        includeRetirementContributions: false
      };

      const inputWithRetirement: TaxCalculationInput = {
        ...input,
        includeRetirementContributions: true,
        retirementContributionAmount: 20000
      };

      const withoutRetirement = calculateQuarterlyPayments(input);
      const withRetirement = calculateQuarterlyPayments(inputWithRetirement);
      
      expect(withRetirement.totalAnnualTax).toBeLessThan(withoutRetirement.totalAnnualTax);
    });
  });

  describe('Real-world scenarios with deductions', () => {
    it('should show realistic tax savings for a $200k consultant with max deductions', () => {
      console.log('\n💰 Tax Savings with Optional Deductions\n');

      const income = 200000;
      const retirementContribution = 23500; // Max 401k

      // No deductions
      const noDeductions = calculateTotalTax(income);
      console.log('📊 $200k Consultant - No Optional Deductions:');
      console.log(`Total Tax: $${noDeductions.totalTax.toLocaleString()}`);
      console.log(`Effective Rate: ${((noDeductions.totalTax / income) * 100).toFixed(1)}%\n`);

      // With QBI only
      const withQBI = calculateTotalTax(income, true);
      console.log('📊 $200k Consultant - With QBI Deduction:');
      console.log(`Total Tax: $${withQBI.totalTax.toLocaleString()}`);
      console.log(`QBI Deduction: $${withQBI.qbiDeduction?.toLocaleString()}`);
      console.log(`Tax Savings: $${(noDeductions.totalTax - withQBI.totalTax).toLocaleString()}`);
      console.log(`Effective Rate: ${((withQBI.totalTax / income) * 100).toFixed(1)}%\n`);

      // With retirement contributions only
      const withRetirement = calculateTotalTax(income, false, true, retirementContribution);
      console.log('📊 $200k Consultant - With Retirement Contributions:');
      console.log(`Total Tax: $${withRetirement.totalTax.toLocaleString()}`);
      console.log(`Retirement Contribution: $${withRetirement.retirementContributions?.toLocaleString()}`);
      console.log(`Tax Savings: $${(noDeductions.totalTax - withRetirement.totalTax).toLocaleString()}`);
      console.log(`Effective Rate: ${((withRetirement.totalTax / income) * 100).toFixed(1)}%\n`);

      // With both deductions
      const withBoth = calculateTotalTax(income, true, true, retirementContribution);
      console.log('📊 $200k Consultant - With Both Deductions:');
      console.log(`Total Tax: $${withBoth.totalTax.toLocaleString()}`);
      console.log(`QBI Deduction: $${withBoth.qbiDeduction?.toLocaleString()}`);
      console.log(`Retirement Contribution: $${withBoth.retirementContributions?.toLocaleString()}`);
      console.log(`Total Tax Savings: $${(noDeductions.totalTax - withBoth.totalTax).toLocaleString()}`);
      console.log(`Effective Rate: ${((withBoth.totalTax / income) * 100).toFixed(1)}%\n`);

      // Verify significant tax savings
      expect(withBoth.totalTax).toBeLessThan(noDeductions.totalTax);
      expect(noDeductions.totalTax - withBoth.totalTax).toBeGreaterThan(10000); // At least $10k savings
    });
  });
});