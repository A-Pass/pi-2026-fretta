"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";

import {
  Container,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DEFAULT_ROUTE_AFTER_AUTHENTICATED } from "@/constants/routes";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Criar usuário
    const resSignUp = await signUp.email({ name, email, password,callbackURL: DEFAULT_ROUTE_AFTER_AUTHENTICATED });
    if (resSignUp?.error) {
      setError(resSignUp.error.message || "Algo deu errado.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2, // padding horizontal responsivo
      }}
    >

      <Stack spacing={3}>
        {/* Título */}
        <Box textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            Criar conta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha os dados para se cadastrar
          </Typography>
        </Box>

        {/* Erro */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nome completo"
              name="name"
              required
              fullWidth
              size="medium"
            />

            <TextField
              label="E-mail"
              name="email"
              type="email"
              required
              fullWidth
              size="medium"
            />

            <TextField
              label="Senha"
              name="password"
              type="password"
              required
              fullWidth
              inputProps={{ minLength: 8 }}
              helperText="Mínimo de 8 caracteres"
              size="medium"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </Stack>
        </Box>

        {/* Rodapé */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          Já tem uma conta?{" "}
          <Box
            component="span"
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => router.push("/login")}
          >
            Entrar
          </Box>
        </Typography>
      </Stack>
    </Container>
  );
}
