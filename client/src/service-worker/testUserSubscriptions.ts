export default async function testUserSubscriptions() {
  try {
    await fetch(`/notifications/test`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  } catch (e) {
    throw new Error(`cannot test subscriptions | ${e}`);
  }
}
