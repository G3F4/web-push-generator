import fastify from 'fastify';
import { PushSubscription, sendNotification } from 'web-push';
import initWebPush from "./initWebPush";

initWebPush();

const server = fastify();

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t));

class InMemoryDb {
  subscriptions: PushSubscription[] = [];

  getSubscriptions() {
    return this.subscriptions;
  }

  saveSubscription(pushSubscription: PushSubscription) {
    this.subscriptions.push(pushSubscription);
  }
}

const db = new InMemoryDb();

const payload = JSON.stringify({
  title: 'Web Push Generated Notification',
  notification: {
    body:
      'This notification is test.' +
      ' It will be send always after entering page if notifications were allowed on this page.',
    icon: 'https://avatars2.githubusercontent.com/u/25178950?s=200&v=4',
  },
});

server.post('/notifications/test', async () => {
  const subscriptions = db.getSubscriptions();

  const responses = await Promise.all(subscriptions.map(async (subscription) => sendNotification(subscription, payload)));

  console.log(['responses'], responses)

  return { send: true };
});

server.post('/notifications/add', async (request) => {
  const subscriptionData = request.body;
  console.log(['subscriptionData'], subscriptionData)

  db.saveSubscription(subscriptionData);

//  await delay(1000);

  try {
    const response = await sendNotification(subscriptionData, payload);

    console.log(['sendNotification.response'], response)
    return { send: true };
  } catch (e) {
    console.log(['sendNotification.e'], e)
    return { send: false };
  }
});

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
