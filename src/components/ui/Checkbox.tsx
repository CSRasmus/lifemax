import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { triggerHaptic } from '../../utils/score'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  special?: boolean
  size?: 'sm' | 'md'
}

export function Checkbox({ checked, onChange, label, special = false, size = 'md' }: CheckboxProps) {
  const dim = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6'

  const handleClick = () => {
    triggerHaptic(special ? [10, 30, 10] : 10)
    onChange(!checked)
  }

  return (
    <button type="button" onClick={handleClick} className="flex items-center gap-3 text-left">
      <motion.div
        whileTap={{ scale: 0.85 }}
        className={`${dim} flex shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
          checked
            ? special
              ? 'border-accent bg-accent text-bg-primary'
              : 'border-accent bg-accent/20 text-accent'
            : 'border-border bg-bg-elevated'
        }`}
      >
        {checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
            <Check size={size === 'sm' ? 12 : 16} strokeWidth={3} />
          </motion.div>
        )}
      </motion.div>
      {label && (
        <span className={`text-sm ${checked ? 'text-text-secondary line-through' : 'text-white'}`}>{label}</span>
      )}
    </button>
  )
}
