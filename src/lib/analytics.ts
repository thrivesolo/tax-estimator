type AnalyticsEvent = {
  name: string
  properties?: Record<string, unknown>
}

class Analytics {
  private isInitialized = false

  init() {
    if (typeof window === 'undefined') return
    
    // In production, you would initialize your analytics service here
    // For now, we'll just log to console in development
    this.isInitialized = true
    this.track('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
    })
  }

  track(eventName: string, properties?: Record<string, unknown>) {
    if (!this.isInitialized) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event)
    }

    // In production, you would send this to your analytics service
    // Example: window.gtag('event', eventName, properties)
    // Example: window.mixpanel.track(eventName, properties)
    // Example: window.plausible('event', { name: eventName, props: properties })
  }

  // Specific tracking methods for common events
  trackFormSubmission(formName: string, data?: Record<string, unknown>) {
    this.track('form_submission', {
      form_name: formName,
      ...data,
    })
  }

  trackCalculation(input: {
    annualIncome: number
    previousYearTax: number
    currentYearPayments?: number
  }) {
    this.track('tax_calculation', {
      annual_income_range: this.getIncomeRange(input.annualIncome),
      previous_year_tax_range: this.getTaxRange(input.previousYearTax),
      has_current_payments: (input.currentYearPayments || 0) > 0,
    })
  }

  trackPaymentClick() {
    this.track('irs_payment_click', {
      source: 'results_page',
    })
  }

  private getIncomeRange(income: number): string {
    if (income < 25000) return 'under_25k'
    if (income < 50000) return '25k_50k'
    if (income < 75000) return '50k_75k'
    if (income < 100000) return '75k_100k'
    if (income < 150000) return '100k_150k'
    if (income < 250000) return '150k_250k'
    return 'over_250k'
  }

  private getTaxRange(tax: number): string {
    if (tax < 5000) return 'under_5k'
    if (tax < 10000) return '5k_10k'
    if (tax < 25000) return '10k_25k'
    if (tax < 50000) return '25k_50k'
    return 'over_50k'
  }
}

export const analytics = new Analytics()