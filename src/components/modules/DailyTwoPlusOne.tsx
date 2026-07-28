import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { ParticleBurst } from '../ui/ParticleBurst'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

export function DailyTwoPlusOne() {
  const day = useLifeMaxStore((s) => s.getToday())
  const update = useLifeMaxStore((s) => s.updateTwoPlusOne)
  const [burst, setBurst] = useState(0)

  const fields = [
    { key: 'task1' as const, label: 'Priority Task 1', sub: 'Must Do', highlight: false },
    { key: 'task2' as const, label: 'Priority Task 2', sub: 'Must Do', highlight: false },
    { key: 'resistance' as const, label: 'The Resistance Task', sub: "Something you DON'T want to do — but WILL", highlight: true },
  ]

  return (
    <Card glow={day.twoPlusOne.resistance.completed}>
      <ModuleHeader icon="🎯" title="Daily 2+1" subtitle="Mental toughness & focus" />
      <div className="relative space-y-4">
        <ParticleBurst trigger={burst} />
        {fields.map(({ key, label, sub, highlight }) => (
          <motion.div
            key={key}
            layout
            className={`rounded-xl border p-4 ${highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-elevated/50'}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-accent' : 'text-text-secondary'}`}>
                  {label}
                </p>
                <p className="text-[11px] text-text-secondary">{sub}</p>
              </div>
              {highlight && day.twoPlusOne.resistance.completed && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">+BONUS</span>
              )}
            </div>
            <input
              type="text"
              value={day.twoPlusOne[key].text}
              onChange={(e) => update(key, { text: e.target.value })}
              placeholder={highlight ? 'Cold shower, hard call, extra set...' : 'What must get done today?'}
              className="mb-3 w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white placeholder:text-text-secondary/50 focus:border-accent focus:outline-none"
            />
            <Checkbox
              checked={day.twoPlusOne[key].completed}
              onChange={(completed) => {
                if (highlight && completed) setBurst((b) => b + 1)
                update(key, { completed })
              }}
              label={day.twoPlusOne[key].completed ? 'Completed!' : 'Mark complete'}
              special={highlight}
            />
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
