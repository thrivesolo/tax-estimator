export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Quarterly Tax Estimator",
    "description": "Free quarterly tax calculator for freelancers, consultants, and solo business owners",
    "url": "https://yourdomain.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Calculate federal estimated quarterly tax payments",
      "Safe harbor calculations",
      "Self-employment tax calculations",
      "Mobile responsive design",
      "No registration required"
    ],
    "screenshot": "https://yourdomain.com/screenshot.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}