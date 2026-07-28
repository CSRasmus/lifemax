interface SliderProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}

export function Slider({ label, value, min = 1, max = 10, step = 1, onChange, suffix }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-text-secondary">{label}</label>
        <span className="text-sm font-semibold text-accent">
          {value}
          {suffix}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-elevated accent-accent"
          style={{
            background: `linear-gradient(to right, #00ff66 ${pct}%, #242424 ${pct}%)`,
          }}
        />
      </div>
    </div>
  )
}
