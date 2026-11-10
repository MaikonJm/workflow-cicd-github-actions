FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies, using the lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY index.js ./

# Run as the non-root user that ships with the official image
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
