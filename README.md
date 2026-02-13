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

## Como o backend funciona (sincronizacao)

- O servidor Express grava tudo em arquivos JSON (sem banco).
- Todos os clientes usam o mesmo servidor, entao contas/projetos ficam sincronizados.
- Os dados ficam em `OPSCOPE_STORAGE_DIR/data` (ex.: `/var/data/opscope/data` no Render).
- Sessao usa cookie seguro em producao (HTTPS).

## Migracao do front local para o backend

1. No OPSCOPE local, va em Administracao > Gestao de Acessos.
2. Clique em "Exportar acessos" e salve o arquivo `opscope-acessos-AAAA-MM-DD.json`.
3. No OPSCOPE com backend, va em Gestao de Acessos e clique em "Importar acessos".
4. O backend mescla cargos/contas/projetos sem apagar dados existentes.

## Deploy no Render (sem banco)

1. Crie um Persistent Disk (ex.: `/var/data`).
2. Configure `OPSCOPE_STORAGE_DIR=/var/data/opscope`.
3. Configure as variaveis:
   - `NODE_ENV=production`
   - `APP_BASE_URL=https://opscope.onrender.com`
   - `SESSION_SECRET=<segredo-forte>`
   - `ADMIN_PASSWORD=<senha-admin>`
   - `MASTER_PASSWORD=<senha-master>`
4. Faça o deploy e depois importe o pacote de acessos.

## Opcional: banco de dados

- Se quiser Postgres, configure `OPSCOPE_DATABASE_URL`.

## Modulos: Almoxarifado e SST

- Almoxarifado: itens, estoque por projeto, movimentacoes, EPIs por colaborador, QR Code e termo PDF.
- SST: treinamentos, inspecoes, nao conformidades, incidentes e APR/PT.

## Dependencias extras

- `qrcode` (QR Code)
- `pdf-lib` (PDF)

## Perfis RBAC usados

- admin, gestor, almoxarife, tecnico_sst, supervisor, colaborador
