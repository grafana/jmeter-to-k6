FROM node:11-alpine

RUN mkdir -p /home/node/jmeter-to-k6/node_modules && chown -R node:node /home/node/jmeter-to-k6
WORKDIR /home/node/jmeter-to-k6
COPY package*.json ./
USER node
COPY --chown=node:node . .
RUN npm install --production

ENTRYPOINT ["node", "bin/jmeter-to-k6.js"]
