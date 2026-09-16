'use client';

import React, { useEffect, useState } from 'react';
import { useRouter  } from "next/navigation";
import './style.css';
import { Box, Checkbox, FormControl, FormGroup, FormLabel, FormControlLabel, InputLabel, Select, MenuItem, TextField, Container, Typography, Button } from '@mui/material';
import NavHeader from '@/components/NavHeader';
import UploadProfileImage from '@/components/UploadProfileImage';
import { Save } from '@mui/icons-material';
import UFFormControl from '@/components/forms/UFFormControl'

export default function CadastroProfissional() {
  const router = useRouter();

  /**
   * @type {Object}
   */
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    try {
      setSavedData(JSON.parse(localStorage.getItem('cadastro-profissional')));
    } catch(error) {
      router.push('/ui/auth')
    }
  }, []);

  async function onSubmitHandler(event) {
    event.preventDefault();

    const data = new FormData(event.target);

    /**
     * 
     */
    console.log(savedData);

    if(!!savedData) {
      Object.keys(savedData).forEach((k) => data.append(k, savedData[k]));
    }

    const res = await fetch(event.target.action, {
      method: event.target.method.toUpperCase(),
      body: data,
    });

    if (res.ok) {
      document.cookie = `auth-token=Bearer ${await res.text()}`;

      router.push('/ui/telaprincipal');
    } else {
      alert('Falha no cadastro!');
    }
  }

  return (
    <Box>
      <NavHeader />
      <Container maxWidth="lg">
        <Typography variant="h5" component="h1" marginBottom="48px">Cadastro Estabelecimento</Typography>
        <form action="/api/auth/signup-profissional" method="POST" onSubmit={onSubmitHandler}>
          <center><UploadProfileImage/></center>
          <TextField name="nomeFantasia" label="Nome Fantasia" variant="filled" required="required" margin="normal" fullWidth/>
          <TextField name="razaoSocial" label="Razão Social" variant="filled" fullWidth margin="normal" />
          <TextField id="cnpj" label="CNPJ" variant="filled" fullWidth margin="normal" />
          <FormControl component="fieldset" variant="standard" required="required" >
            <FormLabel component="legend">Atende:</FormLabel>
              <FormGroup sx={{ display: 'inline-block' }}>
                <FormControlLabel
                control={
                  <Checkbox name="atendeMasculino" required="required"/>
                }
                label="Masculino"
              />
              <FormControlLabel
              control={
                <Checkbox name="atendeFeminino"/>
              }
              label="Femino"
            />
            </FormGroup>
          </FormControl>
          <TextField name="telefoneOuCelular" label="Telefone/Celular" placeholder="(99) 9 9999-9999" variant="filled" fullWidth margin="normal"/>
          <TextField name="enderecoCep" label="CEP" placeholder="99999-999" variant="filled" fullWidth margin="normal"/>
          
          <TextField label="Cidade" name="enderecoCidade" fullWidth variant="filled" margin="normal" required="required"/>
          <TextField label="Bairro" name="enderecoBairro" fullWidth variant="filled" margin="normal" required="required" />
          <TextField label="Logradouro" name="enderecoLogradouro" variant="filled" required="required" fullWidth margin="normal"/>
          <TextField label="Número" name="enderecoNumero" variant="filled" margin="normal" type="number"/>
          <TextField label="Complemento" name="enderecoComplemento" variant="filled" margin="normal" fullWidth/>
          <TextField label="Referência" name="enderecoReferencia" variant="filled" margin="normal" fullWidth multiline/>
          <TextField label="Descrição" name="descricao" variante="filled" margin="normal" multiline rows="4" fullWidth/>
          
          <Button type="submit" variant="contained" endIcon={<Save />} fullWidth sx={{marginBottom: "24px", marginTop: "16px"}}>Salvar</Button>
        </form>
      </Container>
    </Box>
  );
}