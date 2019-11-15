import { Subscription } from './App';

export default async function testUserSubscriptions(subscription: Subscription) {
  try {
    await fetch(`/subscriptions/test-single`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  } catch (e) {
    throw new Error(`error testing single subscription | ${e}`);
  }
}
