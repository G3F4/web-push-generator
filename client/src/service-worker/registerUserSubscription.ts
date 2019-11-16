import urlBase64ToUint8Array from './urlBase64ToUint8Array';

const publicVapidKey = 'BI8KIaNtKU6YUHJIOhad3D4PoS99r_m05Ui0h2BmlbvG6jFFbVmWfau9YnZGyOGN37T-9ehh5gpXtz4bsWwr65U';

export default async function registerUserSubscription(
  registration: ServiceWorkerRegistration,
) {
  if (registration.pushManager) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      await fetch(`/subscriptions`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (e) {
      throw new Error(`cannot register subscription | ${e}`);
    }
  } else {
    console.log('pushManager not available via web standard')
  }
}
