FROM node:13.8.0-alpine as build
LABEL description="build container for openvalidation-language-server"
ENV PATH build/node_modules/.bin:$PATH

COPY package.json package-lock.json /build/
WORKDIR /build
RUN npm ci
COPY tsconfig* /build/
COPY src /build/src
RUN npm run build

FROM timbru31/java-node:8-alpine-jre as runtime
LABEL description="openvalidation-language-server"
COPY --from=build /build/dist /usr/share/ov-language-server/dist
COPY --from=build /build/node_modules /usr/share/ov-language-server/node_modules
CMD ["node", "/usr/share/ov-language-server/dist/start-server.js"]
