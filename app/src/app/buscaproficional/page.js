"use client";

import React, { useState } from "react";

export default function BuscaProfissional() {
  const [search, setSearch] = useState("");

  return (
    <div className="">
      {/* Top Bar */}
      <div className="">
        <img src="/arrow-back-icon.svg" alt="Voltar" width="24" height="24" />
      </div>

      <h2 className="">Cadastro Profissional</h2>

      {/* Barra de Pesquisa */}
      <div className="">
        <input
          type="text"
          name="pesquisaProfissional"
          className=""
          placeholder="Pesquisa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img src="/Icon (1).png" alt="Buscar" width="24" height="24" className="ml-2 cursor-pointer" />
        {search && (
          <img
            src="/Icon.png"
            alt="Cancelar"
            width="24"
            height="24"
            className="ml-2 cursor-pointer"
            onClick={() => setSearch("")}
          />
        )}
      </div>

      {/* Card Profissional */}
      <div className="">
        <div className="w-16 h-16">
          <img src="/fogarel.png" alt="Logo" className="" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="">Fogarel</h3>
          <p className="">Presencial • $$ • 1.2 miles away</p>
          <p className="">Entre para saber mais.</p>
        </div>
        <div className="">★★★</div>
      </div>
    </div>
  );
}
