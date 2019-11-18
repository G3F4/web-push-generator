import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import subscriptionsEndpoint from './endpoints/subscriptionsEndpoint';

// localhost only
//import { readFileSync } from 'fs';
//const server = fastify({
//  https: {
//    key: readFileSync(path.join(__dirname, 'https', 'fastify.key')),
//    cert: readFileSync(path.join(__dirname, 'https', 'fastify.crt'))
//  }
//});

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

subscriptionsEndpoint(server);

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5555;
    const address = await server.listen(port, '0.0.0.0');

    console.info(`server listening on ${address}`)
  } catch (err) {
    server.log.error(err);
    process.exit(1)
  }
};

start();

export type Server = typeof server;
