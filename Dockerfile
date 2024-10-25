FROM denoland/deno:2.0.2

WORKDIR /app 

COPY . .

RUN deno install 
RUN deno task web:build 

CMD ["deno","task","start"]