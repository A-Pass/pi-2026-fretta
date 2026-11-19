import Link from "next/link";

export function AdminReviewNav({
  current,
}: {
  current: "drivers" | "companies";
}) {
  return (
    <nav className="admin-review-nav" aria-label="Cadastros para análise">
      <Link
        href="/admin"
        aria-current={current === "drivers" ? "page" : undefined}
      >
        Motoristas
      </Link>
      <Link
        href="/admin/empresas"
        aria-current={current === "companies" ? "page" : undefined}
      >
        Empresas
      </Link>
    </nav>
  );
}
