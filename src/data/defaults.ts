import type {
  BiomarkerEntry,
  DayData,
  DietPlan,
  HydrationState,
  InhibitionItem,
  JournalEntry,
  ModuleConfig,
  NotificationSettings,
  RoutineSlot,
  Supplement,
  WorkoutDay,
} from '../types'

const uid = () => crypto.randomUUID()

export const DEFAULT_MODULES: ModuleConfig[] = [
  { id: 'daily-two-plus-one', enabled: true, order: 0 },
  { id: 'workout', enabled: true, order: 1 },
  { id: 'routines', enabled: true, order: 2 },
  { id: 'supplements', enabled: true, order: 3 },
  { id: 'diet', enabled: true, order: 4 },
  { id: 'evening-journal', enabled: true, order: 5 },
  { id: 'inhibition', enabled: true, order: 6 },
  { id: 'hydration', enabled: true, order: 7 },
  { id: 'biomarkers', enabled: true, order: 8 },
]

export const DEFAULT_WORKOUT_TEMPLATE: WorkoutDay[] = [
  {
    id: 'mon',
    dayLabel: 'Mon',
    name: 'Lower Body (Heavy)',
    type: 'workout',
    completed: false,
    exercises: [
      { id: uid(), name: 'Barbell Squat', sets: 4, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Romanian Deadlift', sets: 4, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Leg Press', sets: 3, reps: '6-8', weight: 0, completed: false },
      { id: uid(), name: 'Walking Lunges', sets: 3, reps: '8/leg', weight: 0, completed: false },
    ],
  },
  {
    id: 'tue',
    dayLabel: 'Tue',
    name: 'Rest / Light Mobility',
    type: 'active-recovery',
    completed: false,
    exercises: [
      { id: uid(), name: '15-min Mobility Walk', sets: 1, reps: '15 min', weight: 0, completed: false },
      { id: uid(), name: 'Hip Flexor Stretch', sets: 2, reps: '60s/side', weight: 0, completed: false },
    ],
  },
  {
    id: 'wed',
    dayLabel: 'Wed',
    name: 'Upper Body (Heavy)',
    type: 'workout',
    completed: false,
    exercises: [
      { id: uid(), name: 'Bench Press', sets: 4, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Barbell Row', sets: 4, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Overhead Press', sets: 3, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Pull-ups', sets: 3, reps: '6-8', weight: 0, completed: false },
    ],
  },
  {
    id: 'thu',
    dayLabel: 'Thu',
    name: 'Rest / Recovery',
    type: 'rest',
    completed: false,
    exercises: [
      { id: uid(), name: 'Foam Rolling', sets: 1, reps: '10 min', weight: 0, completed: false },
      { id: uid(), name: 'Light Stretching', sets: 1, reps: '15 min', weight: 0, completed: false },
    ],
  },
  {
    id: 'fri',
    dayLabel: 'Fri',
    name: 'Full Body Compound',
    type: 'workout',
    completed: false,
    exercises: [
      { id: uid(), name: 'Deadlift', sets: 4, reps: '4-6', weight: 0, completed: false },
      { id: uid(), name: 'Incline Bench', sets: 3, reps: '6-8', weight: 0, completed: false },
      { id: uid(), name: 'Front Squat', sets: 3, reps: '6-8', weight: 0, completed: false },
      { id: uid(), name: 'Dips', sets: 3, reps: '8-10', weight: 0, completed: false },
      { id: uid(), name: 'Face Pulls', sets: 3, reps: '12-15', weight: 0, completed: false },
    ],
  },
  {
    id: 'sat',
    dayLabel: 'Sat',
    name: 'Active Recovery',
    type: 'active-recovery',
    completed: false,
    exercises: [
      { id: uid(), name: 'Light Cardio / Walk', sets: 1, reps: '30 min', weight: 0, completed: false },
      { id: uid(), name: 'Yoga / Mobility', sets: 1, reps: '20 min', weight: 0, completed: false },
    ],
  },
  {
    id: 'sun',
    dayLabel: 'Sun',
    name: 'Full Rest',
    type: 'rest',
    completed: false,
    exercises: [
      { id: uid(), name: 'Complete Rest Day', sets: 1, reps: '—', weight: 0, completed: false },
    ],
  },
]

export const DEFAULT_ROUTINES: RoutineSlot[] = [
  {
    id: 'morning',
    label: 'Morning',
    items: [
      { id: uid(), text: '10–15 min direct sunlight exposure', completed: false },
      { id: uid(), text: 'High-protein/fat breakfast (eggs, oats, nuts)', completed: false },
    ],
  },
  {
    id: 'midday',
    label: 'Midday',
    items: [
      { id: uid(), text: 'Whole food meal (red meat/fish + carbs + veggies)', completed: false },
      { id: uid(), text: 'Hydrate consistently throughout day', completed: false },
      { id: uid(), text: 'Stop caffeine intake after 14:00–15:00', completed: false },
    ],
  },
  {
    id: 'evening',
    label: 'Evening',
    items: [
      { id: uid(), text: 'Shut off screens 1h before bed', completed: false },
      { id: uid(), text: 'Cool bedroom environment (~18°C)', completed: false },
    ],
  },
]

export const DEFAULT_SUPPLEMENTS: Supplement[] = [
  { id: uid(), name: 'Vitamin D', dosage: '2000–4000 IU', taken: false },
  { id: uid(), name: 'Zinc', dosage: '15–25 mg', taken: false },
  { id: uid(), name: 'Magnesium', dosage: '300 mg (evening)', taken: false },
  { id: uid(), name: 'Creatine', dosage: '3–5 g', taken: false },
  { id: uid(), name: 'Ashwagandha', dosage: 'Optional', taken: false, custom: true },
  { id: uid(), name: 'Boron', dosage: 'Optional', taken: false, custom: true },
]

export const DEFAULT_INHIBITIONS: InhibitionItem[] = [
  { id: uid(), text: 'No alcohol today', avoided: false },
  { id: uid(), text: 'No caffeine after 15:00', avoided: false },
  { id: uid(), text: 'No screens 1h before sleep', avoided: false },
  { id: uid(), text: 'No prolonged lap-laptop use', avoided: false },
]

export const DEFAULT_JOURNAL: JournalEntry = {
  sleepDuration: 7,
  sleepQuality: 5,
  energy: 5,
  libidoMood: 5,
  text: '',
}

export const DEFAULT_HYDRATION: HydrationState = {
  currentMl: 0,
  goalMl: 3000,
  fastingStart: null,
  fastingEnd: null,
  eatingWindowStart: '12:00',
  eatingWindowEnd: '20:00',
}

export const DEFAULT_DIET_PLAN: DietPlan = {
  meals: [
    {
      id: 'midday',
      time: '12:00',
      label: 'Lunch',
      items: [
        { id: 'eggs', name: 'Ägg', amount: '4 st', kcal: 301, eaten: false },
        { id: 'bread', name: 'Franskbröd', amount: '2 st', kcal: 370, eaten: false },
        { id: 'oats', name: 'Havregryn', amount: '1 dl', kcal: 133, eaten: false },
        { id: 'milk', name: 'Standardmjölk 3%', amount: '5 dl', kcal: 300, eaten: false },
        { id: 'cheese', name: 'Ost', amount: '2 skivor / 50 g', kcal: 210, eaten: false },
        { id: 'ham', name: 'Skinka', amount: '4 skivor / 60 g', kcal: 54, eaten: false },
        { id: 'banana', name: 'Banan', amount: '1 st', kcal: 100, eaten: false },
      ],
    },
    {
      id: 'evening',
      time: '—',
      label: 'Kvällsmat',
      items: [],
    },
  ],
}

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  morningLight: { enabled: true, time: '07:30', label: 'Morning sunlight reminder' },
  caffeineCutoff: { enabled: true, time: '14:30', label: 'Caffeine cutoff alert' },
  windDown: { enabled: true, time: '21:00', label: 'Wind-down alarm' },
}

