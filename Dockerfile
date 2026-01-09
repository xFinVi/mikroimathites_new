# Multi-stage build for Next.js production
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Accept build arguments for NEXT_PUBLIC_* variables
ARG NEXT_PUBLIC_ADSENSE_CLIENT
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SITE_URL

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
