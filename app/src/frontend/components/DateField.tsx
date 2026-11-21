import { useRef } from "react";
import { CalendarDays } from "lucide-react";

type DateFieldProps = {
  label: string;
  value: string;
  min?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function DateField({
  label,
  value,
  min,
  required,
  onChange,
}: DateFieldProps) {
  const input = useRef<HTMLInputElement>(null);

  function openCalendar() {
    const el = input.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus();
  }

  return (
    <label className="date-field">
      {label}
      <span className="date-field-control">
        <input
          ref={input}
          type="date"
          lang="pt-BR"
          required={required}
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="date-field-button"
          aria-label={`Abrir calendário para ${label.toLowerCase()}`}
          onClick={openCalendar}
        >
          <CalendarDays size={19} aria-hidden="true" />
        </button>
      </span>
    </label>
  );
}
