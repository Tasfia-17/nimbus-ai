import React from 'react'
import { motion } from 'framer-motion'

interface CredentialSectionProps {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}

export const CredentialSection: React.FC<CredentialSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle
}) => (
  <motion.div
    initial={false}
    animate={{ height: isExpanded ? 'auto' : '60px' }}
    className="glass-panel rounded-lg overflow-hidden"
  >
    <button
      onClick={onToggle}
      className="w-full p-4 text-left flex justify-between items-center hover:bg-white/5"
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        className="text-accent"
      >
        ▼
      </motion.div>
    </button>
    {isExpanded && (
      <div className="p-4 border-t border-white/10">
        {children}
      </div>
    )}
  </motion.div>
)

interface CredentialInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export const CredentialInput: React.FC<CredentialInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg 
                 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
    />
  </div>
)

interface ValidationButtonProps {
  onValidate: () => void
  isValidating: boolean
  isValid?: boolean
}

export const ValidationButton: React.FC<ValidationButtonProps> = ({
  onValidate,
  isValidating,
  isValid
}) => (
  <motion.button
    onClick={onValidate}
    disabled={isValidating}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      isValid === true
        ? 'bg-green-600 text-white'
        : isValid === false
        ? 'bg-red-600 text-white'
        : 'bg-accent text-primary hover:bg-accent/90'
    }`}
  >
    {isValidating ? 'Validating...' : isValid === true ? 'Valid ✓' : isValid === false ? 'Invalid ✗' : 'Validate'}
  </motion.button>
)
