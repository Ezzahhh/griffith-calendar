FROM node:lts-alpine as dependencies
WORKDIR /my-project
COPY package.json package-lock.json ./
RUN npm ci

FROM node:lts-alpine as builder
WORKDIR /my-project
COPY . .
COPY --from=dependencies /my-project/node_modules ./node_modules
RUN npm run build

FROM node:lts-alpine as runner
WORKDIR /my-project
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder --chown=nextjs:nodejs /my-project/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /my-project/public ./public
COPY --from=builder --chown=nextjs:nodejs /my-project/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /my-project/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /my-project/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]