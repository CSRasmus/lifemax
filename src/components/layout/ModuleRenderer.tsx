import type { ModuleId } from '../../types'
import { MODULE_ICONS, MODULE_LABELS } from '../../types'
import { DailyTwoPlusOne } from '../modules/DailyTwoPlusOne'
import { WorkoutPlanner } from '../modules/WorkoutPlanner'
import { DailyRoutines } from '../modules/DailyRoutines'
import { SupplementTracker } from '../modules/SupplementTracker'
import { EveningJournal } from '../modules/EveningJournal'
import { InhibitionTracker } from '../modules/InhibitionTracker'
import { HydrationFasting } from '../modules/HydrationFasting'
import { BiomarkersLog } from '../modules/BiomarkersLog'
import { DietPlan } from '../modules/DietPlan'

const MODULE_COMPONENTS: Record<ModuleId, React.ComponentType> = {
  'daily-two-plus-one': DailyTwoPlusOne,
  workout: WorkoutPlanner,
  routines: DailyRoutines,
  supplements: SupplementTracker,
  'evening-journal': EveningJournal,
  inhibition: InhibitionTracker,
  hydration: HydrationFasting,
  biomarkers: BiomarkersLog,
  diet: DietPlan,
}

interface ModuleRendererProps {
  id: ModuleId
}

export function ModuleRenderer({ id }: ModuleRendererProps) {
  const Component = MODULE_COMPONENTS[id]
  return <Component />
}

export { MODULE_ICONS, MODULE_LABELS }
