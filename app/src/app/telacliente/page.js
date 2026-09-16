"use client";
import React from "react";
import "./style.css";

const Estabelecimento = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <header className="hero">
        <nav className="nav">
          <button className="nav-button">
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="nav-button">
            <i className="fas fa-share-alt"></i>
          </button>
        </nav>
        <div className="hero-content">
          <h1>Fogarel</h1>
          <p>Avenida Europa, 450, Dinah Borges, Eunápolis-BA</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Rating Section */}
        <div className="rating-section">
          <div className="stars">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
          </div>
        </div>

        {/* Description */}
        <div className="description">
          <div className="logo">
            <img src="/https://placehold.co/100x100" alt="Logo Fogarel" />
          </div>
          <p>
            A Barbearia Fogarel é o destino certo para o homem moderno,
            oferecendo uma combinação de estilo, qualidade e tradição...
          </p>
        </div>

        {/* Services */}
        <div className="services-section">
          <h2>Lista de serviços</h2>
          <div className="service-card">
            <div className="service-info">
              <h3>Corte</h3>
              <p>R$ 50,00 • ~45min</p>
            </div>
            <button className="book-button">Agendar</button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <i className="fas fa-home"></i>
          <span>Início</span>
        </button>
        <button className="nav-item">
          <i className="fas fa-search"></i>
          <span>Procurar</span>
        </button>
        <button className="nav-item">
          <i className="fas fa-calendar"></i>
          <span>Agendar</span>
        </button>
      </nav>
    </div>
  );
};

export default Estabelecimento;
