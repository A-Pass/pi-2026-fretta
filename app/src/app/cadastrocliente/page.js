"use client";

import React from "react";
import Link from "next/link";
import Form from 'next/form'
import { useRouter } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import { Box, Container, Typography, TextField, Stack, Button } from "@mui/material";


export default function Cadastrocliente() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    var object = {};
    const res = await fetch(e.target.action, {
      method: e.target.method.toUpperCase(),
      body: formData,
    });

    if (res.ok) {
      document.cookie = `auth-token=Bearer ${await res.text()}`;

      router.push('/ui/telaprincipal');
    } else {
      alert('Falha no cadastro!');
    }
  };

  return (
    <Box>
      <NavHeader />

      {/* Cadastro Cliente */}
      <Container>
        <Typography variant="h4" component="h1" marginBottom="24px">Cadastro Cliente</Typography>

        <form onSubmit={handleSubmit} method="POST" action="/api/auth/signup" encType="application/json">
           <Stack spacing={2}>  
            <TextField variant="filled" type="text" id="nome" name="nome" placeholder="Digite seu nome" required /><br />
{/*
            <TextField variant="filled" type="text" id="cpf" name="cpf" placeholder="CPF" required="required" />

            <TextField variant="filled" type="date" id="data" name="data_nascimento" required /><br />

            {/* Gênero }
            <div>
              <div className="genero">
                <input type="radio" id="masculino" name="sexo" value="M" />
                <label htmlFor="masculino" className="btn">Masculino</label>

                <input type="radio" id="feminino" name="sexo" value="F" />
                <label htmlFor="feminino" className="btn">Feminino</label>
              </div>
            </div><br /> */ }

            <TextField variant="filled" type="email" id="email" name="email" placeholder="Digite seu e-mail" required /><br />

            <TextField variant="filled" type="password" id="senha" name="senha" placeholder="Digite sua senha" required /><br />

            <TextField variant="filled" type="password" id="confirma_senha" name="confirma_senha" placeholder="Confirme sua senha" required /><br />

            <Button variant="contained" className="bt-cadastro" type="submit" fullWidth>Cadastrar</Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}