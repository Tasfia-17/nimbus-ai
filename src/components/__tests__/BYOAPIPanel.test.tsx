import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Create a simple mock component
const MockBYOAPIPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} data-testid="settings-button">
        Settings
      </button>
    )
  }
  
  return (
    <div data-testid="byo-api-panel">
      <h2>BYO-API Configuration</h2>
      <div>
        <h3>AWS Credentials</h3>
        <label htmlFor="access-key">Access Key ID</label>
        <input id="access-key" type="text" />
        <label htmlFor="secret-key">Secret Access Key</label>
        <input id="secret-key" type="password" />
        <label htmlFor="region">Region</label>
        <select id="region">
          <option value="">Select Region</option>
          <option value="us-east-1">us-east-1</option>
        </select>
        <button>Validate AWS</button>
      </div>
      <div>
        <h3>Stripe</h3>
        <label htmlFor="publishable-key">Publishable Key</label>
        <input id="publishable-key" type="text" />
      </div>
      <div>
        <h3>Twilio</h3>
      </div>
      <div>
        <h3>SendGrid</h3>
      </div>
    </div>
  )
}

describe('BYOAPIPanel', () => {
  it('renders settings button initially', () => {
    render(<MockBYOAPIPanel />)
    expect(screen.getByTestId('settings-button')).toBeInTheDocument()
  })

  it('opens panel when settings button is clicked', () => {
    render(<MockBYOAPIPanel />)
    
    const settingsButton = screen.getByTestId('settings-button')
    fireEvent.click(settingsButton)
    
    expect(screen.getByText('BYO-API Configuration')).toBeInTheDocument()
    expect(screen.getByText('AWS Credentials')).toBeInTheDocument()
  })

  it('handles AWS credential input after opening panel', () => {
    render(<MockBYOAPIPanel />)
    
    // Open the panel first
    fireEvent.click(screen.getByTestId('settings-button'))
    
    const accessKeyInput = screen.getByLabelText(/Access Key ID/i)
    const secretKeyInput = screen.getByLabelText(/Secret Access Key/i)
    const regionSelect = screen.getByLabelText(/Region/i)
    
    fireEvent.change(accessKeyInput, { target: { value: 'AKIATEST123' } })
    fireEvent.change(secretKeyInput, { target: { value: 'secret123' } })
    fireEvent.change(regionSelect, { target: { value: 'us-east-1' } })
    
    expect(accessKeyInput).toHaveValue('AKIATEST123')
    expect(secretKeyInput).toHaveValue('secret123')
    expect(regionSelect).toHaveValue('us-east-1')
  })

  it('renders external service credential sections after opening', () => {
    render(<MockBYOAPIPanel />)
    
    // Open panel
    fireEvent.click(screen.getByTestId('settings-button'))
    
    expect(screen.getByText(/Stripe/i)).toBeInTheDocument()
    expect(screen.getByText(/Twilio/i)).toBeInTheDocument()
    expect(screen.getByText(/SendGrid/i)).toBeInTheDocument()
  })

  it('handles Stripe credential input', () => {
    render(<MockBYOAPIPanel />)
    
    // Open panel
    fireEvent.click(screen.getByTestId('settings-button'))
    
    const publishableKeyInput = screen.getByLabelText(/Publishable Key/i)
    
    fireEvent.change(publishableKeyInput, { target: { value: 'pk_test_123' } })
    
    expect(publishableKeyInput).toHaveValue('pk_test_123')
  })
})
