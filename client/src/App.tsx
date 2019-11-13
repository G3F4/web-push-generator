import React from 'react';
import registerUserSubscription from './service-worker/registerUserSubscription';
import testUserSubscriptions from './service-worker/testUserSubscriptions';

const handleActivateNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    await registerUserSubscription(registration);
  } catch (e) {
    console.error(['handleActivateNotifications.error'], e);
  }
};
const handleTestNotifications = async () => {
  try {
    await testUserSubscriptions();
  } catch (e) {
    console.error(['handleTestNotifications.error'], e);
  }
};

const App: React.FC = () =>  (
    <div>
      Web Push Generator
      <div>
        <button onClick={handleActivateNotifications}>activate notifications</button>
      </div>
      <div>
        <button onClick={handleTestNotifications}>test notifications</button>
      </div>
    </div>
  );

export default App;
