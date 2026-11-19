# Apresentação local do FRETTA

## Preparação

1. Copie o modelo de configuração da raiz para `.env`.
2. Defina `NEXT_PUBLIC_API_MODE=real`, `FRETTA_DEMO_PIX=true`, a senha do banco e um segredo aleatório para a sessão.
3. No cliente OAuth Web do Google, autorize o redirecionamento `http://localhost:3000/api/auth/callback/google`. Configure `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no arquivo local. Se o projeto OAuth estiver em teste, use as contas habilitadas nele.
4. Execute `docker compose up --build` e abra `http://localhost:3000`. A aplicação depende da conclusão das migrações.
5. Entre com as contas Google da apresentação. Para conceder acesso de administrador a uma conta já autenticada, execute no terminal:
   ```sh
   docker compose exec app npm run provision:local -- admin EMAIL_DO_ADMIN
   ```
6. Envie o cadastro do motorista, abra `/admin` na sessão administrativa e aprove após a conferência. No Início do motorista, use **Ativar acesso → Simular pagamento** para mostrar a liberação do feed.

Use sessões independentes e contas distintas para cliente e motorista. Preserve o banco e o volume de documentos. Mantenha credenciais e arquivos de identificação fora do Git.

## Roteiro

1. O cliente publica uma solicitação de frete com os pontos de retirada e entrega.
2. O motorista ajusta a área de operação, abre o frete e envia uma proposta.
3. O cliente abre a proposta, conversa e pode recusar para demonstrar uma nova oferta.
4. O cliente aceita a oferta vigente. O motorista contratado passa a ver os endereços completos.
5. O motorista inicia o transporte e o cliente conclui. Cada participante pode registrar uma avaliação.
6. Confira as notificações, recarregue e verifique os registros nas duas contas.

O modo real inclui o fluxo de autônomos, perfis e endereços salvos. A cobrança é demonstrativa. Equipes de empresas e perfil público com avaliações ficam fora do roteiro. A área do motorista fica salva por conta no navegador usado para a apresentação. O login com conta Google precisa ser ensaiado com a credencial definitiva e o Docker precisa ser validado na máquina da apresentação.


## Conferência antes da banca

- Use o mesmo endereço da configuração Google e cadastre o callback da porta escolhida. Para a porta padrão, use `http://localhost:3000/api/auth/callback/google`. Se houver usuários de teste cadastrados no Google, autorize as duas contas antes do ensaio.
- Rode `docker compose config --quiet` e `docker compose up --build`. Confira que o serviço de migração terminou sem erro. Teste o Google, o mapa e a simulação de Pix em duas sessões distintas.
- Use documentos ilustrativos e endereços de teste nas telas exibidas à banca. Após o ensaio, rode `docker compose restart app database` e confira os dados e as imagens ao voltar.
- Para executar sem Docker, use Node 22 ou superior (Node 22.12+ na linha 22), PostgreSQL local e `app/.env` preenchido a partir do modelo. Na pasta `app`, execute `npm ci`, `npm run db:migrate`, `npm run build` e `npm start`. Use a mesma porta em `BETTER_AUTH_URL` e no callback do Google.

## Backup e restauração

O roteiro abaixo transporta uma instalação Docker para outra instalação Docker da mesma versão do PostgreSQL. Para uma base criada fora do Docker, use ferramentas da mesma versão principal do servidor de origem e uma base de destino compatível. A instalação atual de desenvolvimento em PostgreSQL 18 deve ser restaurada em PostgreSQL 18 ou compatível, não diretamente na imagem 17 do Compose. Para sábado, a opção mais simples é montar os dados de ensaio no notebook da apresentação.

Faça a cópia com a aplicação parada para manter banco e arquivos sincronizados. Armazene a pasta de backup em local privado. Ela pode conter dados pessoais e credenciais de sessão. Use a cópia somente com pessoas autorizadas e mantenha-a fora do Git.

```sh
umask 077
mkdir -p backup-fretta
docker compose stop app
docker compose exec -T database pg_dump -U fretta -d fretta -Fc --no-owner --no-acl --exclude-table-data=session --exclude-table-data=verification > backup-fretta/database.dump
docker compose run --rm -T --no-deps app tar -C /app/storage -cf - . > backup-fretta/arquivos.tar
docker compose start app
```

Restaure em um projeto Compose **novo**, com volumes vazios. O nome alternativo abaixo isola o ensaio do banco existente. Faça o primeiro start da aplicação após restaurar, para aplicar migrações que venham depois da versão do backup. Transfira a configuração local do Google separadamente por um canal privado e crie um novo segredo de sessão no destino.

```sh
docker compose -p fretta-ensaio up -d --wait database
docker compose -p fretta-ensaio exec -T database pg_restore --exit-on-error --no-owner --no-acl -U fretta -d fretta < backup-fretta/database.dump
docker compose -p fretta-ensaio run --rm -T --no-deps --build app tar -C /app/storage -xf - < backup-fretta/arquivos.tar
docker compose -p fretta-ensaio up --build
```

Se a porta estiver em uso, ajuste `APP_PORT` e autorize o novo callback no Google. Entre novamente e confira a conta, um frete com fotos, a conversa e o documento de teste no painel. Os vínculos das contas Google são mantidos para o login após a restauração. A área de atuação precisa ser escolhida no navegador novo.
