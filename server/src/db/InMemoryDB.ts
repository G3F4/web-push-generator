import { PushSubscription } from 'web-push';

export interface UserSubscription {
  subscription: PushSubscription;
  info: {
    browser?: string;
    os?: string;
  },
}

export default class InMemoryDB {
  userSubscriptions: UserSubscription[] = [];

  getUserSubscriptions() {
    return this.userSubscriptions;
  }

  saveUserSubscription(userSubscription: UserSubscription) {
    const existingSubscription = this.userSubscriptions
      .find(subscription => subscription.subscription.endpoint === userSubscription.subscription.endpoint);

    if (!existingSubscription) {
      this.userSubscriptions.push(userSubscription);
    }
  }

  deleteUserSubscription(subscriptionEndpoint: string) {
    this.userSubscriptions = this.userSubscriptions
      .filter(subscription => subscription.subscription.endpoint !== subscriptionEndpoint);
  }
}
