import { Subscription } from './App';

export default async function testUserSubscriptions(subscription: Subscription, title: string, notification: any) {
  try {
    const response = await fetch(`/subscriptions/test-single`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription, title, notification }),
    });

    return await response.json();
  } catch (e) {
    throw new Error(`error testing single subscription | ${e}`);
  }
}
