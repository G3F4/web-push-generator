export default async function deleteSingleSubscription(subscriptionEndpoint: string) {
  try {
    await fetch(`/subscriptions/delete-single`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionEndpoint }),
    });
  } catch (e) {
    throw new Error(`error deleting single subscription | ${e}`);
  }
}
