import React from "react";
import "./Agendamentos.css";

const agendamentos = [
  { id: 1, status: "Pendente", statusClass: "pending" },
  { id: 2, status: "Confirmado", statusClass: "confirmed" },
  { id: 3, status: "Cancelado", statusClass: "canceled", mensagem: "Desculpa, surgiu um imprevisto..." },
];

const Agendamentos = () => {
  return (
    <div className="container">
      <header className="header">
        <button className="back-button">←</button>
        <h2>Seus agendamentos</h2>
        <div className="icons">
          <span className="bell-icon">🔔</span>
          <span className="profile-icon">👤</span>
        </div>
      </header>

      {agendamentos.map((agendamento) => (
        <div key={agendamento.id} className="card">
          <div className="top">
            <div className="profile">
              <img src="/barbershop-logo.png" alt="Logo" className="logo" />
              <div>
                <h3>Fogarel</h3>
                <p>Cabelo e barba</p>
              </div>
            </div>
            <button className="delete">🗑</button>
          </div>

          <div className="images">
            <img src="/corte.jpg" alt="Corte" />
            <img src="/barba.jpg" alt="Barba" />
          </div>

          <div className="details">
            <p><strong>17/08/2024</strong></p>
            <p>10:00 ~ 11:05</p>
            <p>R$ 80,00</p>
            <p>João Fulano de Tal</p>
            <p>Avenida Europa, 450, Dinah Borges, Eunápolis-BA</p>
          </div>

          <div className={`status ${agendamento.statusClass}`}>
            {agendamento.status}
          </div>

          {agendamento.status === "Cancelado" && (
            <div className="cancel-info">
              <p>{agendamento.mensagem}</p>
              <button className="reagendar">Reagendar</button>
            </div>
          )}
        </div>
      ))}

      <nav className="bottom-nav">
        <button>🏠 Início</button>
        <button>🔍 Procurar</button>
        <button className="active">📅 Agendas</button>
      </nav>
    </div>
  );
};

export default Agendamentos;
