import React, { useEffect, useState } from "react";
import ReactJson from 'react-json-view'
import registerUserSubscription from './service-worker/registerUserSubscription';
import testAllSubscriptions from './testAllSubscriptions';
import testSingleSubscription from './testSingleSubscription';

const handleTestSubscription = async (subscription: Subscription) => {
  try {
    await testSingleSubscription(subscription);
  } catch (e) {
    console.error(['handleTestSubscription.error'], e);
  }
};
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
    await testAllSubscriptions();
  } catch (e) {
    console.error(['handleTestNotifications.error'], e);
  }
};
const fetchSubscriptions = async () => {
  const response = await fetch('/subscriptions');

  return await response.json();
};

export interface Subscription {
  endpoint: string;
}

const App: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    fetchSubscriptions().then(({ subscriptions }) => setSubscriptions(subscriptions));
  }, []);

  return (
    <div>
      Web Push Generator
      <div>
        <button onClick={handleActivateNotifications}>activate notifications</button>
      </div>
      <div>
        <button onClick={handleTestNotifications}>test all subscriptions</button>
      </div>
      <ul>
      {subscriptions.map(subscription => (
        <li key={subscription.endpoint}>
          <ReactJson src={subscription} collapsed />
          <button onClick={() => handleTestSubscription(subscription)}>test subscription</button>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default App;
