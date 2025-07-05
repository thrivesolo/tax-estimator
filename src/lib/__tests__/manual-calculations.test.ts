import { calculateQuarterlyPayments, calculateTotalTax } from '../tax-calculations';

describe('Manual Tax Calculation Examples', () => {
  it('should show realistic calculations for different income levels', () => {
    console.log('\n🧮 Tax Calculator Test Results\n');

    // Test 1: Typical freelancer scenario
    console.log('📊 Test 1: Freelancer earning $75,000');
    const freelancer = calculateQuarterlyPayments({
      annualIncome: 75000,
      previousYearTax: 15000,
      currentYearPayments: 0
    });

    console.log(`Annual Income: $75,000`);
    console.log(`Total Annual Tax: $${freelancer.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${freelancer.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${freelancer.totalDue.toLocaleString()}`);
    console.log(`Remaining Payments: $${freelancer.remainingPayments.toLocaleString()}\n`);

    // Test 2: High-income consultant
    console.log('📊 Test 2: Consultant earning $200,000');
    const consultant = calculateQuarterlyPayments({
      annualIncome: 200000,
      previousYearTax: 45000,
      currentYearPayments: 12000
    });

    console.log(`Annual Income: $200,000`);
    console.log(`Total Annual Tax: $${consultant.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${consultant.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${consultant.totalDue.toLocaleString()}`);
    console.log(`Remaining Payments: $${consultant.remainingPayments.toLocaleString()}\n`);

    // Test 3: Part-time gig worker
    console.log('📊 Test 3: Gig worker earning $25,000');
    const gigWorker = calculateQuarterlyPayments({
      annualIncome: 25000,
      previousYearTax: 2000,
      currentYearPayments: 0
    });

    console.log(`Annual Income: $25,000`);
    console.log(`Total Annual Tax: $${gigWorker.totalAnnualTax.toLocaleString()}`);
    console.log(`Quarterly Payment: $${gigWorker.quarterlyPayments[0].amount.toLocaleString()}`);
    console.log(`Total Due: $${gigWorker.totalDue.toLocaleString()}`);
    console.log(`Remaining Payments: $${gigWorker.remainingPayments.toLocaleString()}\n`);

    // Test 4: Tax breakdown for $100k income
    console.log('📊 Test 4: Tax breakdown for $100,000 income');
    const taxBreakdown = calculateTotalTax(100000);
    console.log(`Gross Income: $100,000`);
    console.log(`Income Tax: $${taxBreakdown.incomeTax.toLocaleString()}`);
    console.log(`Self-Employment Tax: $${taxBreakdown.seTax.toLocaleString()}`);
    console.log(`Total Tax: $${taxBreakdown.totalTax.toLocaleString()}`);
    console.log(`AGI: $${taxBreakdown.agi.toLocaleString()}`);
    console.log(`Effective Tax Rate: ${((taxBreakdown.totalTax / 100000) * 100).toFixed(1)}%\n`);

    // Verify the calculations are reasonable
    expect(freelancer.totalAnnualTax).toBeGreaterThan(10000);
    expect(consultant.totalAnnualTax).toBeGreaterThan(40000);
    expect(gigWorker.totalAnnualTax).toBeGreaterThan(2000);
    expect(taxBreakdown.totalTax).toBeGreaterThan(15000);
  });
});