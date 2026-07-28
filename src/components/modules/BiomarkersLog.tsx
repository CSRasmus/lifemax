import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Plus, Trash2 } from 'lucide-react'
import { Card, ModuleHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { useLifeMaxStore, createEmptyBiomarkerEntry } from '../../store/useLifeMaxStore'
import { BIOMARKER_FIELDS } from '../../data/defaults'
import type { BiomarkerEntry } from '../../types'
import type { BiomarkerKey } from '../../data/defaults'
import { formatDate } from '../../utils/score'

function getMarkerValue(entry: BiomarkerEntry, key: BiomarkerKey): number | undefined {
  return entry[key]
}

export function BiomarkersLog() {
  const biomarkers = useLifeMaxStore((s) => s.biomarkers)
  const addBiomarker = useLifeMaxStore((s) => s.addBiomarker)
  const removeBiomarker = useLifeMaxStore((s) => s.removeBiomarker)
  const [selectedMarker, setSelectedMarker] = useState<BiomarkerKey>('totalTestosterone')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<BiomarkerEntry>(createEmptyBiomarkerEntry())

  const chartData = [...biomarkers]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((b) => ({
      date: formatDate(b.date),
      value: getMarkerValue(b, selectedMarker),
    }))
    .filter((d) => d.value != null)

  const field = BIOMARKER_FIELDS.find((f) => f.key === selectedMarker)

  const handleSave = () => {
    addBiomarker(form)
    setForm(createEmptyBiomarkerEntry())
    setShowForm(false)
  }

  return (
    <Card>
      <ModuleHeader icon="🩸" title="Biomarkers & Bloodwork" subtitle="Track and visualize your blood test results" />

      <div className="mb-4 flex flex-wrap gap-2">
        {BIOMARKER_FIELDS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setSelectedMarker(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedMarker === f.key ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-secondary hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {chartData.length > 0 ? (
        <div className="mb-6 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fill: '#a3a3a3', fontSize: 10 }} />
              <YAxis tick={{ fill: '#a3a3a3', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="value" stroke="#00ff66" strokeWidth={2} dot={{ fill: '#00ff66', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-1 text-center text-xs text-text-secondary">
            {field?.label} ({field?.unit})
          </p>
        </div>
      ) : (
        <div className="mb-6 flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-sm text-text-secondary">
          Add bloodwork entries to see trends
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Log Entries</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Add Entry
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white"
          />
          {BIOMARKER_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <label className="w-40 text-xs text-text-secondary">{f.label}</label>
              <input
                type="number"
                step="0.1"
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder={f.unit}
                className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-1.5 text-sm text-white"
              />
            </div>
          ))}
          <textarea
            value={form.notes || ''}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes..."
            rows={2}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-white"
          />
          <Button size="sm" onClick={handleSave}>
            Save Entry
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {[...biomarkers]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((entry) => (
            <div key={entry.id} className="group flex items-center justify-between rounded-xl border border-border bg-bg-elevated/50 p-3">
              <div>
                <p className="text-sm font-semibold text-white">{formatDate(entry.date)}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {BIOMARKER_FIELDS.filter((f) => entry[f.key] != null).map((f) => (
                    <span key={f.key} className="text-[10px] text-text-secondary">
                      {f.label}: <span className="text-accent">{entry[f.key]}</span> {f.unit}
                    </span>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => removeBiomarker(entry.id)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
      </div>
    </Card>
  )
}
