import { useState } from 'react'
import { Plus, Trash2, Utensils } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'

export function DietPlan() {
  const day = useLifeMaxStore((s) => s.getToday())
  const toggleFood = useLifeMaxStore((s) => s.toggleDietFood)
  const toggleMeal = useLifeMaxStore((s) => s.toggleDietMeal)
  const addFood = useLifeMaxStore((s) => s.addDietFood)
  const removeFood = useLifeMaxStore((s) => s.removeDietFood)
  const addMeal = useLifeMaxStore((s) => s.addDietMeal)
  const removeMeal = useLifeMaxStore((s) => s.removeDietMeal)

  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [kcal, setKcal] = useState('')
  const [newMealLabel, setNewMealLabel] = useState('')
  const [newMealTime, setNewMealTime] = useState('')

  const meals = day.dietPlan.meals
  const allItems = meals.flatMap((m) => m.items)
  const targetKcal = allItems.reduce((sum, i) => sum + i.kcal, 0)
  const eatenKcal = allItems.filter((i) => i.eaten).reduce((sum, i) => sum + i.kcal, 0)
  const eatenCount = allItems.filter((i) => i.eaten).length
  const pct = targetKcal > 0 ? Math.min(100, Math.round((eatenKcal / targetKcal) * 100)) : 0

  const resetFoodForm = () => {
    setName('')
    setAmount('')
    setKcal('')
    setAddingTo(null)
  }

  const submitFood = (mealId: string) => {
    if (!name.trim() || !kcal) return
    addFood(mealId, {
      name: name.trim(),
      amount: amount.trim() || '—',
      kcal: Math.max(0, Number(kcal) || 0),
    })
    resetFoodForm()
  }

  return (
    <Card>
      <ModuleHeader
        icon="🍽️"
        title="Kostschema"
        subtitle={
          targetKcal > 0
            ? `${eatenKcal} / ${targetKcal} kcal · ${eatenCount}/${allItems.length} ätet`
            : 'Lägg till måltider och mat'
        }
      />

      {targetKcal > 0 && (
        <div className="mb-5">
          <div className="mb-2 h-3 overflow-hidden rounded-full bg-bg-elevated">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {meals.map((meal) => {
          const mealKcal = meal.items.reduce((sum, i) => sum + i.kcal, 0)
          const mealEaten = meal.items.filter((i) => i.eaten).reduce((sum, i) => sum + i.kcal, 0)
          const allEaten = meal.items.length > 0 && meal.items.every((i) => i.eaten)

          return (
            <div key={meal.id} className="group/meal rounded-xl border border-border bg-bg-elevated/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {meal.time !== '—' ? `Kl ${meal.time}` : meal.label}
                      {meal.time !== '—' && (
                        <span className="ml-2 font-normal text-text-secondary">{meal.label}</span>
                      )}
                    </p>
                    {mealKcal > 0 && (
                      <p className="text-xs text-text-secondary">
                        {mealEaten} / {mealKcal} kcal
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meal.items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleMeal(meal.id)}
                      className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {allEaten ? 'Avmarkera' : 'Ät allt'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMeal(meal.id)}
                    className="opacity-0 text-text-secondary transition-opacity hover:text-danger group-hover/meal:opacity-100"
                    aria-label="Ta bort måltid"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {meal.items.length === 0 && addingTo !== meal.id ? (
                <p className="mb-3 text-sm text-text-secondary">Inga livsmedel ännu — lägg till nedan.</p>
              ) : (
                <div className="mb-3 space-y-2">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className={`group/item flex items-center justify-between rounded-lg border p-2.5 transition-colors ${
                        item.eaten ? 'border-accent/30 bg-accent/5' : 'border-border/60 bg-bg-primary/40'
                      }`}
                    >
                      <Checkbox
                        checked={item.eaten}
                        onChange={() => toggleFood(meal.id, item.id)}
                        label={`${item.name} · ${item.amount}`}
                        size="sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className={`shrink-0 text-xs font-medium ${item.eaten ? 'text-accent' : 'text-text-secondary'}`}>
                          {item.kcal} kcal
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFood(meal.id, item.id)}
                          className="opacity-0 text-text-secondary transition-opacity hover:text-danger group-hover/item:opacity-100"
                          aria-label="Ta bort"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {addingTo === meal.id ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Livsmedel"
                    className="min-w-[8rem] flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Mängd"
                    className="w-24 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                  <input
                    type="number"
                    value={kcal}
                    onChange={(e) => setKcal(e.target.value)}
                    placeholder="kcal"
                    className="w-20 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                  <Button size="sm" onClick={() => submitFood(meal.id)}>
                    <Plus size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetFoodForm}>
                    Avbryt
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingTo(meal.id)}
                  className="text-xs text-text-secondary transition-colors hover:text-accent"
                >
                  + Lägg till mat
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        <input
          value={newMealTime}
          onChange={(e) => setNewMealTime(e.target.value)}
          placeholder="Tid (t.ex. 18:00)"
          className="w-32 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        />
        <input
          value={newMealLabel}
          onChange={(e) => setNewMealLabel(e.target.value)}
          placeholder="Måltid (t.ex. Kvällsmat)"
          className="min-w-[10rem] flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (!newMealLabel.trim()) return
            addMeal({ time: newMealTime.trim() || '—', label: newMealLabel.trim() })
            setNewMealLabel('')
            setNewMealTime('')
          }}
        >
          <Plus size={14} /> Måltid
        </Button>
      </div>
    </Card>
  )
}
