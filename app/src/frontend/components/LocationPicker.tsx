import { useEffect, useId, useRef, useState } from "react";
import { LocateFixed, Check, MapPin } from "lucide-react";
import type { Map as LeafletMap, Marker, Circle, TileLayer } from "leaflet";
import type { MapPoint } from "@/contracts";
const tiles =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export function LocationPicker({
  value,
  onChange,
  radiusKm,
  mapCenter,
  mapZoom = 12,
  suggestedPoint,
  selectionResetKey = 0,
  showLocateButton = true,
}: {
  value: MapPoint | null;
  radiusKm?: number;
  onChange: (p: MapPoint | null) => void;
  mapCenter?: MapPoint | null;
  mapZoom?: number;
  suggestedPoint?: MapPoint | null;
  selectionResetKey?: number;
  showLocateButton?: boolean;
}) {
  const instructionsId = useId();
  const tileLayer = useRef<TileLayer | null>(null);
  const container = useRef<HTMLDivElement>(null),
    map = useRef<LeafletMap | null>(null),
    marker = useRef<Marker | null>(null),
    change = useRef(onChange),
    draftRef = useRef<MapPoint | null>(value),
    alive = useRef(true);
  const [draft, setDraft] = useState<MapPoint | null>(value),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [mapReady, setMapReady] = useState(false),
    [tileError, setTileError] = useState(false);
  const circle = useRef<Circle | null>(null);
  const radius = useRef(radiusKm);
  const previousSelectionResetKey = useRef(selectionResetKey);
  radius.current = radiusKm;
  change.current = onChange;
  const placeRef = useRef<(p: MapPoint) => void>(() => {});
  useEffect(() => {
    let disposed = false;
    alive.current = true;
    import("leaflet")
      .then((L) => {
        if (disposed || !container.current) return;
        const m = L.map(container.current, {
          scrollWheelZoom: false,
          zoomControl: false,
          zoomAnimation: false,
        }).setView(
          value ? [value.lat, value.lng] : [-16.377, -39.58],
          value ? 16 : 13,
        );
        map.current = m;
        L.control
          .zoom({ zoomInTitle: "Aproximar mapa", zoomOutTitle: "Afastar mapa" })
          .addTo(m);
        tileLayer.current = L.tileLayer(tiles, {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
        })
          .on("tileerror", () => {
            if (!disposed) setTileError(true);
          })
          .addTo(m);
        const icon = L.divIcon({
          className: "fretta-map-marker",
          html: "<span></span>",
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        });
        const place = (p: MapPoint) => {
          draftRef.current = p;
          setDraft(p);
          if (radius.current) {
            if (circle.current)
              circle.current
                .setLatLng([p.lat, p.lng])
                .setRadius(radius.current * 1000);
            else
              circle.current = L.circle([p.lat, p.lng], {
                radius: radius.current * 1000,
                color: "#ed5c36",
                fillColor: "#ed5c36",
                fillOpacity: 0.12,
                weight: 2,
                interactive: false,
              }).addTo(m);
          }

          if (marker.current) marker.current.setLatLng([p.lat, p.lng]);
          else {
            const pin = L.marker([p.lat, p.lng], {
              icon,
              draggable: true,
              keyboard: true,
              title: "Ponto selecionado",
            }).addTo(m);
            marker.current = pin;
            pin.on("dragend", () => {
              const q = pin.getLatLng();
              draftRef.current = { lat: q.lat, lng: q.lng };
              setDraft(draftRef.current);
              circle.current?.setLatLng(q);
              change.current(null);
            });
          }
        };
        placeRef.current = place;
        if (value) place(value);
        m.on("click", (e) => {
          place({ lat: e.latlng.lat, lng: e.latlng.lng });
          change.current(null);
        });
        setMapReady(true);
        requestAnimationFrame(() => {
          if (!disposed) m.invalidateSize();
        });
      })
      .catch(() => {
        if (!disposed)
          setError("Não foi possível abrir o mapa. Feche e tente novamente.");
      });
    return () => {
      disposed = true;
      alive.current = false;
      map.current?.stop().remove();
      map.current = null;
      marker.current = null;
      circle.current = null;
    };
  }, []);
  useEffect(() => {
    if (value && map.current) {
      placeRef.current(value);
      if (radius.current && circle.current)
        map.current.fitBounds(circle.current.getBounds(), {
          padding: [15, 15],
        });
      else map.current.setView([value.lat, value.lng], 16);
    }
  }, [value?.lat, value?.lng, mapReady]);
  useEffect(() => {
    if (previousSelectionResetKey.current === selectionResetKey) return;
    previousSelectionResetKey.current = selectionResetKey;
    marker.current?.remove();
    marker.current = null;
    circle.current?.remove();
    circle.current = null;
    draftRef.current = null;
    setDraft(null);
  }, [selectionResetKey, mapReady]);
  useEffect(() => {
    if (mapCenter && map.current) {
      map.current.setView([mapCenter.lat, mapCenter.lng], mapZoom);
    }
  }, [mapCenter?.lat, mapCenter?.lng, mapZoom, mapReady]);
  useEffect(() => {
    if (suggestedPoint && map.current) {
      placeRef.current(suggestedPoint);
      map.current.setView([suggestedPoint.lat, suggestedPoint.lng], 17);
    }
  }, [suggestedPoint?.lat, suggestedPoint?.lng, mapReady]);
  useEffect(() => {
    if (circle.current && radiusKm && map.current) {
      circle.current.setRadius(radiusKm * 1000);
      map.current.fitBounds(circle.current.getBounds(), { padding: [15, 15] });
    }
  }, [radiusKm, mapReady]);
  function locate() {
    if (!navigator.geolocation) {
      setError(
        "Seu navegador não oferece localização. Marque o ponto manualmente no mapa.",
      );
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (!alive.current) return;
        const point = { lat: p.coords.latitude, lng: p.coords.longitude };
        placeRef.current(point);
        map.current?.setView([point.lat, point.lng], 17);
        change.current(null);
        setLoading(false);
      },
      (e) => {
        if (!alive.current) return;
        setLoading(false);
        setError(
          e.code === 1
            ? "Permissão de localização negada. Você pode marcar o ponto no mapa."
            : "Não foi possível obter sua localização. Marque o ponto no mapa.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }
  return (
    <div className="location-picker">
      <div className="section-head">
        <p className="muted" id={instructionsId}>
          Toque no mapa ou arraste o marcador. Use + e − para ajustar o zoom.
        </p>
        {showLocateButton && (
          <button
            type="button"
            className="secondary"
            onClick={locate}
            disabled={loading || !mapReady}
          >
            <LocateFixed size={17} />
            {loading ? "Buscando localização…" : "Usar minha localização"}
          </button>
        )}
      </div>
      <div
        ref={container}
        className="address-map"
        role="region"
        aria-label="Mapa para selecionar o endereço"
        aria-describedby={instructionsId}
        tabIndex={0}
      />
      {tileError && (
        <div role="status" className="map-message">
          O mapa está com dificuldade para carregar. Confira sua conexão; se não
          conseguir identificar o local, tente novamente antes de confirmar.
          <button
            type="button"
            className="provider-link"
            onClick={() => {
              setTileError(false);
              tileLayer.current?.redraw();
            }}
          >
            Tentar carregar o mapa novamente
          </button>
        </div>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <div className="map-confirm">
        <span>
          {value ? (
            <>
              <Check size={16} /> Ponto confirmado
            </>
          ) : draft ? (
            <>
              <MapPin size={16} /> Confira o marcador e confirme o ponto
            </>
          ) : (
            "Nenhum ponto selecionado"
          )}
        </span>
        <button
          className="primary"
          type="button"
          disabled={!draft || !mapReady || loading}
          onClick={() => {
            if (draft) onChange({ ...draft });
          }}
        >
          {value ? "Confirmado" : "Confirmar ponto"}
        </button>
      </div>
    </div>
  );
}

export function UseMyLocationButton({
  onLocated,
}: {
  onLocated: (point: MapPoint) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setError(
        "Seu navegador não oferece localização. Preencha o endereço manualmente.",
      );
      return;
    }

    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!alive.current) return;
        onLocated({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (geolocationError) => {
        if (!alive.current) return;
        setLoading(false);
        setError(
          geolocationError.code === 1
            ? "Permissão de localização negada. Preencha o endereço manualmente."
            : "Não foi possível obter sua localização. Tente novamente ou preencha o endereço.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  return (
    <>
      <button
        type="button"
        className="secondary"
        onClick={locate}
        disabled={loading}
      >
        <LocateFixed size={17} />
        {loading ? "Buscando localização…" : "Usar minha localização"}
      </button>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
