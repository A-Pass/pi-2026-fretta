"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SOCIAL_PROVIDER_GOOGLE, signIn } from '@/lib/auth-client';
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
import { Login, Margin } from "@mui/icons-material";
import { DEFAULT_ROUTE_AFTER_AUTHENTICATED } from "@/constants/routes";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const res = await signIn.email({
      email: formData.get("email"),
      password: formData.get("password")
    });

    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSubmitGoogle(e) {
    e.preventDefault();
    setLoading(true);

    await signIn.social({
      provider: SOCIAL_PROVIDER_GOOGLE,
      callbackURL: DEFAULT_ROUTE_AFTER_AUTHENTICATED
    });

    setLoading(false);
  }

  return (

    <Container maxWidth="sm">

      <Box textAlign="center" mb={3} >
        <Box display="flex" justifyContent="center">
          <Image
            src="/img/logo-marca.png"
            alt="Logo"
            margin={"0 auto"}
            sx={{ ml: "auto", mr: "auto" }}
            width={232}
            height={142} />
        </Box>
        <Typography variant="h5">
          Entrar na sua conta
        </Typography>
      </Box>

      {/* Erro */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Form login */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="E-mail"
            type="email"
            required
            fullWidth
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            name="password"
            required
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            endIcon={<Login />}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>

          <Button
            href="/ui/registrogeral"
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Não é usuário? Cadastre-se
          </Button>
          <Button
            href="/ui/auth/recovery"
            variant="text"
            sx={{ textTransform: "none" }}
          >
            Esqueceu sua senha?
          </Button>
        </Stack>
      </Box>

      {/* Login com Google */}
      <Box component="form" onSubmit={handleSubmitGoogle} mt={3}>
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          sx={{ textTransform: "none" }}
        >
          Entrar com Google
        </Button>
      </Box>
    </Container>
  );
}