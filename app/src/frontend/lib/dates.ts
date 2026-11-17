const zone = "America/Bahia";
export function dateTime(value: string) {
  const date = new Date(value.length === 16 ? `${value}:00-03:00` : value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString("pt-BR", {
        timeZone: zone,
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Data não informada";
}
export function time(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function localDateTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return parts.replace(" ", "T");
}
export function fromLocalDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error("Informe uma data e um horário válidos.");
  const date = new Date(`${value}:00-03:00`);
  if (!Number.isFinite(date.getTime()) || localDateTime(date) !== value)
    throw new Error("Informe uma data e um horário válidos.");
  return date.toISOString();
}
export function scheduleLabel(schedule: {
  kind: string;
  start?: string;
  end?: string;
}) {
  const date = (s?: string) => (s ? s.split("-").reverse().join("/") : "");
  return schedule.kind === "combinar"
    ? "Data a combinar"
    : schedule.kind === "intervalo"
      ? `${date(schedule.start)} a ${date(schedule.end)}`
      : date(schedule.start);
}
