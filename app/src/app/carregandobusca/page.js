"use client"
import React from "react";

import { useState } from "react";

import "./carregandobusca.css";
import Link from "next/link";

export default function Buscar() {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);

  return (
    <><div id="top-bar2">
          <Link href="/ui/telaprincipal">
              <img src="/arrow-back-icon.svg" alt="Voltar para tela principal" width={48} height={48} />
          </Link>

          <div className="itenstopbar">
              <img src="/bell-icon.svg" alt="Notificações" width={48} height={48} />

              <Link href="/ui/perfilcliente">
                  <img src="/account-circle.svg" alt="Perfil do Cliente" width={48} height={48} />
              </Link>
          </div>
      </div><div className="container">
              <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar..." />
              <button onClick={() => setBusca("")}>X</button>
              <button onClick={() => setCarregando(true)}>🔍</button>

              {carregando && <div className="loading"></div>}

              <nav>
                  <button>🏠 Início</button>
                  <button className="active">🔍 Procurar</button>
                  <button>📅 Agendas</button>
              </nav>
          </div></>
  );
}
