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

//@ts-ignore
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

subscriptionsEndpoint(server);

const start = async () => {
  try {
    const address = await server.listen(process.env.NODE_ENV || '5555');

    console.info(`server listening on ${address}`)
  } catch (err) {
    server.log.error(err);
    process.exit(1)
  }
};

start();

export type Server = typeof server;
