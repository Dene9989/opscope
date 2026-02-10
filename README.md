# OPSCOPE

Sistema web para gestao operacional e manutencao.

## Rodar local

1. Instale as dependencias:
   - `npm install`
2. Copie `.env.example` para `.env` e ajuste os valores.
3. Inicie:
   - `npm start`
4. Abra:
   - `http://localhost:3000`

## Novos módulos: Almoxarifado e SST

- Almoxarifado: itens, estoque por projeto, movimentações, EPIs por colaborador, QR Code e termo de responsabilidade (PDF).
- SST: treinamentos, inspeções, não conformidades, incidentes e APR/PT.

### Dependências extras

- `qrcode` (geração de QR Code)
- `pdf-lib` (geração do termo em PDF)

### Perfis RBAC usados

- admin, gestor, almoxarife, tecnico_sst, supervisor, colaborador

## Cadastro com codigo por e-mail

- O cadastro cria a conta e envia um codigo de verificacao para o e-mail informado.
- A conta so libera login depois da confirmacao do codigo (ou do link de verificacao).
- O reenvio de codigo respeita cooldown (padrao: 60s).

## Deploy no Render (com dominio)

No service da aplicacao, configure as variaveis:

- `NODE_ENV=production`
- `APP_BASE_URL=https://SEU_DOMINIO`
- `SESSION_SECRET=<segredo-forte>`
- `DATABASE_URL` (ou `OPSCOPE_DATABASE_URL`)

Para envio de e-mail (escolha 1 opcao):

1. Resend (recomendado)
   - `RESEND_API_KEY`
   - `RESEND_FROM=OPSCOPE <noreply@SEU_DOMINIO>`

2. SMTP
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`

### DNS do dominio de e-mail

- Adicione SPF/DKIM/DMARC conforme seu provedor de e-mail (Resend ou SMTP).
- Em producao, sem provedor de e-mail configurado, o cadastro retorna erro de envio.
