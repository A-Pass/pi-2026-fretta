import { useEffect, useId, useRef, useState } from "react";
import type { Address, SavedAddress } from "@/contracts";
import {
  LocationPicker,
  UseMyLocationButton,
} from "../../components/LocationPicker";
import {
  fillAddressFromPostalCode,
  fillAddressFromReverseGeocode,
  formatPostalCode,
  postalCodeMapPoint,
  type PostalCodeAddress,
} from "./rules";
const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
function SearchableAddressInput({
  label,
  value,
  options = [],
  onChange,
  required = false,
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  options?: string[];
  onChange: (value: string) => void;
  required?: boolean;
  maxLength: number;
  autoComplete?: string;
}) {
  const listId = useId();
  return (
    <label>
      {label}
      <input
        list={listId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        required={required}
        autoComplete={autoComplete}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option value={option} key={option} />
        ))}
      </datalist>
    </label>
  );
}
type Props = {
  value: Address;
  onChange: (a: Address) => void;
  addresses?: SavedAddress[];
  save?: boolean;
  onSaveChange?: (v: boolean) => void;
  privacyNotice?: boolean;
  editingSaved?: boolean;
  mapFirst?: boolean;
};
export function AddressFields({
  value,
  onChange,
  addresses = [],
  save = false,
  onSaveChange,
  privacyNotice = false,
  editingSaved = false,
  mapFirst = false,
}: Props) {
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const [locationStatus, setLocationStatus] = useState("");
  const [postalCodeStatus, setPostalCodeStatus] = useState("");
  const [cityStatus, setCityStatus] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [locationLookupPoint, setLocationLookupPoint] =
    useState<Address["point"]>(null);
  const [cityToLocate, setCityToLocate] = useState<{
    city: string;
    state: string;
    street?: string;
    neighborhood?: string;
    postalCode?: string;
    requestId: number;
  } | null>(null);
  const [cityMapCenter, setCityMapCenter] = useState<Address["point"]>(null);
  const [suggestedMapPoint, setSuggestedMapPoint] =
    useState<Address["point"]>(null);
  const [cityMapStatus, setCityMapStatus] = useState("");
  const cityRequestId = useRef(0);
  valueRef.current = value;
  onChangeRef.current = onChange;

  function locateCityOnMap(
    city: string,
    state: string,
    street?: string,
    neighborhood?: string,
    postalCode?: string,
  ) {
    setCityMapCenter(null);
    setSuggestedMapPoint(null);
    setCityToLocate({
      city,
      state,
      street,
      neighborhood,
      postalCode,
      requestId: ++cityRequestId.current,
    });
  }

  useEffect(() => {
    const digits = (value.postalCode ?? "").replace(/\D/g, "");
    if (digits.length !== 8) {
      setPostalCodeStatus("");
      return;
    }

    const controller = new AbortController();
    setPostalCodeStatus("Consultando o CEP...");
    fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Postal code lookup failed");
        return response.json() as Promise<PostalCodeAddress>;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.erro) {
          setPostalCodeStatus(
            "CEP não encontrado. Confira ou preencha manualmente.",
          );
          return;
        }
        const filled = fillAddressFromPostalCode(valueRef.current, data);
        const city = data.localidade?.trim();
        const state = data.uf?.trim().toUpperCase();
        if (city && state && /^[A-Z]{2}$/.test(state)) {
          onChangeRef.current({
            ...filled,
            point: mapFirst ? filled.point : null,
          });
          locateCityOnMap(
            city,
            state,
            data.logradouro?.trim(),
            data.bairro?.trim(),
            digits,
          );
        } else {
          onChangeRef.current(filled);
        }
        setPostalCodeStatus("Endereço preenchido com os dados do CEP.");
      })
      .catch((error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        )
          return;
        setPostalCodeStatus(
          "Não foi possível consultar o CEP. Preencha o endereço manualmente.",
        );
      });

    return () => controller.abort();
  }, [value.postalCode, mapFirst]);

  useEffect(() => {
    const controller = new AbortController();
    setCities([]);
    setCityStatus("Carregando cidades...");
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value.state}/municipios?orderBy=nome`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("City list request failed");
        return response.json() as Promise<Array<{ nome: string }>>;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setCities(data.map(({ nome }) => nome));
        setCityStatus("");
      })
      .catch((error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        )
          return;
        setCityStatus(
          "Não foi possível carregar as cidades; você ainda pode digitar o nome.",
        );
      });

    return () => controller.abort();
  }, [value.state]);

  useEffect(() => {
    if (!cityToLocate?.city.trim()) {
      setCityMapStatus("");
      return;
    }

    const cityRequest = cityToLocate;
    const controller = new AbortController();
    async function locate() {
      const street = cityRequest.street?.trim();
      setCityMapStatus(
        cityRequest.postalCode
          ? "Buscando a posição do CEP no mapa..."
          : street
            ? "Localizando a rua no mapa..."
            : "Localizando cidade no mapa...",
      );
      const search = async (q: string) => {
        const query = new URLSearchParams({
          q,
          format: "jsonv2",
          limit: "1",
          countrycodes: "br",
          addressdetails: "1",
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${query}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("Map lookup failed");
        const [result] = (await response.json()) as Array<{
          lat: string;
          lon: string;
          address?: Record<string, string | undefined>;
        }>;
        return result;
      };

      try {
        if (cityRequest.postalCode) {
          try {
            const response = await fetch(
              `https://brasilapi.com.br/api/cep/v2/${cityRequest.postalCode}`,
              {
                headers: { Accept: "application/json" },
                signal: controller.signal,
              },
            );
            if (response.ok) {
              const data = (await response.json()) as {
                location?: {
                  coordinates?: {
                    latitude?: string | number;
                    longitude?: string | number;
                  };
                };
              };
              const point = postalCodeMapPoint(data);
              if (point) {
                if (controller.signal.aborted) return;
                setCityMapCenter(point);
                setSuggestedMapPoint(point);
                setCityMapStatus(
                  "Posição aproximada do CEP localizada no mapa. Confira e confirme o ponto.",
                );
                return;
              }
            }
          } catch (error: unknown) {
            if (
              typeof error === "object" &&
              error !== null &&
              "name" in error &&
              error.name === "AbortError"
            )
              return;
          }
        }

        let result = street
          ? await search(
              `${street}, ${cityRequest.neighborhood ?? ""}, ${cityRequest.city}, ${cityRequest.state}, Brasil`,
            )
          : null;
        const normalize = (name: string) =>
          name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
        const foundStreet =
          result?.address?.road ||
          result?.address?.pedestrian ||
          result?.address?.residential ||
          result?.address?.street;
        const streetMatched =
          !!street &&
          !!foundStreet &&
          normalize(foundStreet) === normalize(street);

        if (street && !streetMatched) {
          result = await search(
            `${cityRequest.city}, ${cityRequest.state}, Brasil`,
          );
        }
        if (controller.signal.aborted) return;
        if (!result) {
          setCityMapStatus("Não foi possível localizar a cidade no mapa.");
          return;
        }

        const center = { lat: Number(result.lat), lng: Number(result.lon) };
        if (!Number.isFinite(center.lat) || !Number.isFinite(center.lng)) {
          setCityMapStatus("Não foi possível localizar a cidade no mapa.");
          return;
        }
        setCityMapCenter(center);
        if (streetMatched) {
          setSuggestedMapPoint(center);
          setCityMapStatus(
            "Rua aproximada localizada no mapa. Confira e confirme o ponto.",
          );
        } else if (street) {
          setCityMapStatus(
            "Não foi possível identificar a rua; mapa centralizado na cidade.",
          );
        } else {
          setCityMapStatus("");
        }
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        )
          return;
        setCityMapStatus("Não foi possível localizar a cidade no mapa.");
      }
    }

    const timeout = window.setTimeout(() => void locate(), 500);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [cityToLocate]);

  useEffect(() => {
    const point = locationLookupPoint;
    if (!point) {
      setLocationStatus("");
      return;
    }

    const controller = new AbortController();
    setLocationStatus("Buscando endereço da sua localização...");
    const query = new URLSearchParams({
      format: "jsonv2",
      lat: String(point.lat),
      lon: String(point.lng),
      addressdetails: "1",
      "accept-language": "pt-BR",
    });
    fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Reverse geocoding failed");
        return response.json();
      })
      .then((data: { address?: Record<string, string | undefined> }) => {
        if (controller.signal.aborted) return;
        if (!data.address) {
          setLocationStatus(
            "O endereço não pôde ser identificado. Confira os campos.",
          );
          return;
        }
        const filled = fillAddressFromReverseGeocode(
          valueRef.current,
          data.address,
        );
        if (JSON.stringify(filled) !== JSON.stringify(valueRef.current)) {
          onChangeRef.current(filled);
        }
        setLocationStatus("Endereço atualizado pela sua localização.");
      })
      .catch((error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          error.name === "AbortError"
        )
          return;
        setLocationStatus(
          "Não foi possível buscar o endereço. Confira os campos manualmente.",
        );
      });

    return () => controller.abort();
  }, [locationLookupPoint?.lat, locationLookupPoint?.lng]);

  function field(key: keyof Omit<Address, "point">, v: string) {
    onChange({ ...value, [key]: v });
  }
  const map = (
    <div className="address-map-section">
      {cityMapStatus && (
        <p className="muted" role="status">
          {cityMapStatus}
        </p>
      )}
      <LocationPicker
        value={value.point}
        onChange={(point) => onChange({ ...value, point })}
        mapCenter={mapFirst && value.point ? null : cityMapCenter}
        mapZoom={suggestedMapPoint ? 17 : 12}
        suggestedPoint={mapFirst && value.point ? null : suggestedMapPoint}
        selectionResetKey={mapFirst ? 0 : (cityToLocate?.requestId ?? 0)}
        showLocateButton={false}
      />
    </div>
  );
  return (
    <div className="address-fields">
      {mapFirst && map}
      {!!addresses.length && (
        <label>
          Usar um endereço salvo
          <select
            defaultValue=""
            onChange={(e) => {
              const a = addresses.find((x) => x.id === e.target.value);
              if (a) {
                const { id, ...copy } = a;
                onChange(copy);
                onSaveChange?.(false);
              }
              e.target.value = "";
            }}
          >
            <option value="">Selecionar endereço</option>
            {addresses.map((a) => (
              <option value={a.id} key={a.id}>
                {a.label} · {a.neighborhood}, {a.city}
              </option>
            ))}
          </select>
        </label>
      )}
      <UseMyLocationButton
        onLocated={(point) => {
          onChange({ ...valueRef.current, point });
          setLocationLookupPoint(point);
        }}
      />
      {privacyNotice && (
        <p className="address-privacy">
          Sua localização exata é privada. Rua, número da casa e ponto exato no
          mapa só serão disponibilizados ao motorista escolhido após a
          contratação.
        </p>
      )}
      <p className="muted address-instructions">
        Use sua localização ou informe um CEP para preencher os dados
        automaticamente. Você também pode preencher os campos manualmente.
      </p>
      <div className="form-grid">
        <label>
          CEP <span className="muted">(opcional)</span>
          <input
            value={value.postalCode ?? ""}
            onChange={(e) =>
              field("postalCode", formatPostalCode(e.target.value))
            }
            maxLength={9}
            autoComplete="postal-code"
            placeholder="Ex.: 45820-000"
            inputMode="numeric"
          />
        </label>
        <label>
          Estado
          <select
            value={value.state}
            onChange={(e) =>
              onChange({ ...value, state: e.target.value, city: "" })
            }
          >
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <SearchableAddressInput
          label="Cidade"
          value={value.city}
          options={cities}
          onChange={(city) => {
            onChange({ ...value, city, point: mapFirst ? value.point : null });
            locateCityOnMap(city, value.state);
          }}
          maxLength={100}
          required
          autoComplete="address-level2"
        />
        <SearchableAddressInput
          label="Bairro"
          value={value.neighborhood}
          onChange={(neighborhood) => field("neighborhood", neighborhood)}
          maxLength={100}
          required
        />
        <label>
          Rua ou avenida
          <input
            value={value.street}
            onChange={(e) => field("street", e.target.value)}
            maxLength={150}
            required
            autoComplete="address-line1"
          />
        </label>
        <label>
          Número
          <input
            value={value.number}
            onChange={(e) => field("number", e.target.value)}
            maxLength={20}
            required
            placeholder="Ex.: 123 ou S/N"
          />
        </label>
        <label>
          Complemento ou referência <span className="muted">(opcional)</span>
          <input
            value={value.complement}
            onChange={(e) => field("complement", e.target.value)}
            maxLength={200}
            autoComplete="address-line2"
          />
        </label>
      </div>
      {postalCodeStatus && (
        <p className="muted" role="status">
          {postalCodeStatus}
        </p>
      )}
      {cityStatus && (
        <p className="muted" role="status">
          {cityStatus}
        </p>
      )}
      {locationStatus && (
        <p className="muted" role="status">
          {locationStatus}
        </p>
      )}
      {!mapFirst && map}
      {onSaveChange && (
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={save}
            onChange={(e) => onSaveChange(e.target.checked)}
          />{" "}
          Salvar este endereço em Meus Endereços
        </label>
      )}
      {(save || editingSaved) && (
        <label>
          Nome do endereço
          <input
            value={value.label}
            onChange={(e) => field("label", e.target.value)}
            maxLength={60}
            required
            placeholder="Ex.: Casa, Trabalho, Casa da família"
          />
        </label>
      )}
    </div>
  );
}
