import { useState, type FormEvent } from "react";
import { CheckCircle2, Star } from "lucide-react";
import type { Freight, Role, Store } from "@/contracts";
import { submitReview } from "../features/freights/rules";
export function ReviewForm({
  freight,
  role,
  store,
  save,
}: {
  freight: Freight;
  role: Role;
  store: Store;
  save: (s: Store) => Promise<boolean>;
}) {
  const [publishComment, setPublishComment] = useState(false);
  const [score, setScore] = useState(0),
    [comment, setComment] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (
        !(await save(
          submitReview(
            store,
            freight.id,
            role,
            score,
            comment,
            role === "cliente" && publishComment,
          ),
        ))
      )
        setError("Não foi possível enviar. Tente novamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar.");
    } finally {
      setBusy(false);
    }
  }
  if (freight.reviews[role])
    return (
      <section className="review-form" aria-live="polite">
        <h3>
          <CheckCircle2 size={18} /> Avaliação registrada
        </h3>
        <p>{freight.reviews[role]} de 5 estrelas</p>
        {freight.reviewComments?.[role] && (
          <p>{freight.reviewComments[role]}</p>
        )}
        <p className="muted">Obrigado por compartilhar sua experiência.</p>
      </section>
    );
  return (
    <form className="review-form" onSubmit={submit}>
      <h3>Como foi sua experiência?</h3>
      <fieldset className="plain-fieldset" disabled={busy}>
        <legend>Sua nota</legend>
        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input
                type="radio"
                name="score"
                value={n}
                checked={score === n}
                onChange={() => setScore(n)}
                required
              />
              <Star
                size={28}
                color="#9b5c00"
                fill={n <= score ? "#f5a623" : "none"}
              />
              <span className="sr-only">
                {n} {n === 1 ? "estrela" : "estrelas"}
              </span>
            </label>
          ))}
        </div>
        <label>
          Comentário (opcional)
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            placeholder="Conte como foi o atendimento…"
          />
        </label>
        {role === "cliente" && (
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={publishComment}
              onChange={(e) => setPublishComment(e.target.checked)}
            />{" "}
            Publicar meu comentário no perfil do prestador
          </label>
        )}
        <p className="muted">
          A nota compõe a avaliação do serviço. Evite incluir endereços,
          documentos ou outros dados pessoais no comentário.
        </p>
      </fieldset>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      <button className="primary" disabled={busy || !score}>
        {busy ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
