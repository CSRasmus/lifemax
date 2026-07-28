import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  BiomarkerEntry,
  DayData,
  ModuleConfig,
  ModuleId,
  NotificationSettings,
  Supplement,
  WorkoutDay,
  WorkoutExercise,
} from '../types'
import {
  createDefaultDayData,
  createEmptyBiomarkerEntry,
  cloneDietPlan,
  DEFAULT_MODULES,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_WORKOUT_TEMPLATE,
  uid,
} from '../data/defaults'
import { getTodayKey, isHighScoreDay } from '../utils/score'

interface LifeMaxState {
  modules: ModuleConfig[]
  days: Record<string, DayData>
  biomarkers: BiomarkerEntry[]
  customSupplements: Supplement[]
  workoutTemplate: WorkoutDay[]
  notificationSettings: NotificationSettings
  streak: number
  lastStreakDate: string | null

  getToday: () => DayData
  ensureToday: () => void

  toggleModule: (id: ModuleId) => void
  reorderModule: (id: ModuleId, direction: 'up' | 'down') => void

  updateTwoPlusOne: (field: 'task1' | 'task2' | 'resistance', data: Partial<{ text: string; completed: boolean }>) => void

  updateWorkoutDay: (dayId: string, data: Partial<WorkoutDay>) => void
  updateExercise: (dayId: string, exerciseId: string, data: Partial<WorkoutExercise>) => void
  addExercise: (dayId: string, exercise: Omit<WorkoutExercise, 'id'>) => void
  removeExercise: (dayId: string, exerciseId: string) => void
  saveWorkoutTemplate: () => void

  addRoutineItem: (slotId: string, text: string) => void
  updateRoutineItem: (slotId: string, itemId: string, data: Partial<{ text: string; completed: boolean }>) => void
  removeRoutineItem: (slotId: string, itemId: string) => void

  toggleSupplement: (id: string) => void
  addCustomSupplement: (name: string, dosage: string) => void
  removeSupplement: (id: string) => void

  addTomorrowTask: (text: string) => void
  removeTomorrowTask: (id: string) => void
  updateJournal: (data: Partial<DayData['journal']>) => void

  toggleInhibition: (id: string) => void
  addInhibition: (text: string) => void
  removeInhibition: (id: string) => void

  addWater: (ml: number) => void
  setHydrationGoal: (ml: number) => void
  startFasting: () => void
  stopFasting: () => void
  setEatingWindow: (start: string, end: string) => void

  toggleDietFood: (mealId: string, itemId: string) => void
  toggleDietMeal: (mealId: string) => void
  addDietFood: (mealId: string, food: { name: string; amount: string; kcal: number }) => void
  removeDietFood: (mealId: string, itemId: string) => void
  addDietMeal: (meal: { time: string; label: string }) => void
  removeDietMeal: (mealId: string) => void
  updateDietMeal: (mealId: string, data: Partial<{ time: string; label: string }>) => void

  addBiomarker: (entry: BiomarkerEntry) => void
  updateBiomarker: (id: string, data: Partial<BiomarkerEntry>) => void
  removeBiomarker: (id: string) => void

  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  recalculateStreak: () => void
}

function normalizeDay(day: DayData): DayData {
  if (day.dietPlan?.meals) return day
  return { ...day, dietPlan: cloneDietPlan() }
}

function mergeMissingModules(modules: ModuleConfig[] = []): ModuleConfig[] {
  const existing = new Set(modules.map((m) => m.id))
  const missing = DEFAULT_MODULES.filter((m) => !existing.has(m.id))
  if (missing.length === 0) return modules

  let nextOrder = modules.reduce((max, m) => Math.max(max, m.order), -1)
  return [
    ...modules,
    ...missing.map((m) => {
      nextOrder += 1
      return { ...m, order: nextOrder, enabled: true }
    }),
  ]
}

function getDay(state: LifeMaxState, date: string): DayData {
  return normalizeDay(state.days[date] ?? createDefaultDayData(state.customSupplements))
}

function setDay(state: LifeMaxState, date: string, day: DayData): Partial<LifeMaxState> {
  return { days: { ...state.days, [date]: day } }
}

