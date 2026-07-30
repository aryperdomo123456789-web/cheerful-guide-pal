# Deploy — este projeto roda 100% no aaPanel via GitHub

> **Regra do projeto:** este site é hospedado e executado **exclusivamente no VPS com aaPanel**,
> entregue por **GitHub**. Tudo que for construído na Lovable deve ser pensado para funcionar
> corretamente nesse ambiente (Node + PM2 + Nginx no aaPanel).

## Ambiente de produção

- **Servidor:** VPS com aaPanel (Ubuntu, Nginx 1.24)
- **Domínio:** https://siteteste.vr766.com (SSL Let's Encrypt, renovação automática via `certbot.timer` + deploy hook que recarrega o Nginx)
- **Diretório:** `/www/wwwroot/siteteste.vr766.com`
- **Processo:** PM2 → `siteteste-vr766`, rodando `.output/server/index.mjs`
- **Porta interna:** `127.0.0.1:4446` (Nginx faz proxy reverso)
- **Vhost:** `/etc/nginx/conf.d/siteteste.vr766.com.conf`
- **Build:** `NITRO_PRESET=node_server bun run build` (preset Node autônomo, **não** Cloudflare Workers)

## Fluxo de entrega

Lovable → GitHub (`main`) → `git pull` no aaPanel → build → restart PM2.

Comando único de deploy no servidor (alias `deploysite`):

```bash
cd /www/wwwroot/siteteste.vr766.com && \
git fetch origin main && \
git reset --hard origin/main && \
git clean -fd src && \
bun install && \
NITRO_PRESET=node_server bun run build && \
pm2 restart siteteste-vr766 --update-env && \
pm2 save
```

## Regras ao desenvolver na Lovable

1. **Compatibilidade Node/PM2 obrigatória.** Não usar APIs exclusivas de Cloudflare Workers.
   O build de produção usa `NITRO_PRESET=node_server`.
2. **Sem dependências nativas** (node-gyp, sharp, puppeteer) que quebrem o build no VPS.
3. **Variáveis de ambiente** precisam existir no `.env` do servidor; qualquer nova variável
   deve ser comunicada para ser adicionada lá antes do deploy.
4. **Assets estáticos** (imagens de produtos, favicons) devem funcionar servidos pelo Node/Nginx
   do aaPanel — preferir `public/` versionado no Git quando forem fixos.
5. **Nada de configuração específica de hospedagem Lovable** que não sobreviva ao deploy no aaPanel.
6. **`src/routeTree.gen.ts`** é regenerado no build do servidor; por isso o deploy usa
   `git reset --hard` para evitar conflito de pull.
7. **Porta 4446 é fixa.** Alterar porta exige atualizar o vhost do Nginx também.

## Backend

O banco/auth/storage continua no Lovable Cloud (Supabase gerenciado), acessado pelo app
rodando no aaPanel. Não há dependência de funções serverless da Lovable em produção.
