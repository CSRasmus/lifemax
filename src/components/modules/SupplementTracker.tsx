import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

export function SupplementTracker() {
  const day = useLifeMaxStore((s) => s.getToday())
  const toggle = useLifeMaxStore((s) => s.toggleSupplement)
  const addCustom = useLifeMaxStore((s) => s.addCustomSupplement)
  const remove = useLifeMaxStore((s) => s.removeSupplement)
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')

  const taken = day.supplements.filter((s) => s.taken).length

  return (
    <Card>
      <ModuleHeader icon="💊" title="Supplement Tracker" subtitle={`${taken}/${day.supplements.length} taken today`} />
      <div className="space-y-2">
        {day.supplements.map((sup) => (
          <div
            key={sup.id}
            className={`group flex items-center justify-between rounded-xl border p-3 transition-colors ${
              sup.taken ? 'border-accent/30 bg-accent/5' : 'border-border bg-bg-elevated/50'
            }`}
          >
            <Checkbox
              checked={sup.taken}
              onChange={() => toggle(sup.id)}
              label={sup.name}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">{sup.dosage}</span>
              {sup.custom && (
                <button type="button" onClick={() => remove(sup.id)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Supplement name"
          className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        />
        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Dosage"
          className="w-28 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (name.trim()) {
              addCustom(name.trim(), dosage.trim() || 'Custom')
              setName('')
              setDosage('')
            }
          }}
        >
          <Plus size={14} />
        </Button>
      </div>
    </Card>
  )
}
