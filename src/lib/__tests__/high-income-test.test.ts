import { calculateQuarterlyPayments, calculateTotalTax } from '../tax-calculations';

describe('High Income Tax Calculations', () => {
  it('should test very high income scenarios', () => {
    console.log('\n💰 High Income Tax Calculator Test Results\n');

    // Test 1: $500,000 income
    console.log('📊 Test 1: High earner $500,000');
    const highEarner = calculateQuarterlyPayments({
      annualIncome: 500000,
      previousYearTax: 120000,
      currentYearPayments: 30000
    });

    const taxBreakdown500k = calculateTotalTax(500000);
    console.log(`Annual Income: $500,000`);
    console.log(`Income Tax: $${taxBreakdown500k.incomeTax.toLocaleString()}`);
    console.log(`Self-Employment Tax: $${taxBreakdown500k.seTax.toLocaleString()}`);
    console.log(`Total Annual Tax: $${highEarner.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${highEarner.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${highEarner.totalDue.toLocaleString()}`);
    console.log(`Effective Tax Rate: ${((taxBreakdown500k.totalTax / 500000) * 100).toFixed(1)}%\n`);

    // Test 2: $1,000,000 income
    console.log('📊 Test 2: Very high earner $1,000,000');
    const veryHighEarner = calculateQuarterlyPayments({
      annualIncome: 1000000,
      previousYearTax: 300000,
      currentYearPayments: 75000
    });

    const taxBreakdown1m = calculateTotalTax(1000000);
    console.log(`Annual Income: $1,000,000`);
    console.log(`Income Tax: $${taxBreakdown1m.incomeTax.toLocaleString()}`);
    console.log(`Self-Employment Tax: $${taxBreakdown1m.seTax.toLocaleString()}`);
    console.log(`Total Annual Tax: $${veryHighEarner.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${veryHighEarner.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${veryHighEarner.totalDue.toLocaleString()}`);
    console.log(`Effective Tax Rate: ${((taxBreakdown1m.totalTax / 1000000) * 100).toFixed(1)}%\n`);

    // Test 3: $2,000,000 income
    console.log('📊 Test 3: Ultra high earner $2,000,000');
    const ultraHighEarner = calculateQuarterlyPayments({
      annualIncome: 2000000,
      previousYearTax: 650000,
      currentYearPayments: 150000
    });

    const taxBreakdown2m = calculateTotalTax(2000000);
    console.log(`Annual Income: $2,000,000`);
    console.log(`Income Tax: $${taxBreakdown2m.incomeTax.toLocaleString()}`);
    console.log(`Self-Employment Tax: $${taxBreakdown2m.seTax.toLocaleString()}`);
    console.log(`Total Annual Tax: $${ultraHighEarner.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${ultraHighEarner.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${ultraHighEarner.totalDue.toLocaleString()}`);
    console.log(`Effective Tax Rate: ${((taxBreakdown2m.totalTax / 2000000) * 100).toFixed(1)}%\n`);

    // Analysis
    console.log('🔍 Analysis of potential missing tax components:');
    console.log('1. Net Investment Income Tax (NIIT): 3.8% on investment income over $200k');
    console.log('2. Additional Medicare Tax: 0.9% on wages/SE income over $200k (✅ Already included)');
    console.log('3. State taxes: Not included (as per requirements)');
    console.log('4. Alternative Minimum Tax (AMT): Complex calculation not included');
    console.log('5. Qualified Business Income (QBI) deduction: 20% deduction for some business income\n');

    // Verify calculations are reasonable
    expect(highEarner.totalAnnualTax).toBeGreaterThan(100000);
    expect(veryHighEarner.totalAnnualTax).toBeGreaterThan(250000);
    expect(ultraHighEarner.totalAnnualTax).toBeGreaterThan(500000);
  });
});