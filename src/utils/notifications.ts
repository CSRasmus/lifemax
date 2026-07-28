import type { NotificationSettings } from '../types'

let intervalId: ReturnType<typeof setInterval> | null = null
let lastFired: Record<string, string> = {}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function shouldFire(key: string, time: string): boolean {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const [h, m] = time.split(':').map(Number)
  if (now.getHours() !== h || now.getMinutes() !== m) return false
  const fireKey = `${key}-${today}-${time}`
  if (lastFired[fireKey]) return false
  lastFired[fireKey] = fireKey
  return true
}

export function startNotificationScheduler(settings: NotificationSettings) {
  stopNotificationScheduler()

  intervalId = setInterval(async () => {
    const granted = await requestNotificationPermission()
    if (!granted) return

    const checks = [
      { key: 'morningLight', setting: settings.morningLight },
      { key: 'caffeineCutoff', setting: settings.caffeineCutoff },
      { key: 'windDown', setting: settings.windDown },
    ]

    for (const { key, setting } of checks) {
      if (setting.enabled && shouldFire(key, setting.time)) {
        new Notification('LifeMax', {
          body: setting.label,
          icon: '/favicon.svg',
          tag: key,
        })
      }
    }
  }, 30000)
}

export function stopNotificationScheduler() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}
