# 🚀 Quick Start Guide - BriBooks Backend

## Prerequisites Checklist

- ✅ Node.js >= 18.0.0 installed
- ✅ npm >= 9.0.0 installed
- ✅ Database credentials (Neon PostgreSQL)
- ✅ Gemini AI API key

## Setup Steps

### 1. Environment Setup

The `.env` file has been created with your credentials. Verify it exists:

```bash
cat ENV_SETUP.md
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Run migrations
DATABASE_URL="postgresql://neondb_owner:npg_rUWaq6wd2tmD@ep-lively-math-a46uka2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma migrate dev --schema=packages/database/prisma/schema.prisma

# Seed database with sample data
DATABASE_URL="postgresql://neondb_owner:npg_rUWaq6wd2tmD@ep-lively-math-a46uka2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx ts-node packages/database/prisma/seed.ts
```

### 4. Build Shared Packages

```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/database
```

### 5. Start Services

**Option A: Start all services at once**
```bash
npm run dev
```

**Option B: Start services individually (in separate terminals)**

Terminal 1 - API Gateway:
```bash
npm run dev:gateway
```

Terminal 2 - User Service:
```bash
npm run dev:user
```

Terminal 3 - Book Authoring Service:
```bash
npm run dev:book
```

Terminal 4 - AI Orchestrator Service:
```bash
npm run dev:ai
```

## Testing the API

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2025-11-25T..."
}
```

### 2. Login with Seed User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@bribooks.com",
    "password": "Author@123"
  }'
```

Save the `token` from the response for authenticated requests.

### 3. Create a Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First AI Story",
    "description": "A magical adventure created with AI",
    "ageGroup": "EARLY_READER",
    "tags": ["adventure", "magic", "AI"]
  }'
```

### 4. Generate Story with AI

```bash
curl -X POST http://localhost:3000/api/ai/generate-story \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "prompt": "A story about a brave little dragon who learns to fly",
    "ageGroup": "PRESCHOOL",
    "maxLength": 300
  }'
```

### 5. Check Grammar

```bash
curl -X POST http://localhost:3000/api/ai/check-grammar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "The dragon flyed over the mountian."
  }'
```

## Default Test Accounts

Created by the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bribooks.com | Admin@123 |
| Author | author@bribooks.com | Author@123 |

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| API Gateway | 3000 | http://localhost:3000 |
| User Service | 3001 | http://localhost:3001 |
| Book Authoring | 3002 | http://localhost:3002 |
| AI Orchestrator | 3003 | http://localhost:3003 |
| Safety Service | 3004 | http://localhost:3004 |
| Publishing | 3005 | http://localhost:3005 |
| Payment | 3006 | http://localhost:3006 |
| Notification | 3007 | http://localhost:3007 |
| Admin | 3008 | http://localhost:3008 |

## Useful Commands

### Database

```bash
# Open Prisma Studio (Database GUI)
DATABASE_URL="postgresql://neondb_owner:npg_rUWaq6wd2tmD@ep-lively-math-a46uka2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma studio --schema=packages/database/prisma/schema.prisma

# View database
DATABASE_URL="postgresql://neondb_owner:npg_rUWaq6wd2tmD@ep-lively-math-a46uka2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma db pull --schema=packages/database/prisma/schema.prisma
```

### Development

```bash
# Build all packages
npm run build

# Run specific service
npm run dev:user
npm run dev:book
npm run dev:ai
npm run dev:gateway
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find and kill process on port 3000 (or any other port)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

1. Verify DATABASE_URL in .env file
2. Check Neon database is accessible
3. Ensure SSL mode is set correctly

### Prisma Issues

```bash
# Regenerate Prisma Client
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Reset database (WARNING: deletes all data)
DATABASE_URL="..." npx prisma migrate reset --schema=packages/database/prisma/schema.prisma
```

## Next Steps

1. ✅ Test all API endpoints
2. ✅ Create your first book
3. ✅ Generate AI-powered content
4. ✅ Explore Prisma Studio to view data
5. ✅ Read the full API documentation in README.md

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review the implementation plan
- Check service logs for error messages

---

🎉 **You're all set! Start building amazing children's books with AI!**
