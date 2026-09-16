"use client";
import React, { useState } from "react";
import "./senhacliente.css"; 

const AlterarSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaSenha === repetirSenha) {
      window.location.href = "./perfilcliente";
    } else {
      alert("As senhas não coincidem!");
    }
  };

  return (
    <div className="body">
      <div className="Main">
        <h1 className="texto">ALTERAR SENHA</h1>
        <div className="alteracoes">
          <input
            type="password"
            placeholder="Senha Atual"
            className="senhaatual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nova Senha"
            className="novasenha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <input
            type="password"
            placeholder="Repetir Nova Senha"
            className="repetirsenha"
            value={repetirSenha}
            onChange={(e) => setRepetirSenha(e.target.value)}
          />
        </div>

        <div className="botões">
          <button type="submit" onClick={handleSubmit}>
            <img src="/Salvar.png" alt="Alterar Senha" width={92} height={80} />
          </button>

          <button>
            <a href="/perfilcliente">
              <img src="/Cancelar.png" alt="Cancelar" width={100} height={50} />
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlterarSenha;