# Clínica App — SaaS para Clínica Odontológica

## Visão geral

Crie um SaaS para clínicas odontológicas com foco em uma versão enxuta, prática e vendável.

O melhor caminho é começar por uma versão enxuta: **agenda + página da clínica + agendamento online + orçamento digital + portal do paciente**. Isso já entrega valor comercial claro e permite vender antes de construir um sistema odontológico completo.

A ideia principal é criar uma plataforma onde clínicas odontológicas possam organizar sua agenda, divulgar seus serviços, receber agendamentos online, enviar orçamentos digitais e oferecer ao paciente uma área simples para acompanhar consultas, tratamentos e informações importantes.

## Objetivo do sistema

Desenvolver um SaaS odontológico moderno, responsivo e multi-tenant para clínicas pequenas, profissionais liberais e consultórios odontológicos.

O sistema deve ajudar a clínica a:

- Organizar consultas e horários.
- Ter uma página pública profissional.
- Permitir que pacientes agendem online.
- Enviar orçamentos digitais com aparência profissional.
- Oferecer um portal simples para o paciente.
- Reduzir tarefas manuais da recepção.
- Melhorar a experiência do paciente.
- Aumentar a conversão de avaliações em tratamentos pagos.

## Nome provisório

Use um nome provisório como:

- OdontoFlow
- ClinicSmile
- SorrisoPro
- DentalHub
- MeuDentista Digital

O nome pode ser alterado depois.

## Posicionamento comercial

Não vender como “mais um sistema odontológico completo”.

Vender como:

> Uma plataforma digital para clínicas odontológicas receberem agendamentos online, apresentarem seus serviços, enviarem orçamentos profissionais e oferecerem uma experiência moderna ao paciente.

Ou:

> O SaaS para clínicas odontológicas que querem organizar a agenda, reduzir trabalho manual, vender mais tratamentos e encantar pacientes.

## Escopo do MVP

O MVP deve conter apenas o essencial para validar e vender o produto.

### Funcionalidades principais

1. Agenda da clínica
2. Página pública da clínica
3. Agendamento online pelo paciente
4. Orçamento digital
5. Portal do paciente
6. Cadastro de pacientes
7. Cadastro de profissionais
8. Cadastro de serviços
9. Dashboard básico da clínica
10. Sistema de autenticação e permissões

## Perfis de usuário

### 1. Admin da clínica

Usuário responsável por configurar e gerenciar a clínica.

Permissões:

- Gerenciar dados da clínica.
- Criar profissionais.
- Criar serviços.
- Ver todos os pacientes.
- Ver todos os agendamentos.
- Criar e editar orçamentos.
- Acessar dashboard.
- Gerenciar equipe.

### 2. Profissional / Dentista

Usuário responsável pelos atendimentos.

Permissões:

- Ver sua agenda.
- Ver pacientes vinculados aos seus atendimentos.
- Ver detalhes de consultas.
- Adicionar observações básicas.
- Visualizar orçamentos relacionados.

### 3. Recepcionista

Usuário responsável pela rotina operacional.

Permissões:

- Criar e editar pacientes.
- Criar, remarcar e cancelar consultas.
- Confirmar agendamentos.
- Enviar links de agendamento e orçamento.
- Ver agenda da clínica.

### 4. Paciente

Usuário externo que acessa o portal ou links públicos.

Permissões:

- Agendar consulta online.
- Ver próximas consultas.
- Confirmar ou solicitar remarcação.
- Ver orçamentos enviados.
- Aprovar orçamento.
- Ver dados básicos do tratamento.

## Funcionalidades detalhadas

## 1. Agenda da clínica

A agenda deve ser simples e visual.

Funcionalidades:

- Visualização diária, semanal e mensal.
- Filtro por profissional.
- Filtro por status da consulta.
- Criação manual de consulta.
- Remarcação de consulta.
- Cancelamento de consulta.
- Status da consulta:
  - Agendada
  - Confirmada
  - Em atendimento
  - Finalizada
  - Cancelada
  - Não compareceu
- Exibir nome do paciente, serviço, profissional, horário e status.

Campos da consulta:

