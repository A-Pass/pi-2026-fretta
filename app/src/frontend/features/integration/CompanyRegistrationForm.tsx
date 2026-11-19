"use client";

import { useState } from "react";
import { createBackendClient } from "../../api/backend";
import { prepareFreightPhoto } from "../onboarding/images";

export type CompanyRegistration = {
  legalName: string;
  cnpj: string;
  contact: string;
  email: string;
  logoId: string | null;
  documentId: string | null;
};

export function CompanyRegistrationForm({
  initial,
  busy,
  save,
  cancel,
  startAtProof = false,
  correctionReason,
}: {
  initial: CompanyRegistration;
  busy: boolean;
  save: (data: CompanyRegistration) => Promise<boolean>;
  cancel?: () => void;
  startAtProof?: boolean;
  correctionReason?: string | null;
}) {
  const [step, setStep] = useState(startAtProof ? 2 : 0);
  const [fields, setFields] = useState(initial);
  const [document, setDocument] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const titles = [
    "Dados da empresa",
    "Responsável e logo",
    "Comprovante do CNPJ",
    "Revisão",
  ];
  const input = (
    key: keyof Omit<CompanyRegistration, "logoId" | "documentId">,
    label: string,
    type = "text",
    maxLength = 120,
    hint?: string,
  ) => (
    <label>
      {label}
      {hint && <small>{hint}</small>}
      <input
        type={type}
        required
        maxLength={maxLength}
        value={fields[key]}
        onChange={(event) =>
          setFields({ ...fields, [key]: event.target.value })
        }
      />
    </label>
  );
  return (
    <section className="panel company-registration">
      <p className="eyebrow">
        Etapa {step + 1} de {titles.length}
      </p>
      <h2>{titles[step]}</h2>
      {correctionReason && (
        <p className="alert">
          <strong>Ajustes solicitados</strong>
          <br />
          {correctionReason}
        </p>
      )}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (step < titles.length - 1) {
            setStep(step + 1);
            return;
          }
          setUploading(true);
          setError("");
          try {
            let logoId = fields.logoId;
            if (logo) {
              const prepared = await prepareFreightPhoto(logo);
              logoId = (
                await createBackendClient().upload(
                  new File(
                    [await (await fetch(prepared.dataUrl)).blob()],
                    "logo.jpg",
                    { type: prepared.type },
                  ),
                  "company",
                )
              ).id;
              setFields({ ...fields, logoId });
              setLogo(null);
            }
            let documentId = fields.documentId;
            if (document) {
              let proofFile = document;
              if (
                document.type !== "application/pdf" &&
                !/\.pdf$/i.test(document.name)
              ) {
                const prepared = await prepareFreightPhoto(document);
                const bytes = await (await fetch(prepared.dataUrl)).blob();
                proofFile = new File([bytes], "comprovante.jpg", {
                  type: prepared.type,
                });
              }
              documentId = (
                await createBackendClient().upload(proofFile, "company-proof")
              ).id;
              setFields({ ...fields, logoId, documentId });
              setDocument(null);
            }
            await save({ ...fields, logoId, documentId });
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Não foi possível enviar o arquivo.",
            );
          } finally {
            setUploading(false);
          }
        }}
      >
        {step === 0 && (
          <>
            {input(
              "legalName",
              "Nome da empresa",
              "text",
              120,
              "Digite o nome que aparece no cadastro do CNPJ.",
            )}
            {input("cnpj", "CNPJ", "text", 22)}
          </>
        )}
        {step === 1 && (
          <>
            {input("contact", "Nome do responsável")}
            {input("email", "E-mail do responsável", "email", 254)}
            <label>
              Logo da empresa (opcional)
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
              />
            </label>
            {fields.logoId && !logo && (
              <button
                type="button"
                className="secondary"
                onClick={() => setFields({ ...fields, logoId: null })}
              >
                Remover logo atual
              </button>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <p>
              Use o comprovante de inscrição e situação cadastral da empresa.
            </p>
            <a
              className="secondary real-freight-link"
              href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_S.aspx"
              target="_blank"
              rel="noreferrer"
            >
              Emitir comprovante na Receita Federal
            </a>
            <label>
              {fields.documentId
                ? "Substituir comprovante do CNPJ"
                : "Anexar comprovante do CNPJ"}
              <small>
                Anexe o PDF do comprovante ou uma foto legível. PDFs podem ter
                até 5 MB.
              </small>
              <input
                type="file"
                accept="image/*,application/pdf,.pdf"
                required={!fields.documentId && !document}
                onChange={(event) =>
                  setDocument(event.target.files?.[0] ?? null)
                }
              />
            </label>
            {(document || fields.documentId) && (
              <p>
                {document
                  ? `Novo comprovante: ${document.name}`
                  : "Já há um comprovante salvo. Selecione um novo arquivo para substituí-lo."}
              </p>
            )}
          </>
        )}
        {step === 3 && (
          <dl className="company-review-data">
            <dt>Nome da empresa</dt>
            <dd>{fields.legalName}</dd>
            <dt>CNPJ</dt>
            <dd>{fields.cnpj}</dd>
            <dt>Responsável</dt>
            <dd>
              {fields.contact} · {fields.email}
            </dd>
            <dt>Comprovante do CNPJ</dt>
            <dd>
              {document?.name ??
                (fields.documentId ? "Arquivo salvo" : "Pendente")}
            </dd>
            <dt>Logo</dt>
            <dd>
              {logo?.name ??
                (fields.logoId ? "Imagem cadastrada" : "Sem imagem")}
            </dd>
          </dl>
        )}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <div className="proposal-actions">
          {(step > 0 || cancel) && (
            <button
              type="button"
              className="secondary"
              disabled={busy || uploading}
              onClick={() => (step > 0 ? setStep(step - 1) : cancel?.())}
            >
              Voltar
            </button>
          )}
          <button className="primary" disabled={busy || uploading}>
            {step < titles.length - 1
              ? "Continuar"
              : uploading || busy
                ? "Salvando…"
                : correctionReason
                  ? "Reenviar para análise"
                  : "Salvar cadastro"}
          </button>
        </div>
      </form>
    </section>
  );
}
