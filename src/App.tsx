import { useEffect, useState } from 'react'
import { useLifeMaxStore } from './store/useLifeMaxStore'
import { Header, ScoreBreakdownBar } from './components/layout/Header'
import { SettingsPanel } from './components/layout/SettingsPanel'
import { ModuleRenderer } from './components/layout/ModuleRenderer'
import type { ModuleId } from './types'
import { startNotificationScheduler, stopNotificationScheduler } from './utils/notifications'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const ensureToday = useLifeMaxStore((s) => s.ensureToday)
  const modules = useLifeMaxStore((s) => s.modules)
  const notificationSettings = useLifeMaxStore((s) => s.notificationSettings)

  useEffect(() => {
    ensureToday()
  }, [ensureToday])

  useEffect(() => {
    startNotificationScheduler(notificationSettings)
    return () => stopNotificationScheduler()
  }, [notificationSettings])

  const enabledModules = [...modules]
    .filter((m) => m.enabled)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-bg-primary pb-12">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <ScoreBreakdownBar />

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {enabledModules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-text-secondary">No modules enabled.</p>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mt-2 text-sm text-accent hover:underline"
            >
              Open settings to enable modules
            </button>
          </div>
        ) : (
          enabledModules.map((mod) => (
            <ModuleRenderer key={mod.id} id={mod.id as ModuleId} />
          ))
        )}
      </main>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
