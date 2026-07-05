# 🦷 Clinica.app

**SaaS para clínicas odontológicas** — Plataforma completa de gestão com
agenda inteligente, agendamento online, orçamento digital e portal do paciente.

Construído com [Next.js](https://nextjs.org) 16, React 19, TypeScript,
[Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com)
e [Supabase](https://supabase.com).

---

## Stack

| Camada           | Tecnologia                                               |
| ---------------- | -------------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                                  |
| Linguagem        | TypeScript 5                                             |
| Estilização      | Tailwind CSS v4 + `tw-animate-css`                       |
| Componentes      | shadcn/ui (Base UI + Radix primitives)                   |
| Ícones           | Lucide React                                             |
| Backend / BaaS   | Supabase (PostgreSQL, Auth, Storage, RLS)                |
| ORM / DB Client  | Supabase JS Client + SQL puro nas migrations             |
| Autenticação     | Supabase Auth + `@supabase/ssr`                          |
| Deploy           | Vercel                                                   |
| Controle versão  | GitHub                                                   |

---

## Funcionalidades (MVP)

- **Agenda inteligente** — Visualização diária, semanal e mensal com filtros
  por profissional e status da consulta.
- **Página pública da clínica** — Site profissional com serviços, profissionais
  e agendamento online integrado.
- **Agendamento online** — Pacientes agendam 24h por dia; apenas horários
  disponíveis são exibidos em tempo real.
- **Orçamento digital** — Criação de orçamentos com itens, envio por link e
  aprovação online com um clique.
- **Portal do paciente** — Acesso seguro a consultas, orçamentos e plano de
  tratamento.
- **Multi-tenancy** — Isolamento completo entre clínicas via Row Level Security
  do Supabase.
- **Controle de acesso** — Três níveis de permissão: admin, dentista e
  recepcionista.

---

## Pré-requisitos

- **Node.js** >= 18 (recomendado 20 LTS)
- **npm** (ou pnpm / yarn)
- **Conta no Supabase** (gratuita em [supabase.com](https://supabase.com))
- **Conta no GitHub**
- **Conta na Vercel** (gratuita em [vercel.com](https://vercel.com))

---

## Getting Started

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/clinica.app.git
cd clinica.app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com as credenciais do seu projeto Supabase:

| Variável                       | Onde encontrar no Supabase                    |
| ------------------------------ | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`     | Settings > API > Project URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Settings > API > anon public                  |
| `SUPABASE_SERVICE_ROLE_KEY`    | Settings > API > service_role (use com cuidado)|
| `NEXT_PUBLIC_APP_URL`          | `http://localhost:3000` (dev)                 |

> **⚠️ Importante:** `SUPABASE_SERVICE_ROLE_KEY` possui permissão total sobre
> o banco de dados. Nunca a exponha no navegador. Use-a apenas em Server Actions,
> Route Handlers ou scripts de migração.

### 4. Execute as migrations do Supabase

Com o [Supabase CLI](https://supabase.com/docs/guides/cli) instalado:

```bash
supabase start          # inicia o ambiente local
supabase migration up   # aplica as migrations
supabase db seed        # (opcional) dados de exemplo
```

> Caso não use o Supabase CLI local, execute o conteúdo de
> `supabase/migrations/00001_initial_schema.sql` diretamente no SQL Editor do
> dashboard do Supabase.

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Estrutura do projeto

```
clinica.app/
├── src/
│   ├── app/                    # App Router (páginas e layouts)
│   │   ├── c/[slug]/           #   Página pública da clínica
│   │   │   └── agendar/        #   Agendamento online
│   │   ├── orcamento/[token]/  #   Página pública de orçamento
│   │   ├── paciente/[token]/   #   Portal do paciente
│   │   ├── globals.css         #   Estilos globais (Tailwind)
│   │   ├── layout.tsx          #   Root layout
│   │   └── page.tsx            #   Landing page
│   ├── components/
│   │   ├── shared/             #   Componentes reutilizáveis
│   │   └── ui/                 #   Componentes shadcn/ui
│   ├── hooks/                  #   React hooks customizados
│   └── lib/
│       ├── db/
│       │   └── schema.ts       #   TypeScript definitions do banco
│       ├── supabase/
│       │   ├── client.ts       #   Cliente Supabase (browser)
│       │   ├── server.ts       #   Cliente Supabase (servidor)
│       │   └── middleware.ts   #   Middleware de autenticação
│       ├── auth.ts             #   Funções de autenticação
│       ├── constants.ts        #   Constantes da aplicação
│       ├── permissions.ts      #   Sistema de permissões RBAC
│       └── utils.ts            #   Utilitários (cn, etc.)
├── supabase/
│   ├── migrations/             #   Migrations SQL
│   └── seed.sql                #   Dados de exemplo
├── public/                     #   Assets estáticos
├── .env.example                #   Template de variáveis de ambiente
├── next.config.ts              #   Configuração do Next.js
├── tsconfig.json               #   Configuração do TypeScript
└── package.json                #   Dependências e scripts
```

---

## Scripts disponíveis

| Comando            | Descrição                                  |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Inicia o servidor de desenvolvimento       |
| `npm run build`    | Compila o projeto para produção            |
| `npm run start`    | Inicia o servidor de produção              |
| `npm run lint`     | Executa o linter (ESLint)                  |

---

## Deploy (Vercel + GitHub)

### 1. Push para o GitHub

```bash
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/seu-usuario/clinica.app.git
git push -u origin main
```

### 2. Importe o projeto na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta do GitHub
3. Selecione o repositório `clinica.app`
4. O framework **Next.js** será detectado automaticamente
5. Clique em **Deploy**

### 3. Configure as variáveis de ambiente na Vercel

No dashboard do projeto na Vercel, vá em **Settings > Environment Variables**
e adicione:

| Nome                            | Valor                                            |
| ------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do seu projeto Supabase (produção)           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase (produção)             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Chave service_role do Supabase (produção)        |
| `NEXT_PUBLIC_APP_URL`           | `https://clinica.app` (ou sua URL personalizada) |

> **⚠️ Segurança:** No Vercel, as variáveis de ambiente são criptografadas e
> não ficam expostas no cliente. A Vercel automaticamente expõe para o
> navegador apenas as variáveis prefixadas com `NEXT_PUBLIC_`.

### 4. Próximos deploys

A cada push para a branch `main` (ou para branches de preview), a Vercel
automaticamente executa uma nova build e faz o deploy.

---

## Licença

Este é um projeto privado. Todos os direitos reservados.
