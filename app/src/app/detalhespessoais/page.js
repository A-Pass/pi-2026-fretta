"use client"

import React from "react";

import styles from './detalhespessoais.module.css';



function EditarDetalhesPessoais() {
    const handleSaveClick = () => {
        window.location.href = './perfilcliente';
    };

    return (
        <div className={styles.Main}>
            <h1 className={styles.h1}>EDITAR DETALHES PESSOAIS</h1>
            <div className="alteracoes">
                <input
                    type="text"
                    placeholder="Nome Completo"
                    className={styles.inputtexto}
                    required />
                <input
                    type="email"
                    placeholder="E-mail"
                    className={styles.inputemail}
                    required />
                <input
                    type="datetime-local"
                    placeholder="Data de Nascimento"
                    className={styles.inputdata}
                    required />
            </div>

            <div className={styles.opcoes}>
                <input type="radio" name="opcao" value="masculino" /> Masculino
                <input type="radio" name="opcao" value="feminino" /> Feminino
            </div>

            <div className={styles.botoes}>
                <button type="button" onClick={handleSaveClick}>
                <img
                    src="/Salvar.png"
                    alt="Alterar Senha"
                    width={92}
                    height={80}
                  />                  </button>
                <button type="button">
                <a href="/ui/perfilcliente">
                <img
                    src="/Cancelar.png"
                    alt="Alterar Senha"
                    width={100}
                    height={50}
                  />                    </a>
                </button>
            </div>
        </div>
    );
}

export default EditarDetalhesPessoais;

