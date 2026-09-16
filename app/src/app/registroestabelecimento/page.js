import React from 'react';
import Link from 'next/link';
import { Card, CardActions, CardContent, Typography, Button, Stack, Box, Container } from '@mui/material';
import './style.css';
import NavHeader from '@/components/NavHeader';
import { blueGrey } from '@mui/material/colors';

const Estabelecimento = () => {
  const cardBg = blueGrey['200'];
  return (
    <Box >
      <NavHeader/>
      <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ fontSize: "1.8em" }} marginBottom="48px">Dados do estabelecimento</Typography>
      <Stack spacing={4}>
        <Card sx={{ backgroundColor: cardBg}}>
          <CardContent>
            <Typography variant="h5">Cadastre um novo!</Typography>
            <Typography variant="subtitle1">Opte por cadastrar um novo estabelecimento.</Typography>
            <br />
            <Typography variant="body2" color="textSecondary">
              Ao cadastrar um novo estabelecimento, você se tornará o administrador do estabelecimento e poderá aceitar novos associados.
            </Typography>
          </CardContent>
          <CardActions className="opcoes">
            <Button variant="contained" href="/ui/cadastroestabelecimento">Cadastre um estabelecimento</Button>
          </CardActions>
        </Card>
        <Card sx={{ backgroundColor: cardBg}}>
          <CardContent>
            <Typography variant="h5">Ou associe-se com um existente!</Typography>
            <Typography variant="subtitle1">Opte por se tornar um funcionário ou sócio.</Typography>
            <br />
            <Typography variant="body2">
              Ao optar por associar-se com um estabelecimento existente, uma notificação será enviada para o
              administrador. Assim que eleo aceitar, você poderá receber novos pedidos
            </Typography>
          </CardContent>
          <CardActions className="opcoes">
            <Button variant="contained" href="/ui/cadastroestabelecimento">Associe-se com um estabelecimento</Button>
          </CardActions>
        </Card>
        <Typography variant="body2" align="center">Essas configurações poderão ser alteradas posteriormente na tela de configurações de perfil do usuário.</Typography>
      </Stack>
      </Container>
    </Box>
  );
};

export default Estabelecimento;
