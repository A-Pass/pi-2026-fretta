import type { MapPoint } from "@/contracts";
import { LocationPicker } from "../../components/LocationPicker";

export type FreightSearchArea = { base: MapPoint; radius: number };

export function OperatingAreaPicker({
  area,
  onChange,
}: {
  area: FreightSearchArea;
  onChange: (area: FreightSearchArea) => void;
}) {
  return (
    <>
      <LocationPicker
        value={area.base}
        followMap
        radiusKm={area.radius}
        onChange={(point) => {
          if (point) onChange({ ...area, base: point });
        }}
      />
      <label>
        Raio para buscar retiradas · {area.radius} km
        <input
          type="range"
          min={1}
          max={300}
          value={area.radius}
          onChange={(event) =>
            onChange({ ...area, radius: Number(event.target.value) })
          }
        />
      </label>
    </>
  );
}
