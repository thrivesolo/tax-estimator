import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /quarterly tax estimator/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the skip to main content link', () => {
    render(<Home />)
    
    const skipLink = screen.getByText(/skip to main content/i)
    
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveClass('sr-only')
  })

  it('renders the tax calculator component', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('id', 'main-content')
  })

  it('renders the footer with disclaimer', () => {
    render(<Home />)
    
    const footer = screen.getByText(/this tool provides estimates only/i)
    
    expect(footer).toBeInTheDocument()
  })
})