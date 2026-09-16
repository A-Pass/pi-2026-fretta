"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { DEFAULT_ROUTE_SIGN_OUT } from "@/constants/routes";

export default function HomePage() {

  //const session = getServerSession();


  const [toggle, setToggle] = useState("todos");

  const handleToggleChange = (event) => {
    setToggle(event.target.id);
  };

  return (
    <div>
      {/* Top Bar */}
      <div id="top-bar2">
        <Link href="/ui/auth">
          <img src="/arrow-back-icon.svg" alt="Voltar para login" width={48} height={48} />
        </Link>

        <div className="itenstopbar">
          <img src="/bell-icon.svg" alt="Notificações" width={48} height={48} />
          <Link href="/ui/perfilcliente">
            <img src="/account-circle.svg" alt="Perfil do Cliente" width={48} height={48} />
          </Link>
        </div>

        <div className="itenstopbar">
          <Button onClick={ () => signOut({callbackUrl: DEFAULT_ROUTE_SIGN_OUT}) }>Sair</Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div id="index-content">
        {/* Carrossel */}
        <div className="carousel">
          <img src="/masculino.png" alt="Estilo Masculino" />
        </div>

        {/* Mais Populares */}
        <div id="populares">
          <p>Mais populares</p>
          <img src="/https://placehold.co/316x205" alt="Imagem de exemplo" />
        </div>

        {/* Lojas */}
        <div className="lojas">
            <div className="toggle-switch">
              <input type="radio" id="todos" name="toggle" checked={toggle === "todos"} onChange={handleToggleChange} />
              <label htmlFor="todos">Todos</label>
              <input type="radio" id="favoritos" name="toggle" checked={toggle === "favoritos"} onChange={handleToggleChange} />
              <label htmlFor="favoritos">Favoritos</label>
            </div>

         <div className="lojas">
            <Link href="/telacliente" className="business-listing">
              <div className="icon">
                <img src="/fogarel.png" alt="Fogarel Icon" />
              </div>
              <div className="details">
                <h3>Fogarel</h3>
                <p>Avenida Europa, 450, Dinah Borges, Eunápolis-BA</p>
                <div className="rating">
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                  <span className="star">&#9733;</span>
                </div>
              </div>
            </Link>
            </div>; 
        </div>
      </div>

      {/* Navbar */}
      <div className="rodape">
        <Link href="/ui/telaprincipal">
          <img
            src="/Rodape1perfil-cliente.png"
            alt="Rodapé 1"
            className="imgrodape"
          />
        </Link>
        <Link href="/ui/carregarbusca">
          <img src="/Rodape2perfil-cliente.png" alt="Rodapé 2" />
        </Link>
        <Link href="/ui/telaagendamento">
          <img src="/Rodape3perfil-cliente.png" alt="Rodapé 3" />
        </Link>
      </div>      
    </div>
  );
}
