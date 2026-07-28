import { useState } from 'react'
import { Plus, Trash2, Shield } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

export function InhibitionTracker() {
  const day = useLifeMaxStore((s) => s.getToday())
  const toggle = useLifeMaxStore((s) => s.toggleInhibition)
  const add = useLifeMaxStore((s) => s.addInhibition)
  const remove = useLifeMaxStore((s) => s.removeInhibition)
  const [newItem, setNewItem] = useState('')

  const clean = day.inhibitions.filter((i) => i.avoided).length
  const allClean = day.inhibitions.length > 0 && clean === day.inhibitions.length

  return (
    <Card glow={allClean}>
      <ModuleHeader icon="🚫" title="Don't Do This" subtitle="Discipline tracker — stay clean for bonus points" />
      {allClean && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
          <Shield size={16} />
          Perfect discipline! +Bonus LifeMax Score
        </div>
      )}
      <div className="space-y-2">
        {day.inhibitions.map((item) => (
          <div
            key={item.id}
            className={`group flex items-center justify-between rounded-xl border p-3 ${
              item.avoided ? 'border-accent/30 bg-accent/5' : 'border-border bg-bg-elevated/50'
            }`}
          >
            <Checkbox
              checked={item.avoided}
              onChange={() => toggle(item.id)}
              label={item.text}
              special={item.avoided}
            />
            <button type="button" onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add bad habit to avoid..."
          className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newItem.trim()) {
              add(newItem.trim())
              setNewItem('')
            }
          }}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (newItem.trim()) {
              add(newItem.trim())
              setNewItem('')
            }
          }}
        >
          <Plus size={14} />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-text-secondary">{clean}/{day.inhibitions.length} avoided today</p>
    </Card>
  )
}
