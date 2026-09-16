"use client";
import React from "react";
import Link from "next/link";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";

dayjs.locale(ptBR)

export default function CadastroProfissional() {
  const router = useRouter();

  const handlerSubmit = (e) => {
    e.preventDefault();

    const fdata = new FormData(e.target);

    const dados = {
    }

    fdata.forEach((value, key) => {
      dados[key] = value;
    });

    localStorage.setItem('cadastro-profissional', JSON.stringify(dados));

    router.push(e.target.action);
  }

  return (
    <Box>
      <NavHeader />

      <Container>
        {/* Cadastro */}
        <Typography variant="h4" component="h1" marginBottom="24px">Cadastro Profissional</Typography>

        <div className="imgcadastro">
          <img src="/ic_profissional 1.png" alt="Ícone Profissional" />
        </div>

        {/* Formulário */}
        <form action="/ui/registroestabelecimento" onSubmit={handlerSubmit}>
          <Stack spacing={2}>
            <TextField variant="filled" type="text" id="nome" name="nome" placeholder="Digite seu nome" required />

            <TextField variant="filled" type="text" id="cpf" name="cpf" placeholder="CPF" required="required" />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
              <MobileDatePicker name="nascimento" defaultValue={dayjs()} format="DD/MM/YYYY" slotProps={{
          textField: {
            variant: "filled", // Define o estilo "Filled"
            fullWidth: true, // Faz o input ocupar toda a largura
          },
        }} />
            </LocalizationProvider>

            {/* Gênero */}
            <div className="genero">
              <input type="radio" id="masculino" name="sexo" value="M" required />
              <label htmlFor="masculino" className="btn">Masculino</label>

              <input type="radio" id="feminino" name="sexo" value="F" />
              <label htmlFor="feminino" className="btn">Feminino</label>
            </div>
            <br />

            <TextField variant="filled" type="email" id="email" name="email" placeholder="Digite seu e-mail" required />
            <br />

            <TextField variant="filled" type="password" id="senha" name="senha" placeholder="Digite sua senha" required />
            <br />

            <TextField variant="filled" type="password" id="confirma_senha" name="confirma_senha" placeholder="Confirme sua senha" required />
            <br />

            <Button variant="contained" type="submit">
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
