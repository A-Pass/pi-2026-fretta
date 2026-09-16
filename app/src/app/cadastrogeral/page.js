"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Form from 'next/form'
import { useRouter } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import {
  Box, Stack,
  Checkbox, FormControl,
  FormGroup, FormLabel,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Container,
  Typography,
  Button,
  CircularProgress,
  Radio
} from '@mui/material';
import { ROUTE_API_COMPLETA_CADASTRO,
  DEFAULT_ROUTE_AFTER_AUTHENTICATED
 } from '@/constants/routes'
import { useSession } from "@/lib/auth-client";
import { maskPhoneBR, maskCPF } from '@/helpers/masks';

export default function CadastroGeral() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const handleChangePhone = (e) => {
    setPhone(maskPhoneBR(e.target.value));
  };

  const handleChangeCpf = (e) => {
    setCpf(maskCPF(e.target.value));
  };


  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(DEFAULT_ROUTE_SIGN_OUT);
      return;
    }


  }, [isPending, session, router]);

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

      router.push(DEFAULT_ROUTE_AFTER_AUTHENTICATED);
    } else {
      alert('Falha no cadastro!');
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box>
      <NavHeader />

      {/* Cadastro Cliente */}
      <Container>
        <Typography variant="h4" component="h1" marginBottom="24px">Complete seu cadastro!</Typography>

        <form onSubmit={handleSubmit} method="POST" action={ROUTE_API_COMPLETA_CADASTRO} encType="application/json">
          <Stack spacing={2}>
            <TextField variant="filled" type="text" id="nome" name="nome" placeholder="Digite seu nome" value={session.user.name} required />

            <TextField 
              variant="filled" 
              type="text" 
              id="cpf" 
              name="cpf" 
              placeholder="CPF" 
              required="required"
              value={cpf}
              onChange={handleChangeCpf} />

            <TextField variant="filled" type="date" id="data" name="nascimento" required />

            <TextField 
              variant="filled" 
              type="text" 
              id="celular" 
              name="celular" 
              placeholder="Celular"
              value={phone}
              required="required"
              onChange={handleChangePhone} />

            
                <FormControlLabel
                  control={
                    <Checkbox name="isProfissional" />
                  }
                  label="Profissional"
                />

            {!session.user.hasPassword &&
              <TextField
                variant="filled"
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
                required />
            }
            {!session.user.hasPassword &&
              <TextField 
                variant="filled" 
                type="password" 
                id="confirma_senha" 
                name="confirma_senha" 
                placeholder="Confirme sua senha" 
                required />
            }
            <Button variant="contained" className="bt-cadastro" type="submit" fullWidth>Cadastrar</Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}