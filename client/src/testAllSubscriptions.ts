export default async function testAllSubscriptions() {
  try {
    await fetch(`/subscriptions/test-all`, {
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
