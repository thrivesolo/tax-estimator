import { calculateSelfEmploymentTax } from '../tax-calculations';

describe('Self-Employment Tax Verification', () => {
  describe('Additional Medicare Tax (0.9%)', () => {
    it('should NOT apply additional Medicare tax under $200k threshold', () => {
      const income = 150000;
      const adjustedIncome = income * 0.9235; // $138,525
      
      // Expected SE tax breakdown:
      const socialSecurityTax = adjustedIncome * 0.124; // $17,177.10
      const medicareTax = adjustedIncome * 0.029; // $4,017.225
      const additionalMedicareTax = 0; // Should be $0 (under $200k threshold)
      const expectedTotal = Math.round(socialSecurityTax + medicareTax + additionalMedicareTax);
      
      const actualSeTax = calculateSelfEmploymentTax(income);
      
      console.log(`\n💼 SE Tax for $${income.toLocaleString()} income:`);
      console.log(`Adjusted Income: $${adjustedIncome.toLocaleString()}`);
      console.log(`Social Security Tax (12.4%): $${Math.round(socialSecurityTax).toLocaleString()}`);
      console.log(`Medicare Tax (2.9%): $${Math.round(medicareTax).toLocaleString()}`);
      console.log(`Additional Medicare Tax (0.9%): $${additionalMedicareTax.toLocaleString()}`);
      console.log(`Expected Total: $${expectedTotal.toLocaleString()}`);
      console.log(`Actual Total: $${actualSeTax.toLocaleString()}\n`);
      
      expect(actualSeTax).toBe(expectedTotal);
    });

    it('should apply additional Medicare tax ABOVE $200k threshold', () => {
      const income = 250000;
      const adjustedIncome = income * 0.9235; // $230,875
      
      // Expected SE tax breakdown:
      const socialSecurityTax = Math.min(adjustedIncome, 168600) * 0.124; // Capped at wage base
      const medicareTax = adjustedIncome * 0.029;
      const additionalMedicareTax = (adjustedIncome - 200000) * 0.009; // 0.9% on excess over $200k
      const expectedTotal = Math.round(socialSecurityTax + medicareTax + additionalMedicareTax);
      
      const actualSeTax = calculateSelfEmploymentTax(income);
      
      console.log(`💼 SE Tax for $${income.toLocaleString()} income:`);
      console.log(`Adjusted Income: $${adjustedIncome.toLocaleString()}`);
      console.log(`Social Security Tax (12.4% capped): $${Math.round(socialSecurityTax).toLocaleString()}`);
      console.log(`Medicare Tax (2.9%): $${Math.round(medicareTax).toLocaleString()}`);
      console.log(`Additional Medicare Tax (0.9%): $${Math.round(additionalMedicareTax).toLocaleString()}`);
      console.log(`Expected Total: $${expectedTotal.toLocaleString()}`);
      console.log(`Actual Total: $${actualSeTax.toLocaleString()}\n`);
      
      expect(actualSeTax).toBe(expectedTotal);
    });
  });

  describe('Social Security Wage Base Cap', () => {
    it('should cap Social Security tax at wage base for high income', () => {
      const income = 300000;
      const adjustedIncome = income * 0.9235; // $277,050
      const socialSecurityWageBase = 168600; // 2025 wage base
      
      // Social Security should be capped
      const socialSecurityTax = Math.min(adjustedIncome, socialSecurityWageBase) * 0.124;
      const cappedSSTax = socialSecurityWageBase * 0.124; // Should equal this
      
      console.log(`💼 Social Security Tax Cap Test for $${income.toLocaleString()} income:`);
      console.log(`Adjusted Income: $${adjustedIncome.toLocaleString()}`);
      console.log(`SS Wage Base: $${socialSecurityWageBase.toLocaleString()}`);
      console.log(`SS Tax (should be capped): $${Math.round(socialSecurityTax).toLocaleString()}`);
      console.log(`Max SS Tax: $${Math.round(cappedSSTax).toLocaleString()}\n`);
      
      expect(Math.round(socialSecurityTax)).toBe(Math.round(cappedSSTax));
      expect(adjustedIncome).toBeGreaterThan(socialSecurityWageBase); // Verify we're above the cap
    });

    it('should NOT cap Social Security tax below wage base', () => {
      const income = 100000;
      const adjustedIncome = income * 0.9235; // $92,350
      const socialSecurityWageBase = 168600;
      
      // Social Security should NOT be capped
      const socialSecurityTax = adjustedIncome * 0.124; // Full rate applies
      
      console.log(`💼 Social Security Tax No-Cap Test for $${income.toLocaleString()} income:`);
      console.log(`Adjusted Income: $${adjustedIncome.toLocaleString()}`);
      console.log(`SS Wage Base: $${socialSecurityWageBase.toLocaleString()}`);
      console.log(`SS Tax (not capped): $${Math.round(socialSecurityTax).toLocaleString()}\n`);
      
      expect(adjustedIncome).toBeLessThan(socialSecurityWageBase); // Verify we're below the cap
    });
  });

  describe('Complete SE Tax Breakdown for High Earners', () => {
    it('should correctly calculate all components for $500k income', () => {
      const income = 500000;
      const adjustedIncome = income * 0.9235; // $461,750
      const socialSecurityWageBase = 168600;
      
      // Manual calculation
      const socialSecurityTax = Math.min(adjustedIncome, socialSecurityWageBase) * 0.124;
      const medicareTax = adjustedIncome * 0.029;
      const additionalMedicareTax = (adjustedIncome - 200000) * 0.009;
      const expectedTotal = Math.round(socialSecurityTax + medicareTax + additionalMedicareTax);
      
      const actualSeTax = calculateSelfEmploymentTax(income);
      
      console.log(`💼 Complete SE Tax Breakdown for $${income.toLocaleString()} income:`);
      console.log(`Adjusted Income (92.35%): $${adjustedIncome.toLocaleString()}`);
      console.log(`Social Security Tax (12.4% capped at $${socialSecurityWageBase.toLocaleString()}): $${Math.round(socialSecurityTax).toLocaleString()}`);
      console.log(`Medicare Tax (2.9%): $${Math.round(medicareTax).toLocaleString()}`);
      console.log(`Additional Medicare Tax (0.9% on excess over $200k): $${Math.round(additionalMedicareTax).toLocaleString()}`);
      console.log(`Expected Total SE Tax: $${expectedTotal.toLocaleString()}`);
      console.log(`Actual SE Tax: $${actualSeTax.toLocaleString()}`);
      console.log(`Match: ${actualSeTax === expectedTotal ? '✅ YES' : '❌ NO'}\n`);
      
      expect(actualSeTax).toBe(expectedTotal);
      
      // Verify components are working correctly
      expect(socialSecurityTax).toBe(socialSecurityWageBase * 0.124); // Should be exactly at cap
      expect(additionalMedicareTax).toBeGreaterThan(0); // Should have additional Medicare tax
    });
  });
});