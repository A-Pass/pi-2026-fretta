// src/components/ModalBase.jsx
"use client";

import { useEffect } from "react";

export default function ModalBase({ children, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[999]" onClick={onClose} />
      <div className="fixed inset-0 z-[1000] flex items-end justify-center" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
          {children}
        </div>
      </div>
    </>
  );
}