export const useLifeMaxStore = create<LifeMaxState>()(
  persist(
    (set, get) => ({
      modules: DEFAULT_MODULES,
      days: {},
      biomarkers: [],
      customSupplements: [],
      workoutTemplate: DEFAULT_WORKOUT_TEMPLATE,
      notificationSettings: DEFAULT_NOTIFICATIONS,
      streak: 0,
      lastStreakDate: null,

      getToday: () => {
        const state = get()
        const key = getTodayKey()
        return getDay(state, key)
      },

      ensureToday: () => {
        const key = getTodayKey()
        const state = get()
        const modules = mergeMissingModules(state.modules)
        const modulesChanged = modules.length !== state.modules.length

        if (!state.days[key]) {
          set({
            ...(modulesChanged ? { modules } : {}),
            ...setDay(state, key, createDefaultDayData(state.customSupplements)),
          })
        } else if (modulesChanged) {
          set({ modules })
        }
        get().recalculateStreak()
      },

      toggleModule: (id) =>
        set((s) => ({
          modules: s.modules.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
        })),

      reorderModule: (id, direction) =>
        set((s) => {
          const sorted = [...s.modules].sort((a, b) => a.order - b.order)
          const idx = sorted.findIndex((m) => m.id === id)
          if (idx < 0) return s
          const swapIdx = direction === 'up' ? idx - 1 : idx + 1
          if (swapIdx < 0 || swapIdx >= sorted.length) return s
          const newOrder = sorted.map((m, i) => {
            if (i === idx) return { ...m, order: sorted[swapIdx].order }
            if (i === swapIdx) return { ...m, order: sorted[idx].order }
            return m
          })
          return { modules: newOrder }
        }),

      updateTwoPlusOne: (field, data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            twoPlusOne: { ...day.twoPlusOne, [field]: { ...day.twoPlusOne[field], ...data } },
          })
        })
        get().recalculateStreak()
      },

      updateWorkoutDay: (dayId, data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            workoutDays: day.workoutDays.map((d) => (d.id === dayId ? { ...d, ...data } : d)),
          })
        })
        get().recalculateStreak()
      },

      updateExercise: (dayId, exerciseId, data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            workoutDays: day.workoutDays.map((d) =>
              d.id === dayId
                ? {
                    ...d,
                    exercises: d.exercises.map((e) => (e.id === exerciseId ? { ...e, ...data } : e)),
                  }
                : d,
            ),
          })
        })
        get().recalculateStreak()
      },

      addExercise: (dayId, exercise) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            workoutDays: day.workoutDays.map((d) =>
              d.id === dayId ? { ...d, exercises: [...d.exercises, { ...exercise, id: uid() }] } : d,
            ),
          })
        })
      },

      removeExercise: (dayId, exerciseId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            workoutDays: day.workoutDays.map((d) =>
              d.id === dayId ? { ...d, exercises: d.exercises.filter((e) => e.id !== exerciseId) } : d,
            ),
          })
        })
      },

      saveWorkoutTemplate: () => {
        const day = get().getToday()
        set({ workoutTemplate: day.workoutDays })
      },

      addRoutineItem: (slotId, text) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            routines: day.routines.map((slot) =>
              slot.id === slotId ? { ...slot, items: [...slot.items, { id: uid(), text, completed: false }] } : slot,
            ),
          })
        })
      },

      updateRoutineItem: (slotId, itemId, data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            routines: day.routines.map((slot) =>
              slot.id === slotId
                ? { ...slot, items: slot.items.map((i) => (i.id === itemId ? { ...i, ...data } : i)) }
                : slot,
            ),
          })
        })
        get().recalculateStreak()
      },

      removeRoutineItem: (slotId, itemId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            routines: day.routines.map((slot) =>
              slot.id === slotId ? { ...slot, items: slot.items.filter((i) => i.id !== itemId) } : slot,
            ),
          })
        })
        get().recalculateStreak()
      },

      toggleSupplement: (id) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            supplements: day.supplements.map((sup) => (sup.id === id ? { ...sup, taken: !sup.taken } : sup)),
          })
        })
        get().recalculateStreak()
      },

      addCustomSupplement: (name, dosage) => {
        const supplement: Supplement = { id: uid(), name, dosage, taken: false, custom: true }
        set((s) => ({ customSupplements: [...s.customSupplements, supplement] }))
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, { ...day, supplements: [...day.supplements, { ...supplement, taken: false }] })
        })
      },

      removeSupplement: (id) => {
        set((s) => ({ customSupplements: s.customSupplements.filter((sup) => sup.id !== id) }))
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, { ...day, supplements: day.supplements.filter((sup) => sup.id !== id) })
        })
        get().recalculateStreak()
      },

      addTomorrowTask: (text) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            tomorrowTasks: [...day.tomorrowTasks, { id: uid(), text }],
          })
        })
      },

      removeTomorrowTask: (id) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            tomorrowTasks: day.tomorrowTasks.filter((t) => t.id !== id),
          })
        })
      },

      updateJournal: (data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, { ...day, journal: { ...day.journal, ...data } })
        })
        get().recalculateStreak()
      },

      toggleInhibition: (id) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            inhibitions: day.inhibitions.map((i) => (i.id === id ? { ...i, avoided: !i.avoided } : i)),
          })
        })
        get().recalculateStreak()
      },

      addInhibition: (text) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            inhibitions: [...day.inhibitions, { id: uid(), text, avoided: false }],
          })
        })
      },

      removeInhibition: (id) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            inhibitions: day.inhibitions.filter((i) => i.id !== id),
          })
        })
        get().recalculateStreak()
      },

      addWater: (ml) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            hydration: { ...day.hydration, currentMl: Math.min(day.hydration.currentMl + ml, 10000) },
          })
        })
        get().recalculateStreak()
      },

      setHydrationGoal: (ml) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, { ...day, hydration: { ...day.hydration, goalMl: ml } })
        })
      },

      startFasting: () => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            hydration: { ...day.hydration, fastingStart: new Date().toISOString(), fastingEnd: null },
          })
        })
      },

      stopFasting: () => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            hydration: { ...day.hydration, fastingEnd: new Date().toISOString(), fastingStart: null },
          })
        })
      },

      setEatingWindow: (start, end) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            hydration: { ...day.hydration, eatingWindowStart: start, eatingWindowEnd: end },
          })
        })
      },

      toggleDietFood: (mealId, itemId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.map((meal) =>
                meal.id === mealId
                  ? {
                      ...meal,
                      items: meal.items.map((item) =>
                        item.id === itemId ? { ...item, eaten: !item.eaten } : item,
                      ),
                    }
                  : meal,
              ),
            },
          })
        })
      },

      toggleDietMeal: (mealId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.map((meal) => {
                if (meal.id !== mealId || meal.items.length === 0) return meal
                const allEaten = meal.items.every((item) => item.eaten)
                return {
                  ...meal,
                  items: meal.items.map((item) => ({ ...item, eaten: !allEaten })),
                }
              }),
            },
          })
        })
      },

      addDietFood: (mealId, food) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.map((meal) =>
                meal.id === mealId
                  ? {
                      ...meal,
                      items: [
                        ...meal.items,
                        {
                          id: uid(),
                          name: food.name,
                          amount: food.amount,
                          kcal: food.kcal,
                          eaten: false,
                        },
                      ],
                    }
                  : meal,
              ),
            },
          })
        })
      },

      removeDietFood: (mealId, itemId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.map((meal) =>
                meal.id === mealId
                  ? { ...meal, items: meal.items.filter((item) => item.id !== itemId) }
                  : meal,
              ),
            },
          })
        })
      },

      addDietMeal: (meal) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: [
                ...day.dietPlan.meals,
                { id: uid(), time: meal.time || '—', label: meal.label, items: [] },
              ],
            },
          })
        })
      },

      removeDietMeal: (mealId) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.filter((meal) => meal.id !== mealId),
            },
          })
        })
      },

      updateDietMeal: (mealId, data) => {
        const key = getTodayKey()
        set((s) => {
          const day = getDay(s, key)
          return setDay(s, key, {
            ...day,
            dietPlan: {
              meals: day.dietPlan.meals.map((meal) =>
                meal.id === mealId ? { ...meal, ...data } : meal,
              ),
            },
          })
        })
      },

      addBiomarker: (entry) => set((s) => ({ biomarkers: [...s.biomarkers, entry] })),

      updateBiomarker: (id, data) =>
        set((s) => ({ biomarkers: s.biomarkers.map((b) => (b.id === id ? { ...b, ...data } : b)) })),

      removeBiomarker: (id) => set((s) => ({ biomarkers: s.biomarkers.filter((b) => b.id !== id) })),

      updateNotificationSettings: (settings) =>
        set((s) => ({
          notificationSettings: {
            morningLight: { ...s.notificationSettings.morningLight, ...settings.morningLight },
            caffeineCutoff: { ...s.notificationSettings.caffeineCutoff, ...settings.caffeineCutoff },
            windDown: { ...s.notificationSettings.windDown, ...settings.windDown },
          },
        })),

      recalculateStreak: () => {
        const state = get()
        const today = getTodayKey()
        const todayData = getDay(state, today)

        if (!isHighScoreDay(todayData)) return

        if (state.lastStreakDate === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yKey = yesterday.toISOString().split('T')[0]

        let newStreak = 1
        if (state.lastStreakDate === yKey) {
          newStreak = state.streak + 1
        } else if (state.lastStreakDate && state.days[state.lastStreakDate] && isHighScoreDay(state.days[state.lastStreakDate])) {
          newStreak = state.streak + 1
        }

        set({ streak: newStreak, lastStreakDate: today })
      },
    }),
    {
      name: 'lifemax-storage',
      version: 3,
      migrate: (persisted, version) => {
        const state = persisted as {
          modules?: ModuleConfig[]
          days?: Record<string, DayData>
        }

        state.modules = mergeMissingModules(state.modules ?? [])

        if (version < 3 && state.days) {
          for (const key of Object.keys(state.days)) {
            const day = state.days[key]
            if (day && !day.dietPlan) {
              state.days[key] = { ...day, dietPlan: cloneDietPlan() }
            }
          }
        }

        return state as LifeMaxState
      },
    },
  ),
)

export { createEmptyBiomarkerEntry }
