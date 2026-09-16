"use client";

import React, { useState } from "react";
import "./telaagendamento.css";

const atividades = {
  1: "Corte e Barba",
  2: "Corte",
  4: "Corte e Barba",
  6: "Horário de Almoço",
  7: "Barba",
  8: "Platinado",
  10: "Corte e Barba",
  12: "Barba",
  13: "Corte",
  14: "Corte e Barba",
};

const Agendamento= () => {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div id="registroEstabelecimento">
      {/* Seta para voltar */}
      <div className="imgseta">
        <a href="/ui/telaprincipal">
          <img src="/arrow-back-icon.svg" alt="Voltar" width="24" height="24" />
        </a>
      </div>

      {/* Input de Data */}
      <div className="boxdate">
        <h2>Novo Agendamento</h2>
        <input
          className="date"
          type="date"
          id="dataagenda"
          name="data"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </div>

      {/* Lista de agendamentos */}
      <div className="schedule-container">
        <div className="schedule">
          {[...Array(31)].map((_, i) => {
            const dia = i + 1;
            return (
              <div key={dia} className={`day-slot ${atividades[dia] ? "" : "empty"}`} data-day={dia}>
                <span className="day">{dia}</span>
                <span className="activity">{atividades[dia] || "Disponível"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agendamento;