'use client'

import { useState } from 'react'
import { useBYOAPI } from '@/hooks/useBYOAPI'
import { APICredentials } from '@/types/byo-api'
import Card from './ui/Card'
import Button from './ui/Button'
import { Settings, Eye, EyeOff, Check, X, Loader } from 'lucide-react'

export default function BYOAPIPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const { credentials, validationStatus, updateCredentials, validateCredentials, clearCredentials, isSecuring } = useBYOAPI()

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleCredentialChange = (service: string, field: string, value: string) => {
    const serviceKey = service as keyof APICredentials
    const current = credentials[serviceKey] || {} as any
    updateCredentials(service, { ...current, [field]: value })
  }

  const getStatusIcon = (service: string) => {
    const status = validationStatus[service]
    if (status === 'pending') return <Loader className="w-4 h-4 animate-spin text-yellow-500" />
    if (status === 'valid') return <Check className="w-4 h-4 text-green-500" />
    if (status === 'invalid') return <X className="w-4 h-4 text-red-500" />
    return null
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">BYO-API Configuration</h2>
              {isSecuring && (
                <div className="flex items-center gap-2 px-2 py-1 bg-violet/20 border border-violet/30 rounded text-[10px] text-violet uppercase tracking-widest font-bold animate-pulse">
                  <Loader className="w-3 h-3 animate-spin" />
                  Securing Credentials
                </div>
              )}
            </div>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* AWS Credentials */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-medium text-white">AWS Credentials</h3>
              {getStatusIcon('aws')}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Access Key ID</label>
                <input
                  type="text"
                  value={credentials.aws?.accessKeyId || ''}
                  onChange={(e) => handleCredentialChange('aws', 'accessKeyId', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                  placeholder="AKIA..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Secret Access Key</label>
                <div className="relative">
                  <input
                    type={showSecrets.awsSecret ? 'text' : 'password'}
                    value={credentials.aws?.secretAccessKey || ''}
                    onChange={(e) => handleCredentialChange('aws', 'secretAccessKey', e.target.value)}
                    className="w-full p-2 pr-10 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('awsSecret')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showSecrets.awsSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Region</label>
                <select
                  value={credentials.aws?.region || ''}
                  onChange={(e) => handleCredentialChange('aws', 'region', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                >
                  <option value="">Select Region</option>
                  <option value="us-east-1">us-east-1</option>
                  <option value="us-west-2">us-west-2</option>
                  <option value="eu-west-1">eu-west-1</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => validateCredentials('aws')} disabled={validationStatus.aws === 'pending'}>
                  Validate AWS
                </Button>
                <Button variant="ghost" onClick={() => clearCredentials('aws')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Stripe Credentials */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-medium text-white">Stripe</h3>
              {getStatusIcon('stripe')}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Publishable Key</label>
                <input
                  type="text"
                  value={credentials.stripe?.publishableKey || ''}
                  onChange={(e) => handleCredentialChange('stripe', 'publishableKey', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                  placeholder="pk_..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Secret Key</label>
                <div className="relative">
                  <input
                    type={showSecrets.stripeSecret ? 'text' : 'password'}
                    value={credentials.stripe?.secretKey || ''}
                    onChange={(e) => handleCredentialChange('stripe', 'secretKey', e.target.value)}
                    className="w-full p-2 pr-10 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                    placeholder="sk_..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('stripeSecret')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showSecrets.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => validateCredentials('stripe')} disabled={validationStatus.stripe === 'pending'}>
                  Validate Stripe
                </Button>
                <Button variant="ghost" onClick={() => clearCredentials('stripe')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Twilio Credentials */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-medium text-white">Twilio</h3>
              {getStatusIcon('twilio')}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Account SID</label>
                <input
                  type="text"
                  value={credentials.twilio?.accountSid || ''}
                  onChange={(e) => handleCredentialChange('twilio', 'accountSid', e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                  placeholder="AC..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Auth Token</label>
                <div className="relative">
                  <input
                    type={showSecrets.twilioToken ? 'text' : 'password'}
                    value={credentials.twilio?.authToken || ''}
                    onChange={(e) => handleCredentialChange('twilio', 'authToken', e.target.value)}
                    className="w-full p-2 pr-10 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('twilioToken')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showSecrets.twilioToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => validateCredentials('twilio')} disabled={validationStatus.twilio === 'pending'}>
                  Validate Twilio
                </Button>
                <Button variant="ghost" onClick={() => clearCredentials('twilio')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* SendGrid Credentials */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-medium text-white">SendGrid</h3>
              {getStatusIcon('sendgrid')}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showSecrets.sendgridKey ? 'text' : 'password'}
                    value={credentials.sendgrid?.apiKey || ''}
                    onChange={(e) => handleCredentialChange('sendgrid', 'apiKey', e.target.value)}
                    className="w-full p-2 pr-10 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                    placeholder="SG..."
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('sendgridKey')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                  >
                    {showSecrets.sendgridKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => validateCredentials('sendgrid')} disabled={validationStatus.sendgrid === 'pending'}>
                  Validate SendGrid
                </Button>
                <Button variant="ghost" onClick={() => clearCredentials('sendgrid')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