- Paciente
- Profissional
- Serviço
- Data
- Horário inicial
- Horário final
- Status
- Observações

## 2. Página pública da clínica

Cada clínica deve ter uma página pública própria.

Exemplo de URL:

```txt
/app/clinica/sorriso-premium
```

Ou:

```txt
/c/sorriso-premium
```

Estrutura da página:

- Logo da clínica
- Nome da clínica
- Descrição curta
- Foto ou banner
- Lista de serviços
- Lista de profissionais
- Endereço
- Horário de funcionamento
- Botão para agendar consulta
- Botão para WhatsApp
- Depoimentos ou avaliações, se disponível

Objetivo da página:

- Servir como mini landing page da clínica.
- Gerar confiança.
- Facilitar o agendamento.

## 3. Agendamento online

Fluxo do paciente:

1. Acessa a página pública da clínica.
2. Clica em “Agendar consulta”.
3. Escolhe o serviço.
4. Escolhe o profissional, se aplicável.
5. Escolhe data e horário disponível.
6. Informa nome, telefone e e-mail.
7. Confirma o agendamento.
8. Recebe uma tela de confirmação.

Regras:

- Não permitir dois agendamentos no mesmo horário para o mesmo profissional.
- Mostrar apenas horários disponíveis.
- Permitir que a clínica defina duração padrão por serviço.
- Permitir que a clínica configure horários de atendimento.

Campos mínimos do agendamento público:

- Nome do paciente
- Telefone
- E-mail opcional
- Serviço
- Profissional
- Data
- Horário

## 4. Orçamento digital

A clínica deve poder criar um orçamento e enviar ao paciente por link.

Exemplo de URL:

```txt
/orcamento/abc123
```

O orçamento deve ser bonito, claro e fácil de aprovar.

Campos do orçamento:

- Paciente
- Clínica
- Profissional responsável
- Título do tratamento
- Descrição
- Itens do orçamento
- Valor de cada item
- Valor total
- Condições de pagamento
- Validade do orçamento
- Status

Status do orçamento:

- Rascunho
- Enviado
- Visualizado
- Aprovado
- Recusado
- Expirado

Tela pública do orçamento:

- Nome da clínica
- Nome do paciente
- Título do tratamento
- Descrição do tratamento
- Lista de itens
- Valor total
- Formas de pagamento
- Botão “Aprovar orçamento”
- Botão “Falar com a clínica”

Objetivo:

Transformar o orçamento em uma experiência comercial mais profissional que um PDF simples.

## 5. Portal do paciente

O portal do paciente deve ser simples e mobile-first.

Tela inicial:

- Saudação com nome do paciente.
- Próxima consulta.
- Status de orçamentos.
- Tratamentos em andamento.
- Botões rápidos.

Funcionalidades:

- Ver próximas consultas.
- Ver histórico básico de consultas.
- Ver orçamentos recebidos.
- Aprovar orçamento.
- Solicitar remarcação.
- Ver orientações enviadas pela clínica.

No MVP, o portal pode ser acessado por link seguro/token, sem necessidade de login complexo.

## 6. Dashboard da clínica

O dashboard deve mostrar uma visão rápida da operação.

Cards principais:

- Consultas de hoje
- Pacientes novos no mês
- Orçamentos pendentes
- Orçamentos aprovados
- Taxa de comparecimento
- Próximos atendimentos

Seções:

- Agenda do dia
- Últimos pacientes cadastrados
- Orçamentos recentes
- Ações rápidas

Ações rápidas:

- Novo paciente
- Nova consulta
- Novo orçamento
- Novo serviço
- Novo profissional

## 7. Cadastro de pacientes

Campos:

- Nome completo
- Telefone
- E-mail
- CPF, opcional
- Data de nascimento, opcional
- Observações
- Clínica vinculada
- Data de cadastro

Abas da tela do paciente:

- Dados gerais
- Consultas
- Orçamentos
- Tratamentos básicos
- Observações

## 8. Cadastro de profissionais

Campos:

- Nome
- E-mail
- Telefone
- CRO, opcional
- Especialidade
- Foto, opcional
- Bio curta
- Horários de atendimento
- Serviços que realiza
- Status ativo/inativo

