"use client"
import React from "react";
import "./carregarbusca.css";
import Link from "next/link";

export default function Caregarbusca() {
  return (
    <div className="container">
      <input type="text" placeholder="serviço ou estabelecimentos..." className="search-bar" />
      <div className="list">
        {[
          { name: "Fogarel", address: "Avenida Europa, 450, Dinah Borges, Eunápolis-BA", image: "fogarel.png" },
        ].map((item, index) => (
          <div className="item" key={index}>
            <img src={`/${item.image}`} alt={item.name} className="icon" />
            <div>
              <h3>{item.name}</h3>
              <p>{item.address}</p>
            </div>
            <span className="stars">⭐⭐⭐⭐</span>
          </div>
        ))}
      </div>
      <nav className="bottom-nav">

      <Link href="/ui/telaprincipal">
        <span>🏠 Início</span>
        </Link>

        <Link href="/ui/carregarbusca">
        <span className="active">🔍 Procurar</span>
        </Link>

        <Link href="/ui/telaagendamento">
        <span>📅 Agendas</span>
        </Link>
        
      </nav>
    </div>
  );
}
