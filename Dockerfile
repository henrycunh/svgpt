FROM oven/bun:alpine

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY src ./

EXPOSE 8000

CMD ["bun", "run", "index.ts"]⏎    