# CourseSphere

CourseSphere é uma aplicação web full-stack para gerenciamento de cursos e aulas, construída com Ruby on Rails (API) no backend e React (Vite + Tailwind CSS) no frontend. O sistema permite a criação de cursos, gerenciamento de aulas e possui um sistema robusto de controle de acesso (RBAC), além de integração externa para buscar detalhes de instrutores convidados.

## 🚀 Deploy

A aplicação está disponível online. Acesse os links abaixo:

- **Frontend:** [https://course-sphere-iota.vercel.app/](https://course-sphere-iota.vercel.app/)
- **Backend (API):** [https://coursesphere-api-gqko.onrender.com](https://coursesphere-api-gqko.onrender.com)

### Instruções de Login (Deploy e Local)

Para testar a aplicação, utilize as seguintes credenciais de teste:

| Usuário | Senha |
| --- | --- |
| `estudante@email.com` | `password` |
| `instrutor@example.com` | `password` |
| `instrutor2@example.com` | `password` |

Você também pode criar seus próprios usuários acessando a área de cadastro.

---

## 🐳 Rodando com Docker (Recomendado)

A maneira mais simples de inicializar o projeto localmente é utilizando o Docker e Docker Compose.

1. Clone o repositório.
2. Na raiz do projeto, execute o comando para construir e subir os containers:
   ```bash
   docker compose up --build
   ```
3. O backend estará disponível em `http://localhost:3000`.
4. O frontend estará disponível em `http://localhost:5173`.
5. Em um novo terminal, rode as migrations para configurar o banco de dados (o seed também pode ser rodado para popular os dados):
   ```bash
   docker compose run --rm backend rails db:migrate db:seed
   ```

---

## 💻 Rodando Localmente (Sem Docker)

Caso prefira configurar o ambiente localmente sem Docker, siga as instruções abaixo.

### Passo a passo para rodar o Backend

**Pré-requisitos:** Ruby, Bundler e PostgreSQL instalados.

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   bundle install
   ```
3. Configure o banco de dados (certifique-se de que o serviço do PostgreSQL está rodando):
   ```bash
   rails db:create db:migrate db:seed
   ```
4. Inicie o servidor:
   ```bash
   rails server
   ```
   A API estará rodando em `http://localhost:3000`.

### Passo a passo para rodar o Frontend

**Pré-requisitos:** Node.js e npm instalados.

1. Em um novo terminal, navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará acessível em `http://localhost:5173`.

---

## 🛠️ Stack Tecnológica

- **Backend**: Ruby on Rails 8, PostgreSQL, JWT (Authentication)
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router
- **Infraestrutura**: Docker Compose, Vercel (Deploy Frontend), Render (Deploy Backend)
