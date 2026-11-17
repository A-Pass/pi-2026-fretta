import { Package } from "lucide-react";
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel empty">
      <Package aria-hidden />
      <h3>{title}</h3>
      <p>{children}</p>
    </section>
  );
}
