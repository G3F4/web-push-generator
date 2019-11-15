import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { readFileSync } from 'fs';
import path from 'path';
import notificationsEndpoint from './endpoints/notificationsEndpoint';

const server = fastify({
  https: {
    key: readFileSync(path.join(__dirname, 'https', 'fastify.key')),
    cert: readFileSync(path.join(__dirname, 'https', 'fastify.crt'))
  }
});

//@ts-ignore
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

notificationsEndpoint(server);

const start = async () => {
  try {
    const address = await server.listen(5555);

    console.info(`server listening on ${address}`)
  } catch (err) {
    server.log.error(err);
    process.exit(1)
  }
};

start();

export type Server = typeof server;