## 9. Cadastro de serviços

Campos:

- Nome do serviço
- Descrição
- Duração média
- Valor base, opcional
- Categoria
- Status ativo/inativo

Exemplos de serviços:

- Avaliação odontológica
- Limpeza
- Clareamento
- Restauração
- Ortodontia
- Implante
- Facetas
- Canal
- Extração
- Emergência odontológica

## Requisitos técnicos

## Stack obrigatória

O projeto deve ser desenvolvido com a seguinte stack:

- Next.js com App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase como banco de dados, autenticação e storage
- PostgreSQL via Supabase
- Supabase Auth para login
- Supabase Storage para documentos e arquivos
- Supabase Row Level Security, RLS, para isolamento dos dados por clínica
- GitHub para versionamento
- Vercel para deploy

Fluxo obrigatório do projeto:

1. Desenvolver localmente
2. Versionar no GitHub
3. Fazer deploy automático na Vercel
4. Conectar com Supabase via variáveis de ambiente

Variáveis de ambiente necessárias:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Regras importantes:

- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` podem ser usadas no frontend.
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser usada no frontend.
- `SUPABASE_SERVICE_ROLE_KEY` só pode ser usada em Server Actions, Route Handlers, funções server-side ou scripts internos seguros.
- Nunca commitar arquivos `.env` no GitHub.
- Criar `.env.example` com os nomes das variáveis, mas sem valores reais.
- Configurar as variáveis reais no painel da Vercel.
- Todas as tabelas sensíveis devem usar RLS no Supabase.

## Arquitetura

O sistema deve ser multi-tenant.

Toda entidade principal deve possuir `clinic_id` para separar os dados de cada clínica.

Exemplos:

- patients.clinic_id
- appointments.clinic_id
- services.clinic_id
- professionals.clinic_id
- quotes.clinic_id

O isolamento de dados entre clínicas deve ser feito em duas camadas:

1. Filtro obrigatório por `clinic_id` na aplicação.
2. Políticas de Row Level Security, RLS, no Supabase.

Nenhum usuário de uma clínica pode acessar pacientes, consultas, serviços, profissionais, orçamentos ou documentos de outra clínica.

A IA deve criar migrations/policies SQL para o Supabase sempre que possível, incluindo:

- Ativar RLS nas tabelas principais.
- Permitir acesso apenas aos membros vinculados à clínica.
- Permitir acesso público apenas às rotas com token seguro, como orçamento público e portal do paciente.
- Criar tokens públicos longos, aleatórios e não previsíveis para links de paciente e orçamento.

## Supabase

O Supabase será usado como backend principal do MVP.

Usar Supabase para:

- Banco de dados PostgreSQL
- Autenticação com Supabase Auth
- Storage de arquivos, imagens, logos e documentos
- RLS para segurança multi-tenant
- Opcionalmente Realtime para agenda, se for simples de implementar

Buckets sugeridos no Supabase Storage:

```txt
clinic-assets
patient-documents
quote-files
```

Regras de storage:

- `clinic-assets`: armazenar logo, banner e fotos públicas da clínica. Pode ter leitura pública controlada.
- `patient-documents`: armazenar documentos de pacientes. Deve ter acesso restrito por clínica.
- `quote-files`: armazenar anexos relacionados a orçamentos. Deve ter acesso restrito ou por token seguro.

## GitHub e Vercel

O código ficará no GitHub e será publicado na Vercel.

A IA deve preparar o projeto para:

- Deploy automático na Vercel a partir do repositório GitHub.
- Uso de variáveis de ambiente na Vercel.
- Separação entre ambiente local, preview e produção.
- Arquivo `.env.example`.
- Arquivo `README.md` com instruções claras para rodar o projeto.

Arquivos esperados:

```txt
.env.example
.gitignore
README.md
package.json
supabase/
  migrations/
  seed.sql
