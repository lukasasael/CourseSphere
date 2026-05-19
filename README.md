# CourseSphere

CourseSphere é uma aplicação web full-stack para gerenciamento de cursos, aulas e **planos de aula com assistência de IA (Smart Assist)**. Construída com **Node.js/Express** (API) no backend e **React** (Vite + Tailwind CSS) no frontend.

O sistema permite:
- Criação e gerenciamento de cursos e lições
- CRUD completo de **Planos de Aula** com filtros avançados, busca e paginação
- **Smart Assist**: Geração de recomendações de conteúdo, recursos e tags via IA (Google Gemini)
- Autenticação JWT com controle de acesso
- Logs estruturados e observabilidade

---

## 🚀 Quick Start com Docker

```bash
docker compose up --build
```

- **Backend (API):** http://localhost:3000
- **Frontend:** http://localhost:5173
- **Health Check:** http://localhost:3000/health

---

## 💻 Rodando Localmente (Sem Docker)

### Backend

```bash
cd backend
cp .env.example .env   # Configure sua GEMINI_API_KEY aqui
npm install
node server.js --seed  # Cria banco + dados de teste
node server.js         # Inicia o servidor
```

A API estará rodando em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.

---

## 🔑 Credenciais de Teste

| Usuário | Senha |
| --- | --- |
| `instrutor@example.com` | `password` |
| `instrutor2@example.com` | `password` |
| `estudante@email.com` | `password` |

---

## 🛠️ Stack Tecnológica

- **Backend**: Node.js, Express, Sequelize, SQLite, JWT, Google Gemini API
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router
- **Infraestrutura**: Docker Compose, GitHub Actions (CI/Linting)

---

## 🤖 Smart Assist (IA)

O recurso de **Smart Assist** utiliza a API do Google Gemini para sugerir automaticamente:
- **Conteúdos complementares** para a aula
- **Recursos de apoio** (livros, links, materiais)
- **3 tags** relevantes

### Como usar:
1. No formulário de "Novo Plano de Aula", preencha: **Título**, **Disciplina** e **Ementa/Resumo**.
2. Clique no botão **"Gerar Recomendações com IA"**.
3. Os campos de Conteúdos, Recursos e Tags serão preenchidos automaticamente.

### Configuração da API Key:
```bash
# No arquivo backend/.env
GEMINI_API_KEY=sua_chave_aqui
```

---

## 📊 Observabilidade

O backend possui logs estruturados para todas as operações principais:

```
[INFO] AI Request, Title="Introdução ao OSPF", Discipline="Redes", TokenUsage=180, Latency="1.4s"
[INFO] POST /lesson-plans, status=201, duration="45ms"
```

Endpoint de health check: `GET /health`

---

## 📁 Estrutura do Projeto

```
CourseSphere/
├── backend/               # API Node.js/Express
│   ├── src/
│   │   ├── config/        # Database config & seeds
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/        # Sequelize models (User, Course, Lesson, LessonPlan)
│   │   ├── routes/        # Express routes
│   │   ├── services/      # AI service (Gemini integration)
│   │   └── utils/         # Structured logger
│   ├── server.js          # Entry point
│   └── Dockerfile
├── frontend/              # React SPA
│   ├── src/
│   │   ├── components/    # Layout, Navbar, Spinner, ProtectedRoute
│   │   ├── context/       # AuthContext (JWT)
│   │   ├── pages/         # All page components
│   │   └── utils/         # API client
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/     # CI (lint pipeline)
```

---

## 🎁 Diferenciais & Itens Bônus Implementados

Para elevar a qualidade técnica e de entrega do projeto, foram implementados os seguintes bônus:

1. **Dockerização Completa**: O projeto possui suporte para subida imediata em contêineres de forma integrada (`docker-compose.yml`), isolando o banco de dados (SQLite local em volume/arquivo), a API Node.js e a aplicação frontend em React.
2. **Logs Estruturados**: O backend utiliza um logger customizado que gera mensagens estruturadas com timestamps e metadados contextuais (por exemplo, token usage e latência de respostas do Gemini API).
3. **Endpoint de Health Check**: Endpoint `/health` disponível no backend para monitoramento e validação de uptime.
4. **Integração Contínua (CI)**: Pipeline configurado via GitHub Actions (`lint.yml`) que valida a conformidade de linting em toda base de código (JS e React) a cada push ou pull request na branch principal.

