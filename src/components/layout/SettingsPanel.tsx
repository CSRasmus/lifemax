import { Bell, ChevronUp, ChevronDown, Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLifeMaxStore } from '../../store/useLifeMaxStore'
import { MODULE_LABELS, MODULE_ICONS, type ModuleId } from '../../types'
import { requestNotificationPermission } from '../../utils/notifications'
import { Button } from '../ui/Button'

export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const modules = useLifeMaxStore((s) => s.modules)
  const toggleModule = useLifeMaxStore((s) => s.toggleModule)
  const reorderModule = useLifeMaxStore((s) => s.reorderModule)
  const notificationSettings = useLifeMaxStore((s) => s.notificationSettings)
  const updateNotifications = useLifeMaxStore((s) => s.updateNotificationSettings)

  const sorted = [...modules].sort((a, b) => a.order - b.order)

  const handleEnableNotifications = async () => {
    await requestNotificationPermission()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-bg-secondary"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-accent" />
                <h2 className="text-lg font-bold text-white">Settings</h2>
              </div>
              <button type="button" onClick={onClose} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <section className="mb-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">Modules</h3>
                <p className="mb-4 text-xs text-text-secondary">Toggle modules on/off and reorder your dashboard</p>
                <div className="space-y-2">
                  {sorted.map((mod, idx) => (
                    <div key={mod.id} className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated/50 p-3">
                      <span>{MODULE_ICONS[mod.id as ModuleId]}</span>
                      <span className="flex-1 text-sm text-white">{MODULE_LABELS[mod.id as ModuleId]}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => reorderModule(mod.id as ModuleId, 'up')}
                          className="rounded p-1 text-text-secondary hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sorted.length - 1}
                          onClick={() => reorderModule(mod.id as ModuleId, 'down')}
                          className="rounded p-1 text-text-secondary hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.id as ModuleId)}
                          className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            mod.enabled ? 'bg-accent text-bg-primary' : 'bg-bg-primary text-text-secondary'
                          }`}
                        >
                          {mod.enabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                  <Bell size={14} /> Reminders
                </h3>
                <Button size="sm" variant="secondary" className="mb-4" onClick={handleEnableNotifications}>
                  Enable Browser Notifications
                </Button>
                {(['morningLight', 'caffeineCutoff', 'windDown'] as const).map((key) => {
                  const setting = notificationSettings[key]
                  return (
                    <div key={key} className="mb-3 rounded-xl border border-border bg-bg-elevated/50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-white">{setting.label}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateNotifications({ [key]: { ...setting, enabled: !setting.enabled } })
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            setting.enabled ? 'bg-accent text-bg-primary' : 'bg-bg-primary text-text-secondary'
                          }`}
                        >
                          {setting.enabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <input
                        type="time"
                        value={setting.time}
                        onChange={(e) => updateNotifications({ [key]: { ...setting, time: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white"
                      />
                    </div>
                  )
                })}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
