"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { createHttpTransport } from "../../api/http";
import { dateTime } from "../../lib/dates";

type Pickup = { id: string; title: string; city: string; pickupAt: string };
const http = createHttpTransport();

export function DriverScheduledPickups() {
  const [items, setItems] = useState<Pickup[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const { pickups } = await http.request<{ pickups: Pickup[] }>("/freights/pickups", {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setItems(pickups);
          setError(false);
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    };
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    const refreshTimer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    void refresh();
    return () => {
      controller.abort();
      window.clearInterval(clock);
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (!items.length && !error) return null;
  return (
    <section className="driver-pickups" aria-labelledby="driver-pickups-title">
      <h2 id="driver-pickups-title">Próximas retiradas</h2>
      {error && <p role="status">Não foi possível atualizar as retiradas.</p>}
      {items.map((item) => {
        const seconds = Math.max(
          0,
          Math.ceil((Date.parse(item.pickupAt) - now) / 1000),
        );
        const time =
          seconds >= 86400
            ? `${Math.floor(seconds / 86400)}d ${Math.floor(seconds / 3600) % 24}h`
            : seconds >= 3600
              ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds / 60) % 60}min`
              : `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
        return (
          <article
            className="panel driver-pickup-card"
            data-due={seconds === 0}
            key={item.id}
          >
            <div className="driver-pickup-time">
              <Clock3 size={17} aria-hidden="true" />{" "}
              {seconds === 0
                ? "Horário da retirada chegou"
                : `Retirada em ${time}`}
            </div>
            <h3>{item.title}</h3>
            <p>
              {dateTime(item.pickupAt)}
              {item.city ? ` · ${item.city}` : ""}
            </p>
            <Link
              className="secondary real-freight-link"
              href={`/motorista/fretes/${encodeURIComponent(item.id)}`}
              aria-label={`Ver detalhes de ${item.title}`}
            >
              Ver detalhes
            </Link>
          </article>
        );
      })}
    </section>
  );
}
