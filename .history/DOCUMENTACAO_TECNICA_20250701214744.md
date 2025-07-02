# Documentação Técnica - Portfolio Landing Page

## Visão Geral da Arquitetura

Este projeto implementa uma arquitetura full-stack moderna seguindo as melhores práticas de desenvolvimento web. A aplicação é dividida em três camadas principais: frontend (Next.js), backend (Node.js/Express) e banco de dados (PostgreSQL).

### Arquitetura Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│  (Node.js/API)  │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ - React/TS      │    │ - Express       │    │ - Prisma ORM    │
│ - Tailwind CSS  │    │ - TypeScript    │    │ - Migrations    │
│ - Framer Motion │    │ - JWT Auth      │    │ - Relationships │
│ - React Query   │    │ - Cloudinary    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend - Next.js Application

### Estrutura de Diretórios

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Painel administrativo
│   │   ├── page.tsx       # Login do admin
│   │   └── dashboard/     # Dashboard de projetos
│   ├── globals.css        # Estilos globais e variáveis CSS
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── page.tsx           # Página inicial (landing page)
│   └── providers.tsx      # Providers React Query
├── components/            # Componentes React reutilizáveis
│   ├── sections/          # Seções específicas da landing page
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/                # Componentes de UI base
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       └── LoadingSpinner.tsx
├── hooks/                 # Hooks personalizados
│   └── api.ts            # Hooks React Query para API
├── lib/                   # Utilitários e configurações
│   └── api.ts            # Cliente HTTP para API
├── store/                 # Gerenciamento de estado
│   └── index.ts          # Stores Zustand
└── types/                 # Definições TypeScript
    └── index.ts          # Interfaces e tipos
```

### Tecnologias e Padrões

#### Next.js App Router
O projeto utiliza o novo App Router do Next.js 13+, que oferece:
- **Server Components**: Renderização no servidor por padrão
- **Client Components**: Marcados com 'use client' quando necessário
- **Layouts Aninhados**: Sistema de layouts hierárquico
- **Loading States**: Estados de carregamento automáticos
- **Error Boundaries**: Tratamento de erros integrado

#### Gerenciamento de Estado
- **Zustand**: Estado local (autenticação, UI)
- **React Query**: Cache e sincronização de dados do servidor
- **Local Storage**: Persistência de autenticação

#### Estilização
- **Tailwind CSS**: Framework CSS utilitário
- **CSS Variables**: Tema customizável com variáveis CSS
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Tema escuro como padrão

#### Animações
- **Framer Motion**: Animações declarativas e performáticas
- **CSS Animations**: Animações CSS para efeitos simples
- **Intersection Observer**: Animações baseadas em scroll

### Componentes Principais

#### HeroSection
```tsx
// Seção principal com animações de partículas
- Título com gradiente animado
- Botões de ação com hover effects
- Links para redes sociais
- Indicador de scroll animado
- Partículas de fundo com movimento aleatório
```

#### ProjectsSection
```tsx
// Galeria de projetos com filtros
- Grid responsivo (1-3 colunas)
- Filtros por tags dinâmicos
- Cards com hover effects
- Modal de detalhes do projeto
- Lazy loading de imagens
- Estados de loading e erro
```

#### ContactSection
```tsx
// Formulário de contato validado
- Validação em tempo real
- Estados de sucesso/erro
- Animações de feedback
- Informações de contato
- Design responsivo
```

## Backend - Node.js API
teste
### Estrutura de Diretórios

```
src/
├── routes/                # Rotas da API
│   ├── auth.ts           # Autenticação (login/register)
│   ├── projects.ts       # CRUD de projetos
│   └── contact.ts        # Formulário de contato
├── middleware/           # Middlewares Express
│   └── auth.ts          # Middleware de autenticação JWT
├── utils/               # Utilitários
│   └── cloudinary.ts    # Configuração Cloudinary
└── index.ts            # Servidor principal Express
```

### API Endpoints

#### Autenticação
```typescript
POST /api/auth/login
POST /api/auth/register

// Middleware de autenticação JWT
// Verifica token no header Authorization: Bearer <token>
```

#### Projetos
```typescript
// Endpoints públicos
GET /api/projects              # Lista projetos visíveis
GET /api/projects/:id          # Projeto específico

// Endpoints administrativos (requer auth)
GET /api/projects/admin/all    # Todos os projetos
POST /api/projects             # Criar projeto
PUT /api/projects/:id          # Atualizar projeto
DELETE /api/projects/:id       # Deletar projeto
```

#### Contato
```typescript
POST /api/contact              # Enviar mensagem
GET /api/contact               # Listar mensagens (admin)
```

### Segurança

#### Autenticação JWT
```typescript
// Geração de token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificação de token
jwt.verify(token, process.env.JWT_SECRET, callback);
```

#### Hash de Senhas
```typescript
// Hash na criação
const hashedPassword = await bcrypt.hash(password, 10);

