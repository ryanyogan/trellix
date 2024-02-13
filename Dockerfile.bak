# base node image
FROM node:18-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3 fuse3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app/
WORKDIR /app/

ADD package.json package-lock.json ./
RUN npm install

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules

ADD prisma /app/prisma

RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV LITEFS_DIR="/litefs"
ENV DATABASE_FILENAME="$LITEFS_DIR/sqlite.db"
ENV DATABASE_URL="file:$DATABASE_FILENAME"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

RUN echo '#!/bin/sh\nset -xe\nsqlite3 \$DATABASE_URL' > /usr/local/bin/database_cli && chmod +x /usr/local/bin/database_cli

RUN mkdir /app/
WORKDIR /app/

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .

COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

CMD ["litefs", "mount", "--", "npm", "start"]