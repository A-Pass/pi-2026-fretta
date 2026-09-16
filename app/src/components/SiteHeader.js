import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src="/logo.svg"
              alt="Home Clean"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm text-slate-500">Home Clean</p>
            <p className="text-base font-semibold">Plataforma</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Cadastrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