// Verificação no login
const isValid = await bcrypt.compare(password, hashedPassword);
```

#### CORS
```typescript
// Configuração permissiva para desenvolvimento
app.use(cors({
  origin: '*',
  credentials: true
}));
```

### Upload de Imagens

#### Cloudinary Integration
```typescript
// Configuração
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload
const result = await cloudinary.uploader.upload(base64Image, {
  folder: 'portfolio/projects',
  resource_type: 'auto',
});
```

## Banco de Dados - PostgreSQL

### Schema Prisma

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  tags        String[] // Array de tags
  image       String?  // URL da imagem principal
  images      String[] // Array de URLs de imagens
  link        String?  // Link do projeto
  isVisible   Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

### Relacionamentos e Índices

```sql
-- Índices para performance
CREATE INDEX idx_projects_visible ON "Project"("isVisible");
CREATE INDEX idx_projects_featured ON "Project"("isFeatured");
CREATE INDEX idx_projects_created ON "Project"("createdAt");
CREATE INDEX idx_contacts_created ON "Contact"("createdAt");

-- Índice único para email de usuário
CREATE UNIQUE INDEX idx_users_email ON "User"("email");
```

## Fluxo de Dados

### Autenticação
```
1. Usuário faz login → POST /api/auth/login
2. Backend valida credenciais
3. Gera JWT token
4. Frontend armazena token (Zustand + localStorage)
5. Requisições subsequentes incluem token no header
6. Middleware verifica token em rotas protegidas
```

### Gerenciamento de Projetos
```
1. Admin acessa dashboard → GET /api/projects/admin/all
2. React Query faz cache dos dados
3. Interface mostra lista de projetos
4. Admin cria/edita projeto → POST/PUT /api/projects
5. Upload de imagem → Cloudinary
6. Dados salvos no PostgreSQL
7. Cache invalidado → Interface atualizada
```

### Visualização Pública
```
1. Visitante acessa landing page
2. ProjectsSection carrega → GET /api/projects
3. Apenas projetos visíveis são retornados
4. Projetos em destaque aparecem primeiro
5. Filtros aplicados no frontend
6. Lazy loading de imagens
```

## Performance e Otimizações

### Frontend
- **Code Splitting**: Componentes carregados sob demanda
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Imagens e componentes
- **Memoization**: React.memo e useMemo
- **Bundle Analysis**: Análise do tamanho do bundle

### Backend
- **Connection Pooling**: Pool de conexões PostgreSQL
- **Query Optimization**: Índices estratégicos
- **Caching**: Headers de cache HTTP
- **Compression**: Gzip compression
- **Rate Limiting**: Proteção contra spam

### Banco de Dados
- **Índices**: Campos frequentemente consultados
- **Paginação**: Limitação de resultados
- **Soft Delete**: Marcação ao invés de exclusão
- **Backup**: Estratégia de backup automático

## Monitoramento e Logs

### Logging
```typescript
// Configuração de logs estruturados
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Handling
```typescript
// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

## Testes

### Estratégia de Testes
- **Unit Tests**: Componentes e funções isoladas
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Cenários de usuário
- **API Tests**: Endpoints e validações

### Ferramentas Recomendadas
- **Jest**: Framework de testes
- **React Testing Library**: Testes de componentes
- **Cypress**: Testes end-to-end
- **Supertest**: Testes de API

## Deploy e DevOps

### Ambientes
- **Development**: Local com hot reload
- **Staging**: Ambiente de homologação
- **Production**: Ambiente de produção

### CI/CD Pipeline
```yaml
# Exemplo GitHub Actions
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

### Variáveis de Ambiente

#### Desenvolvimento
```env
# Backend
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio_dev"
JWT_SECRET="dev_secret_key"
CLOUDINARY_CLOUD_NAME="dev_cloud"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

#### Produção
```env
# Backend
DATABASE_URL="postgresql://user:pass@prod-db:5432/portfolio_prod"
JWT_SECRET="super_secure_production_key"
CLOUDINARY_CLOUD_NAME="prod_cloud"

# Frontend
NEXT_PUBLIC_API_URL="https://api.meuportfolio.com/api"
```

## Manutenção e Atualizações

### Dependências
- **Renovate/Dependabot**: Atualizações automáticas
- **Security Audits**: npm audit regular
- **Version Pinning**: Versões específicas em produção

### Backup
- **Database**: Backup diário automatizado
- **Images**: Cloudinary como backup
- **Code**: Git como versionamento

### Monitoramento
- **Uptime**: Monitoramento de disponibilidade
- **Performance**: Métricas de performance
- **Errors**: Tracking de erros em produção
- **Analytics**: Dados de uso e comportamento

---

Esta documentação técnica fornece uma visão abrangente da arquitetura e implementação do projeto Portfolio Landing Page. Para dúvidas específicas ou contribuições, consulte o README principal ou abra uma issue no repositório.

