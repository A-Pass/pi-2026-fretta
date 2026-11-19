"use client";

import { useEffect, useState } from "react";
import { companyPlanPriceCents } from "@/contracts/company-plan";
import { ArrowLeft, Copy } from "lucide-react";
import { createHttpTransport } from "../../api/http";
import { SuccessDialog } from "../../components/SuccessDialog";

const http = createHttpTransport();
type Invoice =
  | { active: false; id: string; code: string; qr: string }
  | { active: true; expiresAt: string };

export function DemoPixView({
  onBack,
  onActivated,
  companySeats,
}: {
  onBack: () => void;
  onActivated: () => Promise<void>;
  companySeats?: number;
}) {
  const isCompany = companySeats !== undefined;
  const price = isCompany
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(companyPlanPriceCents(companySeats) / 100)
    : "R$ 49,90";
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  async function create(signal?: AbortSignal) {
    setBusy(true);
    setError("");
    try {
      const result = await http.request<Invoice>(
        isCompany ? "/company/create-plan-payment" : "/subscription/demo",
        {
          method: "POST",
          body: isCompany ? { seats: companySeats } : { action: "create" },
          signal,
        },
      );
      if (!signal?.aborted) setInvoice(result);
    } catch (e) {
      if (!signal?.aborted)
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível abrir o pagamento.",
        );
    } finally {
      if (!signal?.aborted) setBusy(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    void create(controller.signal);
    return () => controller.abort();
  }, [companySeats]);

  async function confirm() {
    if (busy || !invoice || invoice.active) return;
    setBusy(true);
    setError("");
    try {
      const updated = await http.request<Invoice>(
        isCompany ? "/company/confirm-plan-payment" : "/subscription/demo",
        {
          method: "POST",
          body: { action: "confirm", id: invoice.id },
        },
      );
      setInvoice(updated);
      setSuccess(true);
      await onActivated();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível confirmar o teste.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="back" onClick={onBack}>
        <ArrowLeft size={18} />{" "}
        {isCompany ? "Voltar ao plano" : "Voltar ao início"}
      </button>
      <section className="panel demo-pix">
        <h1>{isCompany ? "Pagamento do plano da empresa" : "Ativar acesso"}</h1>
        <p className="demo-pix-price">
          {price}{" "}
          <small>
            {isCompany
              ? `${companySeats} ${companySeats === 1 ? "vaga" : "vagas"} · valor mensal`
              : "por 30 dias"}
          </small>
        </p>
        <p>
          Pix de demonstração. O QR Code e o código abaixo são ilustrativos e
          não movimentam dinheiro.
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {!invoice &&
          (busy ? (
            <p role="status">Gerando cobrança…</p>
          ) : (
            <button className="secondary" onClick={() => void create()}>
              Tentar novamente
            </button>
          ))}
        {invoice?.active && (
          <p className="driver-review-approved">Acesso ativo</p>
        )}
        {invoice && !invoice.active && (
          <>
            <p className="driver-review-pending">
              Aguardando pagamento de teste
            </p>
            <img
              src={invoice.qr}
              width={220}
              height={220}
              alt="QR Code de demonstração, sem valor bancário"
            />
            <label>
              Código de demonstração
              <input
                readOnly
                value={invoice.code}
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <button
              className="secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(invoice.code);
                  setCopied(true);
                } catch {
                  setError("Selecione o código acima e copie manualmente.");
                }
              }}
            >
              <Copy size={17} /> {copied ? "Código copiado" : "Copiar código"}
            </button>
            <button
              className="primary"
              disabled={busy}
              onClick={() => void confirm()}
            >
              {busy ? "Confirmando…" : "Simular pagamento"}
            </button>
          </>
        )}
      </section>
      <SuccessDialog
        open={success}
        title={isCompany ? "Plano atualizado!" : "Acesso ativado!"}
        description={
          isCompany
            ? "Pagamento de teste confirmado. As vagas do plano foram atualizadas."
            : "Pagamento de teste confirmado. As solicitações de frete estão disponíveis."
        }
        actionLabel={isCompany ? "Ver meu plano" : "Ver solicitações"}
        onClose={() => setSuccess(false)}
        onAction={onBack}
      />
    </>
  );
}
