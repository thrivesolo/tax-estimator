import { TaxCalculator } from "@/components/tax-calculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Quarterly Tax Estimator
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1 sm:mt-2">
            Calculate your federal estimated tax payments for solo business owners
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <TaxCalculator />
      </main>

      <footer className="border-t border-neutral-200 bg-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-neutral-600">
            © 2025 Quarterly Tax Estimator. This tool provides estimates only.
            Always consult a tax professional for advice.
          </p>
        </div>
      </footer>
    </div>
  )
}