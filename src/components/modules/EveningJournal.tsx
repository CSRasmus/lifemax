import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Slider } from '../ui/Slider'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

export function EveningJournal() {
  const day = useLifeMaxStore((s) => s.getToday())
  const updateJournal = useLifeMaxStore((s) => s.updateJournal)
  const addTomorrow = useLifeMaxStore((s) => s.addTomorrowTask)
  const removeTomorrow = useLifeMaxStore((s) => s.removeTomorrowTask)
  const [newTask, setNewTask] = useState('')

  return (
    <Card>
      <ModuleHeader icon="📓" title="Evening Journal & Planning" subtitle="Reflect today · Plan tomorrow" />

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-accent">Tomorrow&apos;s Objectives</h3>
        <div className="space-y-2">
          {day.tomorrowTasks.map((task) => (
            <div key={task.id} className="group flex items-center gap-2 rounded-lg bg-bg-elevated px-3 py-2">
              <span className="text-accent">→</span>
              <span className="flex-1 text-sm text-white">{task.text}</span>
              <button type="button" onClick={() => removeTomorrow(task.id)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Plan tomorrow's key objective..."
            className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTask.trim()) {
                addTomorrow(newTask.trim())
                setNewTask('')
              }
            }}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (newTask.trim()) {
                addTomorrow(newTask.trim())
                setNewTask('')
              }
            }}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-accent">Daily Log</h3>
        <Slider
          label="Sleep Duration"
          value={day.journal.sleepDuration}
          min={0}
          max={12}
          step={0.5}
          suffix="h"
          onChange={(v) => updateJournal({ sleepDuration: v })}
        />
        <Slider label="Sleep Quality" value={day.journal.sleepQuality} onChange={(v) => updateJournal({ sleepQuality: v })} />
        <Slider label="Energy Levels" value={day.journal.energy} onChange={(v) => updateJournal({ energy: v })} />
        <Slider label="Libido & Mood" value={day.journal.libidoMood} onChange={(v) => updateJournal({ libidoMood: v })} />
        <textarea
          value={day.journal.text}
          onChange={(e) => updateJournal({ text: e.target.value })}
          placeholder="Quick evening reflection..."
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-bg-primary px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 focus:border-accent focus:outline-none"
        />
      </div>
    </Card>
  )
}
