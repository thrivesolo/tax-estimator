# Quarterly Tax Estimator MVP - Project Plan

## Project Overview
A simple, mobile-responsive web app for solo business owners (consultants, coaches, freelancers, gig workers) to calculate quarterly estimated federal tax payments. MVP focuses on core calculation functionality with premium UI/UX.

## Target Users
- Online service-based businesses
- Consultants and coaches
- Freelancers and gig workers
- Solo entrepreneurs

## Tech Stack
- **Frontend**: Next.js 14 (React with TypeScript)
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Supabase (prepared for future user authentication)
- **Deployment**: Vercel
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest and React Testing Library

## Development Checkpoints

### Checkpoint 1: Project Setup & Basic Structure
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with custom design tokens for premium feel
- [ ] Set up ESLint and Prettier for code quality
- [ ] Create basic project structure and organized folder hierarchy
- [ ] Set up Supabase project configuration (for future use)
- [ ] Configure automatic deployment to Vercel
- [ ] Set up basic environment variables and configuration

### Checkpoint 2: Core Tax Calculator Logic
- [ ] Research current federal tax brackets and rates
- [ ] Implement federal income tax calculation utilities
- [ ] Build self-employment tax calculation (15.3% on net earnings)
- [ ] Create quarterly payment calculation logic
  - Safe harbor of 100% of last year's taxes (or 110% if income >$150k), or
  - 90% of current year's projected taxes
- [ ] Add comprehensive unit tests for all calculation functions
- [ ] Validate calculations with real-world tax scenarios
- [ ] Handle edge cases and input validation

### Checkpoint 3: User Interface & Form Design
- [x] Design and implement premium UI component library
- [x] Create main calculator form with minimal required input fields:
  - Estimated annual income
  - Previous year's tax liability
  - Current year payments made (optional)
- [x] Build clear, easy-to-interpret results display component
- [x] Add comprehensive form validation and user-friendly error messages
- [x] Implement fully responsive design for mobile and desktop
- [x] Add loading states and smooth transitions

### Checkpoint 4: Final Features & Polish
- [x] Add prominent "Pay Now" button linking to IRS Direct Pay website
- [x] Include clear disclaimer text: "This is not tax advice. Always consult a tax pro."
- [x] Implement subtle micro-interactions and premium feel elements
- [x] Add basic analytics tracking (page views, form submissions)
- [x] Final UI polish, accessibility improvements, and cross-browser testing
- [x] Optimize performance and bundle size

### Checkpoint 5: Testing & Deployment
- [x] Comprehensive testing across multiple devices and screen sizes
- [x] Performance optimization and Core Web Vitals improvement
- [x] Basic SEO optimization (meta tags, structured data)
- [x] Deploy to production environment on Vercel
- [x] Conduct smoke testing and user acceptance testing on live site
- [x] Set up monitoring and error tracking

## Key Features for MVP
- **Simple Input Form**: Minimal fields for maximum usability
- **Federal Tax Only**: Focus on federal estimated taxes (no state calculations)
- **Quarterly Breakdown**: Clear display of each quarterly payment amount
- **Mobile-Responsive**: Premium UI that works perfectly on all devices
- **IRS Integration**: Direct link to official IRS Direct Pay website
- **Legal Protection**: Clear disclaimer about tax advice
- **No Authentication**: Keep it simple for MVP testing

## Input Fields (Minimal Set)
1. **Estimated Annual Income**: Total expected income for the year
2. **Previous Year Tax Liability**: Used for safe harbor calculations
3. **Current Year Payments Made**: Any estimated payments already made (optional)

## Output Display
- **Quarterly Payment Amounts**: Clear breakdown of Q1, Q2, Q3, Q4 payments
- **Total Annual Estimate**: Summary of total estimated tax liability
- **Payment Due Dates**: Clear display of quarterly due dates
- **IRS Direct Pay Button**: Prominent call-to-action for payments

## Future Enhancements (Post-MVP)
- User authentication and account management
- Historical data tracking and year-over-year comparisons
- Email reminder system for payment due dates
- Export functionality (PDF reports, CSV data)
- Advanced tax scenarios (multiple income streams, estimated deductions)

## Success Metrics for MVP
- Successful deployment to Vercel
- Accurate tax calculations validated against known scenarios
- Mobile-responsive design working across devices
- Form completion rate and user feedback
- Performance metrics (load time, Core Web Vitals)

## Technical Considerations
- **Calculation Accuracy**: All tax calculations must be thoroughly tested
- **Data Privacy**: No sensitive financial data stored (for MVP)
- **Performance**: Fast loading and smooth interactions
- **Accessibility**: WCAG compliance for inclusive design
- **SEO**: Basic optimization for organic discovery
