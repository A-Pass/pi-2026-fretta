import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
export function PhotoGallery({ photos }: { photos: string[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  return (
    <>
      <div className="gallery">
        {photos.map((src, i) => (
          <button
            type="button"
            key={i}
            aria-label={`Ampliar foto dos itens ${i + 1}`}
            onClick={() => setSelected(i)}
          >
            <img src={src} alt={`Foto dos itens ${i + 1}`} />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Foto dos itens ampliada"
        onCancel={(e) => {
          e.preventDefault();
          setSelected(null);
        }}
      >
        <button
          autoFocus
          aria-label="Fechar foto"
          onClick={() => setSelected(null)}
        >
          <X />
        </button>
        {selected !== null && (
          <img
            src={photos[selected]}
            alt={`Foto dos itens ${selected + 1} ampliada`}
          />
        )}
      </dialog>
    </>
  );
}
