FROM node:latest
COPY . .

RUN ./build.sh
