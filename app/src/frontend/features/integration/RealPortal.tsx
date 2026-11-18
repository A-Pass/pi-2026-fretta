"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Store, Vehicle, Role } from "@/contracts";
import { authClient } from "../../api/auth-client";
import {
  createIdentityClient,
  type IdentityViewer,
  type RegistrationSummary,
} from "../../api/identity";
import { ApiRequestError, createHttpTransport } from "../../api/http";
import { LoginView } from "../LoginView";
import { VehicleBookView } from "../vehicles/VehicleBookView";
import { DriverOnboardingView } from "../onboarding/DriverOnboardingView";
import { parseRoute } from "../navigation/routes";
import { clearRequestDrafts } from "../requests/drafts";
const client = createIdentityClient();
export function RealPortal() {
  const router = useRouter(),
    pathname = usePathname(),
    route = parseRoute(pathname);
  const { data: session, isPending } = authClient.useSession();
  const [viewer, setViewer] = useState<IdentityViewer | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [admin, setAdmin] = useState(false),
    [vehicles, setVehicles] = useState<Vehicle[]>([]),
    [registration, setRegistration] = useState<RegistrationSummary | null>(
      null,
    ),
    [name, setName] = useState(""),
    [editingRegistration, setEditingRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = route.role,
    tab = route.tab;
  async function reload() {
    setLoading(true);
    setError("");
    try {
      const me = await client.me();
      setViewer(me);
      setName(me.name);
      if (me.roles.motorista) {
        const [list, status] = await Promise.all([
          client.vehicles(),
          client.registration(),
        ]);
        setVehicles(list);
        setRegistration(status);
      }
      try {
        await createHttpTransport().request("/admin/me");
        setAdmin(true);
      } catch (e) {
        if (!(e instanceof ApiRequestError) || e.status !== 403) throw e;
        setAdmin(false);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar sua conta.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (session) void reload();
    else {
      setViewer(null);
      setAdmin(false);
    }
  }, [session?.user.id]);
  useEffect(() => setEditingRegistration(false), [pathname]);
  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error)
        throw Error(result.error.message || "Não foi possível sair.");
      try {
        clearRequestDrafts(sessionStorage);
        sessionStorage.removeItem("fretta-demo-session");
      } catch {}
      setViewer(null);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível sair.");
    } finally {
      setBusy(false);
    }
  }
  if (isPending)
    return (
      <main className="loading" role="status">
        Conferindo sua sessão…
      </main>
    );
  if (!session)
    return (
      <>
        <div className="real-role-choice">
          <button
            className="secondary"
            onClick={() => router.push("/cliente/inicio")}
          >
            Sou cliente
          </button>
          <button
            className="secondary"
            onClick={() => router.push("/motorista/inicio")}
          >
            Sou motorista
          </button>
        </div>
        <LoginView
          role={role}
          real
          busy={busy}
          error={error}
          onBack={() => router.push("/")}
          onContinue={async () => {
            setBusy(true);
            setError("");
            try {
              const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${location.origin}/${role}/inicio`,
              });
              if (result.error)
                throw Error(
                  result.error.message || "Não foi possível entrar com Google.",
                );
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Não foi possível entrar.",
              );
              setBusy(false);
            }
          }}
        />
      </>
    );
  const nav = (tab: string) => router.push(`/${role}/${tab}`);
  if (editingRegistration && viewer?.roles.motorista) {
    const store: Store = {
      profile: { name: viewer.name, photo: viewer.image || "" },
      vehicles,
      freights: [],
      proposals: [],
      messages: [],
    };
    return (
      <DriverOnboardingView
        mode="real"
        store={store}
        onClient={() => {
          setEditingRegistration(false);
          nav("perfil");
        }}
        onServices={() => setEditingRegistration(false)}
        onLogout={() => void signOut()}
        onSubmit={async (draft) => {
          let vehicleId = draft.vehicleId;
          if (!vehicleId)
            vehicleId = (await client.createVehicle(draft.vehicle)).id;
          const photo = await client.upload(draft.profilePhoto!, "FOTO_PERFIL");
          const license = await client.upload(draft.licensePhoto!, "CNH");
          await client.submit(draft, vehicleId, photo.id, license.id);
          setEditingRegistration(false);
          await reload();
          nav("cadastro-motorista");
          return true;
        }}
      />
    );
  }
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/">
          FRETTA<span>•</span>
        </a>
        <b>{viewer?.name || session.user.name}</b>
        <button
          className="secondary"
          disabled={busy}
          onClick={() => void signOut()}
        >
          Sair da conta
        </button>
      </header>
      <main className="admin-main">
        <p className="real-mode-note">
          Conta conectada ao servidor. Seus dados desta área são persistidos no
          banco; os exemplos da demonstração não são usados aqui.
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando seus dados…</p>}
        <nav className="fleet-tabs" aria-label="Navegação da conta">
          <button className="secondary" onClick={() => nav("inicio")}>
            Início
          </button>
          <button className="secondary" onClick={() => nav("perfil")}>
            Meu perfil
          </button>
          {viewer?.roles.motorista && (
            <>
              <button className="secondary" onClick={() => nav("veiculos")}>
                Meus veículos
              </button>
              <button
                className="secondary"
                onClick={() => nav("cadastro-motorista")}
              >
                Cadastro do motorista
              </button>
            </>
          )}
          {admin && (
            <a className="secondary" href="/admin">
              Painel administrativo
            </a>
          )}
        </nav>
        {viewer && !viewer.roles[role] && (
          <section className="panel">
            <h2>Ativar perfil de {role}</h2>
            <p>Esta conta ainda não possui este perfil no servidor.</p>
            <button
              className="primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await client.activate(role);
                  await reload();
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "Não foi possível ativar.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Ativar perfil
            </button>
          </section>
        )}
        {tab === "veiculos" && viewer?.roles.motorista ? (
          <VehicleBookView
            vehicles={vehicles}
            onBack={() => nav("perfil")}
            onSave={async (next) => {
              try {
                for (const previous of vehicles)
                  if (!next.some((v) => v.id === previous.id))
                    await client.deleteVehicle(previous.id);
                for (const v of next) {
                  const previous = vehicles.find((x) => x.id === v.id);
                  if (!previous) await client.createVehicle(v);
                  else if (JSON.stringify(previous) !== JSON.stringify(v))
                    await client.updateVehicle(v);
                }
                await reload();
                return true;
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "Não foi possível salvar os veículos.",
                );
                await reload();
                return false;
              }
            }}
          />
        ) : tab === "cadastro-motorista" && viewer?.roles.motorista ? (
          <section className="panel">
            <h1>Cadastro do motorista</h1>
            <p>
              Situação: <b>{registration?.status || "Carregando"}</b>
            </p>
            {registration?.motivoAjuste && (
              <p className="alert">{registration.motivoAjuste}</p>
            )}
            <p>
              O envio fica em análise até a decisão de um administrador. A
              aprovação não é automática.
            </p>
            {(registration?.status === "NAO_ENVIADO" ||
              registration?.status === "AJUSTES_SOLICITADOS") && (
              <button
                className="primary"
                onClick={() => setEditingRegistration(true)}
              >
                {registration?.cadastroCompleto
                  ? "Corrigir e reenviar cadastro"
                  : "Completar cadastro"}
              </button>
            )}
            <button className="secondary" onClick={() => void reload()}>
              Atualizar situação
            </button>
          </section>
        ) : tab === "perfil" ? (
          <section className="panel profile profile-overview">
            <h1>Meu perfil</h1>
            {viewer?.image && (
              <img
                className="profile-photo"
                alt="Sua foto do Google"
                src={viewer.image}
              />
            )}
            <p>{viewer?.email}</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  await client.rename(name);
                  await reload();
                } catch (e) {
                  setError(
                    e instanceof Error
                      ? e.message
                      : "Não foi possível salvar o nome.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                Nome de exibição
                <input
                  minLength={2}
                  maxLength={100}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button className="primary" disabled={busy}>
                Salvar nome
              </button>
            </form>
            <p>
              A foto desta conta vem do Google. O servidor atual permite editar
              somente o nome.
            </p>
            <button
              className="secondary"
              onClick={() =>
                router.push(
                  `/${role === "cliente" ? "motorista" : "cliente"}/perfil`,
                )
              }
            >
              Alternar para perfil de{" "}
              {role === "cliente" ? "motorista" : "cliente"}
            </button>
          </section>
        ) : (
          <section className="panel">
            <h1>Olá, {viewer?.name || session.user.name}</h1>
            <p>
              Seu login e seu perfil estão conectados. Você já pode atualizar o
              nome, gerenciar veículos e acompanhar o cadastro do motorista.
            </p>
            <p>
              As telas de fretes e de equipe ainda aguardam suas APIs para
              funcionar com contas reais. Elas continuam disponíveis no ambiente
              demonstrativo separado.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
