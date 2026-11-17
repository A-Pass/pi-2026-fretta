import { useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
export function useDiscardChanges(dirty: boolean) {
  const [open, setOpen] = useState(false);
  const action = useRef<(() => void) | null>(null);
  return {
    leave: (next: () => void) => {
      if (!dirty) next();
      else {
        action.current = next;
        setOpen(true);
      }
    },
    dialog: (
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Descartar alterações?"
        description="As alterações deste formulário ainda não foram salvas. Você pode continuar preenchendo ou descartá-las para sair."
        confirmLabel="Descartar e sair"
        cancelLabel="Continuar preenchendo"
        onConfirm={async () => {
          setOpen(false);
          action.current?.();
          action.current = null;
          return true;
        }}
      />
    ),
  };
}
