import type { Address, SavedAddress } from "@/contracts";
import { LocationPicker } from "../../components/LocationPicker";
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
type Props = {
  value: Address;
  onChange: (a: Address) => void;
  addresses?: SavedAddress[];
  save?: boolean;
  onSaveChange?: (v: boolean) => void;
  privacyNotice?: boolean;
  editingSaved?: boolean;
};
export function AddressFields({
  value,
  onChange,
  addresses = [],
  save = false,
  onSaveChange,
  privacyNotice = false,
  editingSaved = false,
}: Props) {
  function field(key: keyof Omit<Address, "point">, v: string) {
    onChange({ ...value, [key]: v });
  }
  return (
    <div className="address-fields">
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
      <LocationPicker
        value={value.point}
        onChange={(point) => onChange({ ...value, point })}
      />
      {privacyNotice && (
        <p className="address-privacy">
          Sua localização exata é privada. Rua, número da casa e ponto exato no
          mapa só serão disponibilizados ao motorista escolhido após a
          contratação.
        </p>
      )}
      <p className="muted address-instructions">
        Preencha o endereço correspondente ao ponto escolhido. O mapa não
        preenche estes campos automaticamente.
      </p>
      <div className="form-grid">
        <label>
          Cidade
          <input
            value={value.city}
            onChange={(e) => field("city", e.target.value)}
            maxLength={100}
            required
            autoComplete="address-level2"
          />
        </label>
        <label>
          Estado
          <select
            value={value.state}
            onChange={(e) => field("state", e.target.value)}
          >
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Bairro
          <input
            value={value.neighborhood}
            onChange={(e) => field("neighborhood", e.target.value)}
            required
            maxLength={100}
          />
        </label>
        <label>
          Rua ou avenida
          <input
            value={value.street}
            onChange={(e) => field("street", e.target.value)}
            required
            maxLength={150}
            autoComplete="address-line1"
          />
        </label>
        <label>
          Número
          <input
            value={value.number}
            onChange={(e) => field("number", e.target.value)}
            required
            maxLength={20}
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
