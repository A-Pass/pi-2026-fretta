"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function DriverPublicId({ code }: { code: string }) {
  const [message, setMessage] = useState("");

  return (
    <div className="driver-public-id">
      <label>
        ID do motorista
        <input
          readOnly
          value={code}
          onFocus={(event) => event.currentTarget.select()}
        />
      </label>
      <p>Compartilhe este ID com a empresa para receber um convite.</p>
      <button
        type="button"
        className="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setMessage("ID copiado.");
          } catch {
            setMessage("Selecione o ID acima e copie manualmente.");
          }
        }}
      >
        <Copy size={16} aria-hidden="true" /> Copiar ID
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
