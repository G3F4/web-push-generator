import { Button, Col, Row, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import React, { useCallback, useEffect, useState } from 'react';
import NotificationForm from './modules/notificationForm/NotificationForm';
import registerUserSubscription from './service-worker/registerUserSubscription';
import testAllSubscriptions from './testAllSubscriptions';
import testSingleSubscription from './testSingleSubscription';

const { Title } = Typography;
const registerSubscription = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    await registerUserSubscription(registration);
  } catch (e) {
    console.error(['registerSubscription.error'], e);
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
  const handleActivateNotifications = useCallback(async () => {
    await registerSubscription();

    const { subscriptions } = await fetchUserSubscriptions();

    setUserSubscriptions(subscriptions);
  }, [setUserSubscriptions]);
  const handleSubscriptionDeleted = useCallback(async () => {
    const { subscriptions } = await fetchUserSubscriptions();

    setUserSubscriptions(subscriptions);
  }, [setUserSubscriptions]);

  useEffect(() => {
    fetchUserSubscriptions().then(({ subscriptions }) => setUserSubscriptions(subscriptions));
  }, []);

  return (
    <div>
      <Title>Web Push Generator</Title>
      <div style={{ display: 'flex' }}>
        <Button onClick={handleActivateNotifications}>activate notifications</Button>
        <Button onClick={testAllSubscriptions}>test all subscriptions</Button>
        {Notification.permission && (
          <Title
            type={{
              denied: 'danger',
              granted: 'secondary',
              default: 'warning',
            }[Notification.permission] as BaseType}
            style={{ marginLeft: 8 }}
            level={4}
          >{`Permission state: ${Notification.permission}`}</Title>
        )}
      </div>
      <Row>
      {userSubscriptions.map(userSubscription => (
        <Col xs={24} sm={24} md={12} lg={12} xl={8} key={userSubscription.subscription.endpoint}>
        <NotificationForm
          // @ts-ignore
          userSubscription={userSubscription}
          // @ts-ignore
          onDeleted={handleSubscriptionDeleted}
          // @ts-ignore
          onSend={async (notificationForm: any) => {
            const { title, ...notification } = notificationForm;

            await testSingleSubscription(userSubscription.subscription, title, notification)
          }}
        />
          </Col>
      ))}
      </Row>
    </div>
  );
};

export default App;