```

## Estratégia de backend

Para o MVP, não criar backend separado com NestJS, Express ou outro servidor.

Usar:

- Next.js Server Actions
- Next.js Route Handlers
- Supabase Client no frontend quando seguro
- Supabase Server Client no servidor
- Supabase Service Role apenas em rotas server-side protegidas

Backend separado só deve ser considerado no futuro, se o produto crescer muito.

## Entidades principais

Crie um schema inicial com as seguintes tabelas/modelos:

```txt
users
clinics
clinic_members
patients
professionals
services
appointments
quotes
quote_items
treatment_plans
treatment_steps
patient_portal_tokens
audit_logs
```

## Modelo conceitual dos dados

### users

- id
- name
- email
- password_hash ou provider auth
- created_at
- updated_at

### clinics

- id
- name
- slug
- document
- phone
- email
- address
- description
- logo_url
- banner_url
- whatsapp_number
- created_at
- updated_at

### clinic_members

- id
- clinic_id
- user_id
- role
- created_at

Roles:

- admin
- dentist
- receptionist

### patients

- id
- clinic_id
- name
- phone
- email
- document
- birth_date
- notes
- created_at
- updated_at

### professionals

- id
- clinic_id
- user_id opcional
- name
- email
- phone
- cro
- specialty
- bio
- photo_url
- active
- created_at
- updated_at

### services

- id
- clinic_id
- name
- description
- duration_minutes
- base_price
- category
- active
- created_at
- updated_at

### appointments

- id
- clinic_id
- patient_id
- professional_id
- service_id
- start_at
- end_at
- status
- notes
- created_at
- updated_at

### quotes

- id
- clinic_id
- patient_id
- professional_id
- title
- description
- total_amount
- payment_terms
- status
- public_token
- expires_at
- approved_at
- created_at
- updated_at

### quote_items

- id
- quote_id
- name
- description
- quantity
- unit_price
- total_price

### treatment_plans

- id
- clinic_id
- patient_id
- quote_id opcional
- title
- description
- status
- started_at
- completed_at
- created_at
- updated_at

### treatment_steps

- id
- treatment_plan_id
- title
- description
- status
- order
- completed_at

### patient_portal_tokens

- id
- clinic_id
- patient_id
- token
- expires_at
- created_at

### audit_logs

- id
- clinic_id
- user_id
- action
- entity
- entity_id
- metadata
- created_at

## Rotas principais

### Área pública

```txt
/
/c/[clinicSlug]
/c/[clinicSlug]/agendar
/agendamento/confirmado
/orcamento/[token]
/paciente/[token]
```

### Área autenticada da clínica

```txt
/app
/app/dashboard
/app/agenda
/app/pacientes
/app/pacientes/[id]
/app/profissionais
/app/servicos
/app/orcamentos
/app/orcamentos/novo
/app/orcamentos/[id]
/app/configuracoes
```

## Componentes principais

Crie componentes reutilizáveis:

```txt
ClinicPublicPage
AppointmentCalendar
AppointmentForm
OnlineBookingFlow
PatientForm
ProfessionalForm
ServiceForm
QuoteBuilder
QuotePublicView
PatientPortalHome
DashboardCards
TodayAppointments
RecentQuotes
StatusBadge
PageHeader
EmptyState
```

## Requisitos de interface

A interface deve ser:

- Moderna
- Limpa
- Profissional
- Responsiva
- Mobile-first nas telas públicas
- Fácil para recepcionistas usarem
- Visualmente confiável para pacientes

Use padrões visuais adequados para saúde:

- Espaçamento generoso
- Tipografia legível
- Cores suaves
- Botões claros
- Cards bem organizados
- Ícones simples
- Feedback visual para status

## Fluxos principais

## Fluxo 1 — Clínica configura a conta

1. Admin cria conta.
2. Cadastra dados da clínica.
3. Cadastra profissionais.
4. Cadastra serviços.
5. Define horários de atendimento.
6. Compartilha o link público da clínica.

## Fluxo 2 — Paciente agenda online

1. Paciente acessa a página pública.
2. Escolhe serviço.
3. Escolhe profissional.
4. Escolhe data e horário.
5. Informa dados básicos.
6. Confirma.
7. Clínica vê a consulta na agenda.

## Fluxo 3 — Clínica cria orçamento

1. Clínica acessa paciente.
2. Cria novo orçamento.
3. Adiciona itens.
4. Define valor e condições.
5. Gera link público.
6. Envia ao paciente.
7. Paciente aprova ou entra em contato.

## Fluxo 4 — Paciente acessa portal

1. Paciente recebe link seguro.
2. Acessa portal.
3. Vê próxima consulta.
4. Vê orçamentos.
5. Aprova orçamento.
6. Solicita remarcação, se necessário.

## Funcionalidades fora do MVP

Não desenvolver inicialmente:

- Odontograma avançado
- Prontuário clínico completo
- Integração com convênios
- Emissão fiscal
- Estoque
- App mobile nativo
- Integração com radiografia
- Assinatura digital avançada
- IA clínica
- Financeiro completo

Essas funcionalidades podem entrar depois que o MVP for validado.

## Roadmap futuro

### Versão 2

- WhatsApp automatizado
- Confirmação automática de consultas
- Lembretes automáticos
- Financeiro básico
- Relatórios de no-show
- Relatórios de conversão de orçamentos
- Reativação de pacientes inativos

### Versão 3

- Prontuário eletrônico
- Odontograma
- Documentos e anexos
- Assinatura digital de termos
- Campanhas de marketing
- Integrações com pagamento
- Multiunidades

### Versão 4

- IA para mensagens de WhatsApp
- IA para resumir histórico do paciente
- IA para sugerir follow-up comercial
- Relatórios avançados
- Marketplace de templates para clínicas

## Critérios de sucesso do MVP

O MVP deve permitir que uma clínica consiga:

- Criar sua conta.
- Configurar sua página pública.
- Cadastrar profissionais e serviços.
- Receber agendamentos online.
- Gerenciar consultas em uma agenda.
- Cadastrar pacientes.
- Criar e enviar orçamentos digitais.
- Permitir que o paciente visualize e aprove o orçamento.
- Permitir que o paciente veja suas consultas no portal.

## Prompt principal para IA/CLI

Use o prompt abaixo para pedir que uma IA desenvolva o projeto:

```markdown
Você é um arquiteto full stack especialista em SaaS, sistemas multi-tenant, UX para clínicas e desenvolvimento com Next.js.

