import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quarterly Tax Estimator - Calculate Federal Estimated Tax Payments",
  description: "Free quarterly tax calculator for freelancers, consultants, and solo business owners. Calculate your federal estimated tax payments with our simple, accurate tool.",
  keywords: "quarterly taxes, estimated tax payments, tax calculator, freelancer taxes, self-employment tax, 1099 taxes, federal tax calculator",
  authors: [{ name: "Quarterly Tax Estimator" }],
  openGraph: {
    title: "Quarterly Tax Estimator - Calculate Federal Estimated Tax Payments",
    description: "Free quarterly tax calculator for freelancers and solo business owners",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
