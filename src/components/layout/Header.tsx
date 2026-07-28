import { Flame, Settings } from 'lucide-react'
import { ProgressRing } from '../ui/ProgressRing'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'
import { calculateScore, STREAK_THRESHOLD } from '../../utils/score'

interface HeaderProps {
  onOpenSettings: () => void
}

export function Header({ onOpenSettings }: HeaderProps) {
  const day = useLifeMaxStore((s) => s.getToday())
  const streak = useLifeMaxStore((s) => s.streak)
  const score = calculateScore(day)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-accent">Life</span>
            <span className="text-white">Max</span>
          </h1>
          <p className="text-xs text-text-secondary">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-bg-elevated px-3 py-1.5">
            <Flame size={16} className="text-accent" />
            <span className="text-sm font-bold text-white">{streak}</span>
            <span className="text-[10px] text-text-secondary">day streak</span>
          </div>
          <ProgressRing score={score.total} size={64} />
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-xl border border-border bg-bg-elevated p-2.5 text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      {score.total >= STREAK_THRESHOLD && (
        <div className="bg-accent/10 py-1 text-center text-xs font-semibold text-accent">
          High performance day — streak eligible!
        </div>
      )}
    </header>
  )
}

export function ScoreBreakdownBar() {
  const day = useLifeMaxStore((s) => s.getToday())
  const breakdown = calculateScore(day)

  const segments = [
    { label: '2+1', value: breakdown.twoPlusOne + breakdown.resistanceBonus, color: '#00ff66' },
    { label: 'Workout', value: breakdown.workout, color: '#10b981' },
    { label: 'Routines', value: breakdown.routines, color: '#34d399' },
    { label: 'Supps', value: breakdown.supplements, color: '#6ee7b7' },
    { label: 'Journal', value: breakdown.journal, color: '#a7f3d0' },
    { label: 'Discipline', value: breakdown.inhibitions + breakdown.inhibitionBonus, color: '#059669' },
    { label: 'Hydration', value: breakdown.hydration, color: '#047857' },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-bg-elevated">
        {segments.map((seg) =>
          seg.value > 0 ? (
            <div
              key={seg.label}
              className="h-full transition-all duration-500"
              style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${Math.round(seg.value)}%`}
            />
          ) : null,
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((seg) => (
          <span key={seg.label} className="text-[10px] text-text-secondary">
            <span className="inline-block h-1.5 w-1.5 rounded-full mr-1" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  )
}
