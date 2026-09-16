import Image from "next/image";
import {useSessionm, signOut} from '@/lib/auth-client';
import React from "react";


import styles from "./perfilcliente.module.css";


import Link from "next/link";



export default function perfilcliente() {
    return (

        
            <div className={styles.perfilcontainer}>
              <div className={styles.topbar}>
                <Link href="/ui/telaprincipal">
                  <img
                    src="/arrow-back-icon.svg"
                    alt="Voltar"
                    width={48}
                    height={48}
                    className={styles.seta}
                  />
                </Link>
              </div>
        
              <div className={styles.Main}>
                <h1>Perfil</h1>
        
                <div className={styles.container}>
                  <img
                    src="/perfil-cliente.png"
                    alt="Foto de Perfil"
                    width={100}
                    height={100}
                    className={styles.fotoperfil}
                  />
                  <img
                    src="/mudar-foto-perfil.png"
                    alt="Mudar Foto"
                    width={30}
                    height={30}
                    className="mudarFoto"
                  />
                </div>
                  <div className={styles.texto}>
                  <h2>Nome do usuário</h2>
                  <h3>exemplo@gmail.com</h3>


                  </div>
                
        
                <Link href="/ui/detalhespessoais">
                  <img
                    src="/opcao1perfil-cliente.png"
                    alt="Detalhes Pessoais"
                    className={styles.opçoes}
                  />
                </Link>
        
                <Link href="/ui/senhacliente">
                  <img
                    src="/opcao2perfil-cliente.png"
                    alt="Alterar Senha"
                    className={styles.opçoes}

                  />
                </Link>
              </div>
        
              <div className={styles.rodape}>
                <Link href="/ui/telaprincipal">
                  <img
                    src="/Rodape1perfil-cliente.png"
                    alt="Rodapé 1"
                    className={styles.imgrodape}
                  />
                </Link>

                <Link href="/ui/carregarbusca">
                <img
                  src="/Rodape2perfil-cliente.png"
                  alt="Rodapé 2"
                />
                </Link>

                <Link href="/ui/telaagendamento">
                <img
                  src="/Rodape3perfil-cliente.png"
                  alt="Rodapé 3"
                />
                </Link>                
              </div>
            </div>
          );
        }
        


  