import { useEffect, useState } from 'react'
import { Droplets, Timer, Utensils } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'
import { getFastingDuration } from '../../utils/score'

export function HydrationFasting() {
  const day = useLifeMaxStore((s) => s.getToday())
  const addWater = useLifeMaxStore((s) => s.addWater)
  const setGoal = useLifeMaxStore((s) => s.setHydrationGoal)
  const startFasting = useLifeMaxStore((s) => s.startFasting)
  const stopFasting = useLifeMaxStore((s) => s.stopFasting)
  const setEatingWindow = useLifeMaxStore((s) => s.setEatingWindow)
  const [fastDisplay, setFastDisplay] = useState('Not fasting')

  const pct = Math.min(100, Math.round((day.hydration.currentMl / day.hydration.goalMl) * 100))
  const isFasting = !!day.hydration.fastingStart

  useEffect(() => {
    if (!isFasting) {
      setFastDisplay('Not fasting')
      return
    }
    const tick = () => setFastDisplay(getFastingDuration(day.hydration.fastingStart))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [isFasting, day.hydration.fastingStart])

  return (
    <Card>
      <ModuleHeader icon="💧" title="Hydration & Fasting" subtitle="Track water intake and eating windows" />

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-accent" />
            <span className="text-sm font-semibold text-white">Water Intake</span>
          </div>
          <span className="text-sm text-accent">
            {day.hydration.currentMl} / {day.hydration.goalMl} ml
          </span>
        </div>
        <div className="mb-3 h-3 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[250, 500, 750].map((ml) => (
            <Button key={ml} size="sm" variant="secondary" onClick={() => addWater(ml)}>
              +{ml}ml
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => addWater(-250)}>
            Undo
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="text-xs text-text-secondary">Daily goal:</label>
          <input
            type="number"
            value={day.hydration.goalMl}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-bg-primary px-2 py-1 text-xs text-white"
          />
          <span className="text-xs text-text-secondary">ml</span>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-bg-elevated/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Timer size={18} className="text-accent" />
          <span className="text-sm font-semibold text-white">Fasting Timer</span>
        </div>
        <p className="mb-3 text-2xl font-black text-accent">{fastDisplay}</p>
        <div className="flex gap-2">
          {!isFasting ? (
            <Button size="sm" onClick={startFasting}>
              Start Fast
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={stopFasting}>
              End Fast
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-elevated/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Utensils size={18} className="text-accent" />
          <span className="text-sm font-semibold text-white">Eating Window</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={day.hydration.eatingWindowStart}
            onChange={(e) => setEatingWindow(e.target.value, day.hydration.eatingWindowEnd)}
            className="rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white"
          />
          <span className="text-text-secondary">to</span>
          <input
            type="time"
            value={day.hydration.eatingWindowEnd}
            onChange={(e) => setEatingWindow(day.hydration.eatingWindowStart, e.target.value)}
            className="rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white"
          />
        </div>
      </div>
    </Card>
  )
}