export function cloneWorkoutTemplate(): WorkoutDay[] {
  return DEFAULT_WORKOUT_TEMPLATE.map((day) => ({
    ...day,
    completed: false,
    exercises: day.exercises.map((ex) => ({ ...ex, id: uid(), completed: false, weight: 0 })),
  }))
}

export function cloneRoutines(): RoutineSlot[] {
  return DEFAULT_ROUTINES.map((slot) => ({
    ...slot,
    items: slot.items.map((item) => ({ ...item, id: uid(), completed: false })),
  }))
}

export function cloneSupplements(custom: Supplement[] = []): Supplement[] {
  const base = DEFAULT_SUPPLEMENTS.map((s) => ({ ...s, id: uid(), taken: false }))
  const customs = custom.map((s) => ({ ...s, id: uid(), taken: false }))
  return [...base.filter((s) => !s.custom), ...base.filter((s) => s.custom), ...customs]
}

export function cloneInhibitions(): InhibitionItem[] {
  return DEFAULT_INHIBITIONS.map((item) => ({ ...item, id: uid(), avoided: false }))
}

export function cloneDietPlan(): DietPlan {
  return {
    meals: DEFAULT_DIET_PLAN.meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) => ({ ...item, id: uid(), eaten: false })),
    })),
  }
}

export function createDefaultDayData(customSupplements: Supplement[] = []): DayData {
  return {
    twoPlusOne: {
      task1: { text: '', completed: false },
      task2: { text: '', completed: false },
      resistance: { text: '', completed: false },
    },
    workoutDays: cloneWorkoutTemplate(),
    routines: cloneRoutines(),
    supplements: cloneSupplements(customSupplements),
    tomorrowTasks: [],
    journal: { ...DEFAULT_JOURNAL },
    inhibitions: cloneInhibitions(),
    hydration: { ...DEFAULT_HYDRATION },
    dietPlan: cloneDietPlan(),
  }
}

export const BIOMARKER_FIELDS = [
  { key: 'totalTestosterone', label: 'Total Testosterone', unit: 'ng/dL' },
  { key: 'freeTestosterone', label: 'Free Testosterone', unit: 'pg/mL' },
  { key: 'shbg', label: 'SHBG', unit: 'nmol/L' },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'ng/mL' },
  { key: 'zinc', label: 'Zinc', unit: 'µg/dL' },
  { key: 'estradiol', label: 'Estradiol', unit: 'pg/mL' },
] as const

export type BiomarkerKey = (typeof BIOMARKER_FIELDS)[number]['key']

export function createEmptyBiomarkerEntry(): BiomarkerEntry {
  return { id: uid(), date: new Date().toISOString().split('T')[0] }
}

export { uid }
