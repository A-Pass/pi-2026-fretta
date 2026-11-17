import { useEffect, useState } from "react";
import { Download, WifiOff } from "lucide-react";
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export function InstallApp({
  showControls = false,
}: {
  showControls?: boolean;
}) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null),
    [installed, setInstalled] = useState(false),
    [offline, setOffline] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        !!(navigator as Navigator & { standalone?: boolean }).standalone,
    );
    const install = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPrompt);
    };
    const done = () => {
      setInstalled(true);
      setPrompt(null);
    };
    const connection = () => setOffline(!navigator.onLine);
    connection();
    window.addEventListener("beforeinstallprompt", install);
    window.addEventListener("appinstalled", done);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() =>
          setError(
            "A instalação não está disponível neste momento. Você pode continuar usando pelo navegador.",
          ),
        );
    return () => {
      window.removeEventListener("beforeinstallprompt", install);
      window.removeEventListener("appinstalled", done);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, []);
  return (
    <>
      {offline && (
        <div className="connection-banner" role="status">
          <WifiOff size={18} /> Você está sem internet. O mapa e os serviços
          online podem ficar indisponíveis.
        </div>
      )}
      {showControls && (
        <section className="panel install-panel">
          <h2>
            <Download size={20} /> FRETTA no seu celular
          </h2>
          {installed ? (
            <p>Você já está usando a versão instalada.</p>
          ) : (
            <>
              <p>
                Adicione o FRETTA à tela inicial para abrir como aplicativo.
              </p>
              {prompt ? (
                <button
                  className="secondary"
                  onClick={async () => {
                    try {
                      await prompt.prompt();
                      await prompt.userChoice;
                      setPrompt(null);
                    } catch {
                      setError(
                        "Não foi possível abrir a instalação. Use o menu do navegador.",
                      );
                    }
                  }}
                >
                  Instalar FRETTA
                </button>
              ) : (
                <p className="muted">
                  No Android, procure “Instalar aplicativo” no menu do
                  navegador. No iPhone, use Compartilhar → Adicionar à Tela de
                  Início. A disponibilidade depende do navegador.
                </p>
              )}
            </>
          )}
          <p className="muted">
            Os mapas e a comunicação entre contas precisam de internet. A
            instalação não habilita esses recursos offline.
          </p>
          {error && <p role="status">{error}</p>}
        </section>
      )}
    </>
  );
}
