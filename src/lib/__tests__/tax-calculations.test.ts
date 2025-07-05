import {
  calculateFederalIncomeTax,
  calculateSelfEmploymentTax,
  calculateSelfEmploymentTaxDeduction,
  calculateAGI,
  calculateTaxableIncome,
  calculateTotalTax,
  calculateQuarterlyPayments,
} from '../tax-calculations';
import { TaxCalculationInput } from '@/types';

describe('Tax Calculations', () => {
  describe('calculateFederalIncomeTax', () => {
    it('should return 0 for negative or zero income', () => {
      expect(calculateFederalIncomeTax(0)).toBe(0);
      expect(calculateFederalIncomeTax(-1000)).toBe(0);
    });

    it('should calculate tax correctly for 10% bracket', () => {
      // $10,000 taxable income - all in 10% bracket
      expect(calculateFederalIncomeTax(10000)).toBe(1000);
    });

    it('should calculate tax correctly across multiple brackets', () => {
      // $50,000 taxable income
      // 10% on first $11,700 = $1,170
      // 12% on next $35,450 ($47,150 - $11,700) = $4,254
      // 22% on next $2,850 ($50,000 - $47,150) = $627
      // Total = $6,051
      expect(calculateFederalIncomeTax(50000)).toBe(6051);
    });

    it('should calculate tax correctly for high income', () => {
      // $200,000 taxable income
      const expectedTax = 
        11700 * 0.10 + // $1,170
        (47150 - 11700) * 0.12 + // $4,254
        (100525 - 47150) * 0.22 + // $11,742.50
        (191950 - 100525) * 0.24 + // $21,942
        (200000 - 191950) * 0.32; // $2,576
      expect(calculateFederalIncomeTax(200000)).toBe(Math.round(expectedTax));
    });
  });

  describe('calculateSelfEmploymentTax', () => {
    it('should return 0 for negative or zero income', () => {
      expect(calculateSelfEmploymentTax(0)).toBe(0);
      expect(calculateSelfEmploymentTax(-1000)).toBe(0);
    });

    it('should calculate SE tax correctly for moderate income', () => {
      // $50,000 net self-employment income
      const adjustedIncome = 50000 * 0.9235; // $46,175
      const socialSecurityTax = adjustedIncome * 0.124; // $5,725.70
      const medicareTax = adjustedIncome * 0.029; // $1,339.075
      const expectedTax = Math.round(socialSecurityTax + medicareTax);
      expect(calculateSelfEmploymentTax(50000)).toBe(expectedTax);
    });

    it('should cap Social Security tax at wage base', () => {
      // $200,000 net self-employment income
      const adjustedIncome = 200000 * 0.9235; // $184,700
      const socialSecurityTax = Math.min(adjustedIncome, 168600) * 0.124; // $20,906.40
      const medicareTax = adjustedIncome * 0.029; // $5,356.30
      const additionalMedicareTax = 0; // Under $200k threshold for additional Medicare
      const expectedTax = Math.round(socialSecurityTax + medicareTax + additionalMedicareTax);
      expect(calculateSelfEmploymentTax(200000)).toBe(expectedTax);
    });

    it('should apply additional Medicare tax for high income', () => {
      // $250,000 net self-employment income
      const adjustedIncome = 250000 * 0.9235; // $230,875
      const socialSecurityTax = Math.min(adjustedIncome, 168600) * 0.124; // $20,906.40
      const medicareTax = adjustedIncome * 0.029; // $6,695.375
      const additionalMedicareTax = (adjustedIncome - 200000) * 0.009; // $277.875
      const expectedTax = Math.round(socialSecurityTax + medicareTax + additionalMedicareTax);
      expect(calculateSelfEmploymentTax(250000)).toBe(expectedTax);
    });
  });

  describe('calculateSelfEmploymentTaxDeduction', () => {
    it('should return half of SE tax', () => {
      expect(calculateSelfEmploymentTaxDeduction(1000)).toBe(500);
      expect(calculateSelfEmploymentTaxDeduction(2345)).toBe(1173); // rounded
    });
  });

  describe('calculateAGI', () => {
    it('should calculate AGI correctly', () => {
      expect(calculateAGI(50000, 3500, 1000)).toBe(45500);
    });

    it('should not return negative AGI', () => {
      expect(calculateAGI(30000, 20000, 15000)).toBe(0);
    });
  });

  describe('calculateTaxableIncome', () => {
    it('should subtract standard deduction from AGI', () => {
      expect(calculateTaxableIncome(50000)).toBe(35000); // $50,000 - $15,000 standard deduction
    });

    it('should not return negative taxable income', () => {
      expect(calculateTaxableIncome(10000)).toBe(0); // Less than standard deduction
    });
  });

  describe('calculateTotalTax', () => {
    it('should calculate total tax liability correctly', () => {
      const result = calculateTotalTax(100000);
      
      expect(result).toHaveProperty('incomeTax');
      expect(result).toHaveProperty('seTax');
      expect(result).toHaveProperty('totalTax');
      expect(result).toHaveProperty('agi');
      
      expect(result.totalTax).toBe(result.incomeTax + result.seTax);
      expect(result.incomeTax).toBeGreaterThan(0);
      expect(result.seTax).toBeGreaterThan(0);
    });

    it('should handle zero income', () => {
      const result = calculateTotalTax(0);
      expect(result.incomeTax).toBe(0);
      expect(result.seTax).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.agi).toBe(0);
    });
  });

  describe('calculateQuarterlyPayments', () => {
    const mockInput: TaxCalculationInput = {
      annualIncome: 100000,
      previousYearTax: 20000,
      currentYearPayments: 0,
    };

    it('should calculate quarterly payments correctly', () => {
      const result = calculateQuarterlyPayments(mockInput);
      
      expect(result).toHaveProperty('totalAnnualTax');
      expect(result).toHaveProperty('quarterlyPayments');
      expect(result).toHaveProperty('totalDue');
      expect(result).toHaveProperty('remainingPayments');
      
      expect(result.quarterlyPayments).toHaveLength(4);
      expect(result.quarterlyPayments[0]).toHaveProperty('quarter');
      expect(result.quarterlyPayments[0]).toHaveProperty('amount');
      expect(result.quarterlyPayments[0]).toHaveProperty('dueDate');
    });

    it('should return zero payments for low tax liability', () => {
      const lowIncomeInput: TaxCalculationInput = {
        annualIncome: 5000,
        previousYearTax: 0,
        currentYearPayments: 0,
      };
      
      const result = calculateQuarterlyPayments(lowIncomeInput);
      expect(result.totalDue).toBe(0);
      expect(result.remainingPayments).toBe(0);
      result.quarterlyPayments.forEach(payment => {
        expect(payment.amount).toBe(0);
      });
    });

    it('should use safe harbor rules correctly', () => {
      const highIncomeInput: TaxCalculationInput = {
        annualIncome: 200000,
        previousYearTax: 30000,
        currentYearPayments: 0,
      };
      
      const result = calculateQuarterlyPayments(highIncomeInput);
      
      // Should use 110% of prior year tax for high income
      const expectedTotal = 30000 * 1.1;
      expect(result.totalDue).toBe(expectedTotal);
    });

    it('should account for payments already made', () => {
      const inputWithPayments: TaxCalculationInput = {
        annualIncome: 100000,
        previousYearTax: 20000,
        currentYearPayments: 10000,
      };
      
      const result = calculateQuarterlyPayments(inputWithPayments);
      expect(result.remainingPayments).toBe(result.totalDue - 10000);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle typical freelancer scenario', () => {
      const freelancerInput: TaxCalculationInput = {
        annualIncome: 75000,
        previousYearTax: 15000,
        currentYearPayments: 0,
      };
      
      const result = calculateQuarterlyPayments(freelancerInput);
      
      expect(result.totalAnnualTax).toBeGreaterThan(0);
      expect(result.quarterlyPayments[0].amount).toBeGreaterThan(0);
      expect(result.totalDue).toBeGreaterThan(0);
    });

    it('should handle high-income consultant scenario', () => {
      const consultantInput: TaxCalculationInput = {
        annualIncome: 250000,
        previousYearTax: 50000,
        currentYearPayments: 12500,
      };
      
      const result = calculateQuarterlyPayments(consultantInput);
      
      expect(result.totalAnnualTax).toBeGreaterThan(50000);
      expect(result.totalDue).toBe(Math.round(50000 * 1.1)); // 110% safe harbor
      expect(result.remainingPayments).toBe(result.totalDue - 12500);
    });

    it('should handle part-time gig worker scenario', () => {
      const gigWorkerInput: TaxCalculationInput = {
        annualIncome: 25000,
        previousYearTax: 2000,
        currentYearPayments: 0,
      };
      
      const result = calculateQuarterlyPayments(gigWorkerInput);
      
      expect(result.totalAnnualTax).toBeGreaterThan(0);
      expect(result.quarterlyPayments[0].amount).toBeGreaterThan(0);
    });
  });
});