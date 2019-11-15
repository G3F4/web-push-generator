import { sendNotification } from 'web-push';
import { Server } from '../index';
import InMemoryDB from '../db/InMemoryDB';
import initWebPush from '../initWebPush';

const db = new InMemoryDB();

const testPayload = JSON.stringify({
  title: 'Web Push Generated Notification',
  notification: {
    body:
      'This notification is test.' +
      ' It will be send always after entering page if notifications were allowed on this page.',
    icon: 'https://avatars2.githubusercontent.com/u/25178950?s=200&v=4',
  },
});

initWebPush();

export default function(server: Server) {
  server.get('/subscriptions', async () => {
    const subscriptions = db.getSubscriptions();

    return { subscriptions };
  });

  server.post('/subscriptions', async request => {
    const subscriptionData = request.body;

    db.saveSubscription(subscriptionData);

    try {
      await sendNotification(subscriptionData, testPayload);

      return { send: true };
    } catch (e) {
      return { send: false };
    }
  });

  server.post('/subscriptions/test-all', async () => {
    const subscriptions = db.getSubscriptions();

    const responses = await Promise.all(subscriptions.map(async (subscription) => sendNotification(subscription, testPayload)));

    return { subscriptionsCount: responses.length };
  });

  server.post('/subscriptions/test-single', async request => {
    const subscription = request.body;

    try {
      await sendNotification(subscription, testPayload);

      return { send: true };
    } catch (e) {
      return { send: false };
    }
  });
}
