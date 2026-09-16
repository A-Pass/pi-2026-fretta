'use client';

export default function FiltrosCategorias({
  categorias,
  categoriaAtiva,
  onChange
}) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {categorias.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all shadow-sm
            ${
              categoriaAtiva === cat
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-500 border-slate-200'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