Leia todo o arquivo `clinica-app.md` e crie o projeto descrito.

Crie um SaaS para clínicas odontológicas com foco em MVP enxuto.

A frase central do projeto é:

"O melhor caminho é começar por uma versão enxuta: agenda + página da clínica + agendamento online + orçamento digital + portal do paciente. Isso já entrega valor comercial claro e permite vender antes de construir um sistema odontológico completo."

Stack obrigatória:
- Next.js com App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL via Supabase
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security, RLS
- GitHub
- Vercel

Requisitos principais:
- Sistema multi-tenant por clinic_id
- Isolamento de dados com RLS no Supabase
- Deploy preparado para Vercel conectado ao GitHub
- Variáveis de ambiente documentadas em `.env.example`
- Área autenticada da clínica
- Página pública da clínica
- Agendamento online
- Agenda interna
- Cadastro de pacientes
- Cadastro de profissionais
- Cadastro de serviços
- Orçamento digital com link público
- Portal do paciente via token seguro
- Dashboard básico
- Interface moderna, responsiva e profissional

Entregue:
1. Estrutura de pastas do projeto
2. Schema SQL/Supabase completo ou schema compatível com Supabase
3. Rotas públicas
4. Rotas autenticadas
5. Componentes principais
6. Layout do dashboard
7. Fluxo de agendamento online
8. Fluxo de criação de orçamento
9. Portal do paciente
10. Seeds iniciais para teste
11. Migrations SQL do Supabase
12. Policies de RLS
13. Arquivo `.env.example`
14. Instruções para rodar localmente
15. Instruções para deploy na Vercel

Priorize código limpo, modular, escalável e fácil de evoluir.
Não implemente funcionalidades fora do MVP neste primeiro momento.
```

## Observação final

O produto deve começar simples, mas com base sólida para crescer.

A primeira versão deve resolver uma dor clara:

> A clínica precisa aparecer online, receber agendamentos, organizar a agenda, enviar orçamentos bonitos e dar ao paciente uma experiência digital simples.

Esse foco aumenta a chance de validar, vender e evoluir o SaaS com base em clientes reais.
