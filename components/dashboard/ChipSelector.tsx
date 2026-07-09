"use client";

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export default function ChipSelector({ options, selected, onToggle }: ChipSelectorProps) {
  return (
    <div className="chip-grid">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`chip ${selected.includes(opt) ? "chip--selected" : ""}`}
        >
          {selected.includes(opt) && <span className="chip__check">✓</span>}
          {opt}
        </button>
      ))}
    </div>
  );
}
