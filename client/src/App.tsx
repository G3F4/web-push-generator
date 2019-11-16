import { Button, Typography, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view'
import NotificationForm from './modules/notificationForm/NotificationForm';
import registerUserSubscription from './service-worker/registerUserSubscription';
import testAllSubscriptions from './testAllSubscriptions';
import testSingleSubscription from './testSingleSubscription';

const { Title } = Typography;

const handleTestSubscription = async (subscription: Subscription, title: string, notification: any) => {
  try {
    await testSingleSubscription(subscription, title, notification);
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
const fetchUserSubscriptions = async () => {
  const response = await fetch('/subscriptions');

  return await response.json();
};

export interface Subscription {
  endpoint: string;
}

export interface UserSubscription {
  subscription: Subscription;
  info: {
    os?: string;
    browser?: string;
  };
}

const App: React.FC = () => {
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);

  useEffect(() => {
    fetchUserSubscriptions().then(({ subscriptions }) => setUserSubscriptions(subscriptions));
  }, []);

  return (
    <div>
      <Title>Web Push Generator</Title>
      <div>
        <Button onClick={handleActivateNotifications}>activate notifications</Button>
        <Button onClick={handleTestNotifications}>test all subscriptions</Button>
      </div>

      <ul>
      {userSubscriptions.map(userSubscription => (
        <Row key={userSubscription.subscription.endpoint}>
          <Col span={6}>
            Browser: {userSubscription.info.browser}
          </Col>
          <Col span={6}>
            Os: {userSubscription.info.os}
          </Col>
          <Col span={12}>
            <ReactJson src={userSubscription} collapsed />
          </Col>
          <Col span={24}>
            <NotificationForm
              // @ts-ignore
              onSend={async (notificationForm: any) => {
                const { title, ...notification } = notificationForm;

                await handleTestSubscription(userSubscription.subscription, title,  notification)
              }}
            />
          </Col>
        </Row>
      ))}
      </ul>
    </div>
  );
};

export default App;
