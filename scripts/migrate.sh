#!/bin/bash

# Load environment variables from .env file
export $(cat .env | grep -v '^#' | xargs)

# Run Prisma migrate
npx prisma migrate dev --name init --schema=packages/database/prisma/schema.prisma
