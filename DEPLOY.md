# Guia de Deploy - Portfolio Landing Page

Este guia fornece instruções detalhadas para fazer o deploy da aplicação em diferentes plataformas.

## 🚀 Deploy do Frontend (Vercel)

### 1. Preparação
```bash
cd frontend
npm run build  # Teste o build localmente
```

### 2. Deploy via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Configuração no Dashboard Vercel
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=https://sua-api.herokuapp.com/api
```

## 🔧 Deploy do Backend (Railway)

### 1. Preparação
```bash
cd backend
npm run build  # Teste o build localmente
```

### 2. Configuração Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up
```

### 3. Variáveis de Ambiente Railway
```env
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3001
JWT_SECRET=sua_chave_secreta_super_segura
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
NODE_ENV=production
```

### 4. Configuração do Banco de Dados
```bash
# Aplicar schema no banco de produção
npx prisma db push

# Gerar cliente Prisma
npx prisma generate
```

## 🗄️ Banco de Dados (Supabase)

### 1. Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização/projeto
3. Anote a URL de conexão PostgreSQL

### 2. Configurar Conexão
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### 3. Aplicar Schema
```bash
npx prisma db push
```

## 🐳 Deploy com Docker

### 1. Dockerfile Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 2. Dockerfile Frontend
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### 3. Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/portfolio
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## ☁️ Deploy Alternativo (AWS)

### 1. Frontend (S3 + CloudFront)
```bash
# Build estático
npm run build
npm run export

# Upload para S3
aws s3 sync out/ s3://seu-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 2. Backend (EC2 + PM2)
```bash
# No servidor EC2
git clone seu-repositorio
cd backend
npm install
npm run build

# Instalar PM2
npm install -g pm2

# Configurar PM2
pm2 start dist/index.js --name "portfolio-api"
pm2 startup
pm2 save
```

## 🔒 Configurações de Segurança

### 1. Variáveis de Ambiente Seguras
```bash
# Gerar JWT secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Usar diferentes secrets por ambiente
JWT_SECRET_DEV=...
JWT_SECRET_PROD=...
```

### 2. CORS Produção
```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seudominio.com'] 
    : '*',
  credentials: true
}));
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

## 📊 Monitoramento

### 1. Logs (Winston)
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. Health Check
```typescript
// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 📋 Checklist de Deploy

### Antes do Deploy
- [ ] Testes passando localmente
- [ ] Build funcionando sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Cloudinary configurado
- [ ] Domínio configurado (se aplicável)

### Após o Deploy
- [ ] Health check funcionando
- [ ] Frontend carregando corretamente
- [ ] API respondendo
- [ ] Autenticação funcionando
- [ ] Upload de imagens funcionando
- [ ] Formulário de contato funcionando
- [ ] SSL/HTTPS configurado
- [ ] Monitoramento ativo

## 🚨 Troubleshooting

### Problemas Comuns

#### Build Error no Frontend
```bash
# Limpar cache
rm -rf .next
npm run build
```

#### Erro de Conexão com Banco
```bash
# Testar conexão
npx prisma db pull
```

#### Erro de CORS
```typescript
// Verificar configuração CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### Erro de Upload de Imagem
```bash
# Verificar variáveis Cloudinary
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
```

### Logs Úteis
```bash
# Logs Railway
railway logs

# Logs Vercel
vercel logs

# Logs locais
tail -f combined.log
```

---

Este guia cobre os principais cenários de deploy. Para configurações específicas ou problemas não listados, consulte a documentação das respectivas plataformas ou abra uma issue no repositório.

