import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

const SLOT_ICONS: Record<string, string> = {
  morning: '🌅',
  midday: '☀️',
  evening: '🌙',
}

export function DailyRoutines() {
  const day = useLifeMaxStore((s) => s.getToday())
  const addItem = useLifeMaxStore((s) => s.addRoutineItem)
  const updateItem = useLifeMaxStore((s) => s.updateRoutineItem)
  const removeItem = useLifeMaxStore((s) => s.removeRoutineItem)
  const [newItems, setNewItems] = useState<Record<string, string>>({})

  return (
    <Card>
      <ModuleHeader icon="☀️" title="Daily Routines" subtitle="Morning · Midday · Evening checklist" />
      <div className="space-y-4">
        {day.routines.map((slot) => {
          const done = slot.items.filter((i) => i.completed).length
          return (
            <div key={slot.id} className="rounded-xl border border-border bg-bg-elevated/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{SLOT_ICONS[slot.id]}</span>
                  <h3 className="font-semibold text-white">{slot.label}</h3>
                </div>
                <span className="text-xs text-accent">{done}/{slot.items.length}</span>
              </div>
              <div className="space-y-2">
                {slot.items.map((item) => (
                  <div key={item.id} className="group flex items-center gap-2">
                    <Checkbox
                      checked={item.completed}
                      onChange={(completed) => updateItem(slot.id, item.id, { completed })}
                      size="sm"
                    />
                    <input
                      value={item.text}
                      onChange={(e) => updateItem(slot.id, item.id, { text: e.target.value })}
                      className={`min-w-0 flex-1 bg-transparent text-sm focus:outline-none ${item.completed ? 'text-text-secondary line-through' : 'text-white'}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(slot.id, item.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100 text-text-secondary hover:text-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={newItems[slot.id] || ''}
                  onChange={(e) => setNewItems({ ...newItems, [slot.id]: e.target.value })}
                  placeholder="Add habit..."
                  className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newItems[slot.id]?.trim()) {
                      addItem(slot.id, newItems[slot.id].trim())
                      setNewItems({ ...newItems, [slot.id]: '' })
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (newItems[slot.id]?.trim()) {
                      addItem(slot.id, newItems[slot.id].trim())
                      setNewItems({ ...newItems, [slot.id]: '' })
                    }
                  }}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
