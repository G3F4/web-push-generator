import urlBase64ToUint8Array from './urlBase64ToUint8Array';

const publicVapidKey = 'BI8KIaNtKU6YUHJIOhad3D4PoS99r_m05Ui0h2BmlbvG6jFFbVmWfau9YnZGyOGN37T-9ehh5gpXtz4bsWwr65U';

export default async function registerUserSubscription(
  register: ServiceWorkerRegistration,
) {
  try {
    const subscriptionData = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`/notifications/add`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });
  } catch (e) {
    throw new Error(`cannot register subscription | ${e}`);
  }
}
