import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'
import { getTodayWorkoutId } from '../../utils/score'

export function WorkoutPlanner() {
  const day = useLifeMaxStore((s) => s.getToday())
  const updateDay = useLifeMaxStore((s) => s.updateWorkoutDay)
  const updateExercise = useLifeMaxStore((s) => s.updateExercise)
  const addExercise = useLifeMaxStore((s) => s.addExercise)
  const removeExercise = useLifeMaxStore((s) => s.removeExercise)
  const [expanded, setExpanded] = useState<string | null>(getTodayWorkoutId())
  const [newEx, setNewEx] = useState<Record<string, string>>({})

  const todayId = getTodayWorkoutId()

  return (
    <Card>
      <ModuleHeader icon="💪" title="Workout Planner" subtitle="4-week split — fully editable" />
      <div className="space-y-2">
        {day.workoutDays.map((wd) => {
          const isToday = wd.id === todayId
          const isOpen = expanded === wd.id
          const doneCount = wd.exercises.filter((e) => e.completed).length

          return (
            <div
              key={wd.id}
              className={`overflow-hidden rounded-xl border ${isToday ? 'border-accent/50 bg-accent/5' : 'border-border bg-bg-elevated/50'}`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : wd.id)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-lg px-2 py-1 text-xs font-bold ${isToday ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-secondary'}`}>
                    {wd.dayLabel}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{wd.name}</p>
                    <p className="text-xs text-text-secondary">
                      {wd.type === 'rest' ? 'Rest day' : `${doneCount}/${wd.exercises.length} done`}
                      {isToday && ' · TODAY'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={wd.completed}
                    onChange={(completed) => updateDay(wd.id, { completed })}
                    size="sm"
                  />
                  {isOpen ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
                </div>
              </button>

              {isOpen && (
                <div className="space-y-2 border-t border-border p-3">
                  {wd.exercises.map((ex) => (
                    <div key={ex.id} className="flex items-center gap-2 rounded-lg bg-bg-primary p-2">
                      <Checkbox
                        checked={ex.completed}
                        onChange={(completed) => updateExercise(wd.id, ex.id, { completed })}
                        size="sm"
                      />
                      <input
                        value={ex.name}
                        onChange={(e) => updateExercise(wd.id, ex.id, { name: e.target.value })}
                        className="min-w-0 flex-1 bg-transparent text-sm text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => updateExercise(wd.id, ex.id, { sets: Number(e.target.value) })}
                        className="w-10 rounded bg-bg-elevated px-1 py-0.5 text-center text-xs text-white"
                        title="Sets"
                      />
                      <span className="text-xs text-text-secondary">×</span>
                      <input
                        value={ex.reps}
                        onChange={(e) => updateExercise(wd.id, ex.id, { reps: e.target.value })}
                        className="w-14 rounded bg-bg-elevated px-1 py-0.5 text-center text-xs text-white"
                        title="Reps"
                      />
                      <input
                        type="number"
                        value={ex.weight || ''}
                        onChange={(e) => updateExercise(wd.id, ex.id, { weight: Number(e.target.value) })}
                        placeholder="kg"
                        className="w-14 rounded bg-bg-elevated px-1 py-0.5 text-center text-xs text-white"
                        title="Weight (kg)"
                      />
                      <button type="button" onClick={() => removeExercise(wd.id, ex.id)} className="text-text-secondary hover:text-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={newEx[wd.id] || ''}
                      onChange={(e) => setNewEx({ ...newEx, [wd.id]: e.target.value })}
                      placeholder="Add exercise..."
                      className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newEx[wd.id]?.trim()) {
                          addExercise(wd.id, { name: newEx[wd.id].trim(), sets: 3, reps: '8-10', weight: 0, completed: false })
                          setNewEx({ ...newEx, [wd.id]: '' })
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (newEx[wd.id]?.trim()) {
                          addExercise(wd.id, { name: newEx[wd.id].trim(), sets: 3, reps: '8-10', weight: 0, completed: false })
                          setNewEx({ ...newEx, [wd.id]: '' })
                        }
                      }}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
