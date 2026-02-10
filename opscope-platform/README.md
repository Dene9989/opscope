# OPSCOPE Platform (Almoxarifado + SST)

Este pacote adiciona os modulos de Almoxarifado e Seguranca do Trabalho (SST) com Next.js + Prisma.

## Requisitos

- Node.js 18+
- PostgreSQL

## Variaveis de ambiente

Crie `opscope-platform/.env`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/opscope
JWT_SECRET=troque-este-segredo
JWT_EXPIRES_IN=12h
```

## Comandos

```bash
cd opscope-platform
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Acesse: `http://localhost:3000`

## Rotas principais do Almoxarifado

- /almoxarifado (dashboard)
- /almoxarifado/itens
- /almoxarifado/itens/[id]
- /almoxarifado/estoque
- /almoxarifado/movimentacoes
- /almoxarifado/epis-colaborador
- /almoxarifado/scan

## Usuarios seed

- admin@opscope.local / Opscope@123 (ADMIN)
- almox@opscope.local / Opscope@123 (ALMOXARIFE)
- sst@opscope.local / Opscope@123 (TECNICO_SST)

## Testes

```bash
npm run test
```

Obs: para testes, configure um DATABASE_URL apontando para um banco de teste.

## Estrutura

```
opscope-platform/
  prisma/
  src/
    app/
      (auth)/login
      (app)/almoxarifado
      (app)/sst
      api/
    components/
      inventory/
    lib/
  tests/
```
