# BriBooks Backend - Environment Setup

⚠️ **IMPORTANT**: Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_rUWaq6wd2tmD@ep-lively-math-a46uka2s-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Gemini AI
GEMINI_API_KEY=AIzaSyBR0M8KpXwTYd8RuDkXtHAQ5ixtiY97SHc

# JWT
JWT_SECRET=bribooks_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Service Ports
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
BOOK_AUTHORING_SERVICE_PORT=3002
AI_ORCHESTRATOR_SERVICE_PORT=3003
SAFETY_SERVICE_PORT=3004
PUBLISHING_SERVICE_PORT=3005
PAYMENT_SERVICE_PORT=3006
NOTIFICATION_SERVICE_PORT=3007
ADMIN_SERVICE_PORT=3008

# Redis (Message Queue)
REDIS_URL=redis://localhost:6379

# Email Service (SendGrid)
SENDGRID_API_KEY=
FROM_EMAIL=noreply@bribooks.com

# Stripe (Payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS S3 (Object Storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=bribooks-storage

# Environment
NODE_ENV=development
```

Copy the `.env.example` file and fill in the missing values for production deployment.
