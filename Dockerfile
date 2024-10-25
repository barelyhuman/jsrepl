FROM denoland/deno:2.0.2

WORKDIR /app 

COPY . .

RUN deno install 
RUN deno cache main.ts
RUN deno task web:build 

EXPOSE 8000

CMD ["deno","task","start"]