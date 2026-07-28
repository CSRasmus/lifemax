export type ModuleId =
  | 'daily-two-plus-one'
  | 'workout'
  | 'routines'
  | 'supplements'
  | 'evening-journal'
  | 'inhibition'
  | 'hydration'
  | 'biomarkers'
  | 'diet'

export interface ModuleConfig {
  id: ModuleId
  enabled: boolean
  order: number
}

export interface TaskItem {
  text: string
  completed: boolean
}

export interface DailyTwoPlusOne {
  task1: TaskItem
  task2: TaskItem
  resistance: TaskItem
}

export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: string
  weight: number
  completed: boolean
}

export interface WorkoutDay {
  id: string
  dayLabel: string
  name: string
  type: 'workout' | 'rest' | 'active-recovery'
  exercises: WorkoutExercise[]
  completed: boolean
}

export interface RoutineItem {
  id: string
  text: string
  completed: boolean
}

export interface RoutineSlot {
  id: 'morning' | 'midday' | 'evening'
  label: string
  items: RoutineItem[]
}

export interface Supplement {
  id: string
  name: string
  dosage: string
  taken: boolean
  custom?: boolean
}

export interface TomorrowTask {
  id: string
  text: string
}

export interface JournalEntry {
  sleepDuration: number
  sleepQuality: number
  energy: number
  libidoMood: number
  text: string
}

export interface InhibitionItem {
  id: string
  text: string
  avoided: boolean
}

export interface HydrationState {
  currentMl: number
  goalMl: number
  fastingStart: string | null
  fastingEnd: string | null
  eatingWindowStart: string
  eatingWindowEnd: string
}

export interface DietFoodItem {
  id: string
  name: string
  amount: string
  kcal: number
  eaten: boolean
}

export interface DietMeal {
  id: string
  time: string
  label: string
  items: DietFoodItem[]
}

export interface DietPlan {
  meals: DietMeal[]
}

export interface BiomarkerEntry {
  id: string
  date: string
  totalTestosterone?: number
  freeTestosterone?: number
  shbg?: number
  vitaminD?: number
  zinc?: number
  estradiol?: number
  notes?: string
}

export interface NotificationSetting {
  enabled: boolean
  time: string
  label: string
}

export interface NotificationSettings {
  morningLight: NotificationSetting
  caffeineCutoff: NotificationSetting
  windDown: NotificationSetting
}

export interface DayData {
  twoPlusOne: DailyTwoPlusOne
  workoutDays: WorkoutDay[]
  routines: RoutineSlot[]
  supplements: Supplement[]
  tomorrowTasks: TomorrowTask[]
  journal: JournalEntry
  inhibitions: InhibitionItem[]
  hydration: HydrationState
  dietPlan: DietPlan
}

export interface ScoreBreakdown {
  total: number
  twoPlusOne: number
  workout: number
  routines: number
  supplements: number
  journal: number
  inhibitions: number
  hydration: number
  resistanceBonus: number
  inhibitionBonus: number
}

export const MODULE_LABELS: Record<ModuleId, string> = {
  'daily-two-plus-one': 'Daily 2+1',
  workout: 'Workout Planner',
  routines: 'Daily Routines',
  supplements: 'Supplements',
  'evening-journal': 'Evening Journal',
  inhibition: "Don't Do This",
  hydration: 'Hydration & Fasting',
  biomarkers: 'Biomarkers',
  diet: 'Kostschema',
}

export const MODULE_ICONS: Record<ModuleId, string> = {
  'daily-two-plus-one': '🎯',
  workout: '💪',
  routines: '☀️',
  supplements: '💊',
  'evening-journal': '📓',
  inhibition: '🚫',
  hydration: '💧',
  biomarkers: '🩸',
  diet: '🍽️',
}
