import type { DayData, ScoreBreakdown } from '../types'

const DAY_MAP: Record<number, string> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

export function getTodayWorkoutId(): string {
  return DAY_MAP[new Date().getDay()]
}

function ratio(completed: number, total: number, weight: number): number {
  if (total === 0) return weight
  return (completed / total) * weight
}

export function calculateScore(day: DayData): ScoreBreakdown {
  let twoPlusOne = 0
  let resistanceBonus = 0

  if (day.twoPlusOne.task1.text.trim()) {
    twoPlusOne += day.twoPlusOne.task1.completed ? 7 : 0
  }
  if (day.twoPlusOne.task2.text.trim()) {
    twoPlusOne += day.twoPlusOne.task2.completed ? 7 : 0
  }
  if (day.twoPlusOne.resistance.text.trim()) {
    if (day.twoPlusOne.resistance.completed) {
      twoPlusOne += 6
      resistanceBonus = 8
    }
  }

  const todayId = getTodayWorkoutId()
  const todayWorkout = day.workoutDays.find((d) => d.id === todayId)
  let workout = 0
  if (todayWorkout) {
    if (todayWorkout.type === 'rest') {
      workout = todayWorkout.completed ? 15 : 0
    } else {
      const total = todayWorkout.exercises.length
      const done = todayWorkout.exercises.filter((e) => e.completed).length
      workout = ratio(done, total, 15)
      if (todayWorkout.completed) workout = 15
    }
  }

  const routineItems = day.routines.flatMap((s) => s.items)
  const routines = ratio(
    routineItems.filter((i) => i.completed).length,
    routineItems.length,
    20,
  )

  const supplements = ratio(
    day.supplements.filter((s) => s.taken).length,
    day.supplements.length,
    10,
  )

  let journal = 0
  if (day.journal.sleepQuality > 0 || day.journal.text.trim()) {
    journal = 5
    if (day.journal.text.trim().length > 10) journal += 5
  }

  const inhibitions = day.inhibitions
  let inhibitionScore = ratio(
    inhibitions.filter((i) => i.avoided).length,
    inhibitions.length,
    12,
  )
  let inhibitionBonus = 0
  if (inhibitions.length > 0 && inhibitions.every((i) => i.avoided)) {
    inhibitionBonus = 8
  }

  const hydration = day.hydration.currentMl >= day.hydration.goalMl ? 10 : ratio(
    day.hydration.currentMl,
    day.hydration.goalMl,
    10,
  )

  const total = Math.min(
    100,
    Math.round(twoPlusOne + resistanceBonus + workout + routines + supplements + journal + inhibitionScore + inhibitionBonus + hydration),
  )

  return {
    total,
    twoPlusOne,
    workout,
    routines,
    supplements,
    journal,
    inhibitions: inhibitionScore,
    hydration,
    resistanceBonus,
    inhibitionBonus,
  }
}

export const STREAK_THRESHOLD = 70

export function isHighScoreDay(day: DayData): boolean {
  return calculateScore(day).total >= STREAK_THRESHOLD
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(isoOrTime: string): string {
  if (isoOrTime.includes('T')) {
    return new Date(isoOrTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  const [h, m] = isoOrTime.split(':')
  const d = new Date()
  d.setHours(parseInt(h), parseInt(m))
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function getFastingDuration(start: string | null): string {
  if (!start) return 'Not fasting'
  const ms = Date.now() - new Date(start).getTime()
  const hours = Math.floor(ms / 3600000)
  const mins = Math.floor((ms % 3600000) / 60000)
  return `${hours}h ${mins}m`
}

export function triggerHaptic(pattern: number | number[] = 10) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}
