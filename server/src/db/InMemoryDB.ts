import { PushSubscription } from 'web-push';

export default class InMemoryDB {
  subscriptions: PushSubscription[] = [];

  getSubscriptions() {
    return this.subscriptions;
  }

  saveSubscription(pushSubscription: PushSubscription) {
    const existingSubscription = this.subscriptions
      .find(subscription => subscription.endpoint === pushSubscription.endpoint);

    if (!existingSubscription) {
      this.subscriptions.push(pushSubscription);
    }
  }
}
