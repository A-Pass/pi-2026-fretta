"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Stack, Typography } from "@mui/material";
import NavHeader from "@/components/NavHeader";

export default function Registrogeral() {
  return (
    <Box >
      <NavHeader />
      <Container >
        {/* Registro */}
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">Como você deseja se registrar?</Typography>

          <Link href="/ui/cadastrocliente">
            <img src="/registro-cliente.png" alt="Cadastro Cliente" width="100%" style={
              {objectFit: "cover"}
            }/>
          </Link>

          <Link href="/ui/cadastroprofissional">
            <img src="/registro-profissional.png" alt="Cadastro Profissional" width="100%" style={
              {objectFit: "cover"}
            }/>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}