# Inteligencia Operacional - OPSCOPE

## Objetivo
Camada de inteligencia operacional para consolidar eventos da plataforma, detectar inconsistencias automaticamente e simular cenarios de risco para apoio de decisao.

## Arquitetura
- `src/intelligence/ingestion/*`: carrega e normaliza fontes JSON por modulo.
- `src/intelligence/normalize/*`: converte registros heterogeneos em eventos padronizados.
- `src/intelligence/rules/*`: motor de regras para apontar inconsistencias.
- `src/intelligence/scenarios/*`: simulacao de impacto operacional.
- `src/intelligence/store/*`: persistencia por escopo (fonte/projeto/filtros) em JSON local, com opcional de replica no Postgres.
- `src/intelligence/routes.js`: API REST para health, rebuild, summary, inconsistencies e simulate.

## Fluxo de processamento
1. Resolve `source` para arquivos de dados.
2. Lê JSONs e extrai registros.
3. Normaliza cada registro em evento canônico:
   - `eventId`, `eventTs`, `projectId`, `userId`, `status`, `severity`, `title`, `details`.
4. Extrai sinais operacionais (aberto/fechado, atraso, risco, evidência, causa raiz etc.).
5. Executa regras:
   - evento crítico aberto/vencido
   - contingência sem causa raiz
   - PMP sem procedimento
   - conflito de status textual
   - falha recorrente no mesmo ativo
   - cluster de risco aberto
6. Calcula resumo executivo + recomendações.
7. Publica cenários de simulação.
8. Persiste snapshot por escopo.

## Endpoints
- `GET /api/intelligence/health`
- `POST /api/intelligence/rebuild`
- `GET /api/intelligence/summary`
- `GET /api/intelligence/inconsistencies`
- `GET /api/intelligence/inconsistencies/:id`
- `POST /api/intelligence/scenarios/simulate`

## Parametros principais
- `source`: `all`, `inicio`, `manutencao`, `programacao`, `contingencias`, `pmp`, `auditoria`, `logs`, `uploads`, `sst`
- `projectId`
- `from` / `to` (`YYYY-MM-DD`)
- `filters` (JSON)
- `force=true` para rebuild imediato

## Persistencia gerada
- `data/intelligence_events.json`
- `data/intelligence_inconsistencies.json`
- `data/intelligence_scenarios.json`
- `data/intelligence_snapshots.json`

## Integracao Frontend
Home (`Inicio`) passou a exibir:
- bloco **Inteligencia e cenarios**
- KPIs de risco
- inconsistencias priorizadas
- simulacao direta por botao
- refresh manual da inteligencia

