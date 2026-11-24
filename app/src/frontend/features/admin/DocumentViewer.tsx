import { useEffect, useId, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
export function DocumentViewer({
  source,
  onClose,
  demo = true,
}: {
  source: { src: string; title: string } | null;
  onClose: () => void;
  demo?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    titleId = useId();
  const [zoom, setZoom] = useState(1),
    [rotation, setRotation] = useState(0),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (source) {
      setZoom(1);
      setRotation(0);
      setFailed(false);
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [source]);
  return (
    <dialog
      ref={dialog}
      className="admin-image-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="section-head">
        <h2 id={titleId}>{source?.title || "Visualizar imagem"}</h2>
        <button autoFocus aria-label="Fechar visualização" onClick={onClose}>
          <X />
        </button>
      </div>
      <p>
        {demo
          ? "Exibição de demonstração. Nenhuma imagem confirma a autenticidade de um documento."
          : "Documento privado. Acesso autorizado pelo servidor; não compartilhe esta imagem."}
      </p>
      <div className="actions">
        <button
          className="secondary"
          aria-label="Diminuir imagem"
          disabled={zoom <= 0.5}
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
        >
          <ZoomOut />
        </button>
        <span aria-live="polite">{Math.round(zoom * 100)}%</span>
        <button
          className="secondary"
          aria-label="Ampliar imagem"
          disabled={zoom >= 3}
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
        >
          <ZoomIn />
        </button>
        <button
          className="secondary"
          onClick={() => setRotation((r) => (r + 90) % 360)}
        >
          <RotateCw size={18} />
          Girar
        </button>
        <button
          className="secondary"
          onClick={() => {
            setZoom(1);
            setRotation(0);
          }}
        >
          Restaurar tamanho
        </button>
      </div>
      <div className="admin-image-scroll">
        {source && !failed ? (
          <div
            style={{
              width: `${zoom * 100}%`,
              minWidth: "50%",
              padding: rotation % 180 ? "20% 0" : 0,
            }}
          >
            <img
              src={source.src}
              alt={source.title}
              style={{ width: "100%", transform: `rotate(${rotation}deg)` }}
              onError={() => setFailed(true)}
            />
          </div>
        ) : failed ? (
          <p role="alert">
            Não foi possível carregar a imagem. Feche e tente novamente.
          </p>
        ) : null}
      </div>
    </dialog>
  );
}
