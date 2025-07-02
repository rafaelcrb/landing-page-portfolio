# Portfolio Landing Page Full-Stack

Uma aplicação web moderna e completa para portfólio pessoal, desenvolvida com Next.js, Node.js, TypeScript e PostgreSQL. Este projeto oferece uma landing page responsiva com design dark moderno, painel administrativo para gerenciamento de projetos e API REST robusta.

## ✨ Funcionalidades

### Frontend
- **Landing Page Moderna**: Design responsivo com tema dark e efeitos neon
- **Hero Section**: Animações com partículas e gradientes dinâmicos
- **Galeria de Projetos**: Grid responsivo com filtros por tags e sistema de destaque
- **Formulário de Contato**: Validação completa e feedback visual
- **Painel Administrativo**: Interface para gerenciar projetos com autenticação
- **Animações Fluidas**: Implementadas com Framer Motion
- **SEO Otimizado**: Metatags dinâmicas e estrutura semântica

### Backend
- **API REST Completa**: Endpoints para projetos, autenticação e contato
- **Autenticação JWT**: Sistema seguro para o painel administrativo
- **Upload de Imagens**: Integração com Cloudinary para armazenamento
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Validação de Dados**: Middleware de validação e tratamento de erros
- **CORS Configurado**: Suporte para requisições cross-origin

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário
- **Framer Motion**: Biblioteca de animações
- **React Query**: Gerenciamento de estado servidor
- **Zustand**: Gerenciamento de estado local
- **Lucide React**: Ícones modernos

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web minimalista
- **TypeScript**: Tipagem estática
- **Prisma**: ORM moderno para PostgreSQL
- **JWT**: Autenticação baseada em tokens
- **Cloudinary**: Serviço de upload e otimização de imagens
- **bcryptjs**: Hash de senhas
- **CORS**: Middleware para requisições cross-origin

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional
- **Prisma**: ORM com type-safety

## 📁 Estrutura do Projeto

```
landing-page-portfolio/
├── frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # App Router do Next.js
│   │   │   ├── admin/       # Painel administrativo
│   │   │   ├── globals.css  # Estilos globais
│   │   │   ├── layout.tsx   # Layout principal
│   │   │   ├── page.tsx     # Página inicial
│   │   │   └── providers.tsx # Providers React Query
│   │   ├── components/      # Componentes React
│   │   │   ├── sections/    # Seções da landing page
│   │   │   └── ui/          # Componentes de UI reutilizáveis
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── lib/             # Utilitários e configurações
│   │   ├── store/           # Gerenciamento de estado Zustand
│   │   └── types/           # Definições TypeScript
│   ├── package.json
│   └── .env.local           # Variáveis de ambiente
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middlewares
│   │   ├── utils/           # Utilitários
│   │   └── index.ts         # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma    # Schema do banco de dados
│   ├── package.json
│   └── .env                 # Variáveis de ambiente
└── README.md               # Este arquivo
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- Conta no Cloudinary (para upload de imagens)

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd landing-page-portfolio
```

### 2. Configuração do Backend

#### Instalar Dependências
```bash
cd backend
npm install
```

#### Configurar Variáveis de Ambiente
Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/portfolio_db"
PORT=3001
JWT_SECRET="sua_chave_secreta_jwt_muito_segura"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

#### Configurar Banco de Dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações (criar tabelas)
npx prisma db push

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

#### Iniciar o Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O backend estará rodando em `http://localhost:3001`

### 3. Configuração do Frontend

#### Instalar Dependências
```bash
cd frontend
npm install
```

#### Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na pasta `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 🔐 Configuração do Painel Administrativo

### Criar Usuário Administrador

Para acessar o painel administrativo, você precisa criar um usuário. Você pode fazer isso de duas formas:

#### Opção 1: Via API (Recomendado)
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "senha123",
    "name": "Administrador"
  }'
```

#### Opção 2: Via Prisma Studio
1. Abra o Prisma Studio: `npx prisma studio`
2. Navegue para a tabela `User`
3. Adicione um novo usuário com senha hasheada

### Acessar o Painel
1. Acesse `http://localhost:3000/admin`
2. Faça login com as credenciais criadas
3. Você será redirecionado para o dashboard

## 📊 Uso da API

### Endpoints Públicos

#### Listar Projetos Visíveis
```http
GET /api/projects
```

#### Obter Projeto por ID
```http
GET /api/projects/:id
```

#### Enviar Mensagem de Contato
```http
POST /api/contact
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "message": "Olá, gostaria de conversar sobre um projeto..."
}
```

### Endpoints Administrativos (Requer Autenticação)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "senha123"
}
```

#### Listar Todos os Projetos (Admin)
```http
GET /api/projects/admin/all
Authorization: Bearer <token>
```

#### Criar Projeto
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Meu Novo Projeto",
  "description": "Descrição detalhada do projeto...",
  "tags": ["react", "typescript", "tailwind"],
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...", // Base64 da imagem
  "link": "https://meu-projeto.com",
  "isVisible": true,
  "isFeatured": false
}
```

#### Atualizar Projeto
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título Atualizado",
  "isVisible": false
}
```

#### Deletar Projeto
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

## 🎨 Personalização

### Cores e Tema
As cores principais podem ser alteradas no arquivo `frontend/src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... outras variáveis */
}
```

### Informações Pessoais
Atualize as informações pessoais nos seguintes arquivos:
- `frontend/src/components/sections/HeroSection.tsx` - Nome e descrição
- `frontend/src/components/sections/ContactSection.tsx` - Informações de contato
- `frontend/src/app/layout.tsx` - Metadados SEO

### Animações
As animações podem ser customizadas nos componentes usando Framer Motion. Exemplo:

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Conteúdo animado
</motion.div>
```

## 🚀 Deploy

### Frontend (Vercel - Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL da sua API em produção
3. Deploy automático a cada push

### Backend (Render/Railway)
1. Conecte seu repositório ao serviço de deploy
2. Configure as variáveis de ambiente de produção
3. Configure o comando de build: `npm run build`
4. Configure o comando de start: `npm start`

### Banco de Dados
- **Supabase**: PostgreSQL gerenciado com interface web
- **PlanetScale**: MySQL serverless com branching
- **Railway**: PostgreSQL com deploy integrado

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm start           # Iniciar servidor de produção
npm run db:generate # Gerar cliente Prisma
npm run db:push     # Aplicar mudanças no schema
npm run db:migrate  # Executar migrações
npm run db:studio   # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev         # Servidor de desenvolvimento
npm run build       # Build para produção
npm start          # Iniciar servidor de produção
npm run lint       # Executar ESLint
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco de Dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `npx prisma db pull`

### Erro de CORS
- Verifique se o backend está configurado para aceitar requisições do frontend
- Confirme a URL da API no arquivo `.env.local`

### Problemas com Upload de Imagens
- Verifique as credenciais do Cloudinary
- Confirme se as variáveis de ambiente estão corretas
- Teste a conexão com a API do Cloudinary

### Erro de Autenticação
- Verifique se o JWT_SECRET está configurado
- Confirme se o token está sendo enviado no header Authorization
- Verifique se o usuário existe no banco de dados

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

1. Verifique a seção de [Solução de Problemas](#-solução-de-problemas)
2. Procure por issues similares no repositório
3. Abra uma nova issue com detalhes do problema

---

Desenvolvido com ❤️ por [Rafael Rodrigues](https://github.com/rafaelcrb)

