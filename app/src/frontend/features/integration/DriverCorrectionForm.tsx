"use client";

import { useState } from "react";
import type { Vehicle } from "@/contracts";
import {
  createIdentityClient,
  type RegistrationSummary,
} from "../../api/identity";
import { createHttpTransport } from "../../api/http";
import { OnboardingPhotoField } from "../onboarding/OnboardingPhotoField";
import {
  formatCpf,
  licenseCategories,
  type PreparedPhoto,
} from "../onboarding/rules";
import { vehicleLabel } from "../vehicles/rules";

const identity = createIdentityClient();
const http = createHttpTransport();

export function DriverCorrectionForm({
  registration,
  vehicles,
  onBack,
  onSaved,
  onVehicles,
}: {
  registration: RegistrationSummary;
  vehicles: Vehicle[];
  onBack: () => void;
  onSaved: () => Promise<void>;
  onVehicles: () => void;
}) {
  const items = registration.itensAjuste ?? [];
  const [photo, setPhoto] = useState<PreparedPhoto | null>(null);
  const [license, setLicense] = useState<PreparedPhoto | null>(null);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [readingLicense, setReadingLicense] = useState(false);
  const [personType, setPersonType] = useState("PF");
  const [cpf, setCpf] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="panel">
      <h1>Corrigir cadastro</h1>
      {registration.motivoAjuste && (
        <p className="alert">{registration.motivoAjuste}</p>
      )}
      {!items.length ? (
        <>
          <p>
            O administrador precisa indicar os itens a corrigir antes do
            reenvio.
          </p>
          <button className="secondary" onClick={onBack}>
            Voltar
          </button>
        </>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy || readingPhoto || readingLicense) return;
            if (
              (items.includes("foto") && !photo) ||
              (items.includes("cnh") && !license)
            ) {
              setError("Selecione uma nova imagem para cada item solicitado.");
              return;
            }
            const body: Record<string, unknown> = Object.fromEntries(
              new FormData(event.currentTarget),
            );
            setBusy(true);
            setError("");
            try {
              if (items.includes("foto") && photo)
                body.fotoPerfilId = (
                  await identity.upload(photo, "FOTO_PERFIL")
                ).id;
              if (items.includes("cnh") && license)
                body.documentoCnhId = (
                  await identity.upload(license, "CNH")
                ).id;
              await http.request("/driver/registration", {
                method: "POST",
                body: { ...body, expectedUpdatedAt: registration.atualizadoEm },
              });
              await onSaved();
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Não foi possível reenviar.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset className="plain-fieldset" disabled={busy}>
            {items.includes("dados") && (
              <fieldset className="plain-fieldset">
                <legend>Identificação</legend>
                <label>
                  Nome completo
                  <input name="nomeCompleto" required maxLength={120} />
                </label>
                <label>
                  CPF
                  <input
                    name="cpf"
                    required
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                  />
                </label>
                <label>
                  Tipo de pessoa
                  <select
                    name="tipoPessoa"
                    value={personType}
                    onChange={(e) => setPersonType(e.target.value)}
                  >
                    <option value="PF">Pessoa física</option>
                    <option value="PJ">Pessoa jurídica</option>
                  </select>
                </label>
                {personType === "PJ" ? (
                  <>
                    <label>
                      CNPJ
                      <input name="cnpj" required />
                    </label>
                    <label>
                      Razão social
                      <input name="razaoSocial" required maxLength={120} />
                    </label>
                  </>
                ) : (
                  <>
                    <input type="hidden" name="cnpj" value="" />
                    <input type="hidden" name="razaoSocial" value="" />
                  </>
                )}
              </fieldset>
            )}
            {items.includes("foto") && (
              <OnboardingPhotoField
                label="Nova foto do motorista"
                kind="profile"
                value={photo}
                onChange={setPhoto}
                onReading={setReadingPhoto}
              />
            )}
            {items.includes("cnh") && (
              <fieldset className="plain-fieldset">
                <legend>Habilitação</legend>
                <label>
                  Número da CNH
                  <input
                    name="cnhNumero"
                    required
                    inputMode="numeric"
                    maxLength={11}
                  />
                </label>
                <label>
                  Categoria
                  <select name="cnhCategoria" required>
                    {licenseCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Validade
                  <input type="date" name="cnhValidade" required />
                </label>
                <OnboardingPhotoField
                  label="Nova imagem da CNH"
                  kind="license"
                  value={license}
                  onChange={setLicense}
                  onReading={setReadingLicense}
                />
              </fieldset>
            )}
            {items.includes("veiculo") && (
              <>
                <label>
                  Veículo
                  <select name="veiculoId" required defaultValue="">
                    <option value="" disabled>
                      Selecione um veículo
                    </option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicleLabel(vehicle)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="secondary"
                  type="button"
                  onClick={onVehicles}
                >
                  Gerenciar veículos
                </button>
              </>
            )}
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <div className="actions">
              <button className="secondary" type="button" onClick={onBack}>
                Voltar
              </button>
              <button
                className="primary"
                disabled={readingPhoto || readingLicense}
              >
                {busy ? "Enviando…" : "Reenviar para análise"}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
}
