import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
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
      <Row>
      {userSubscriptions.map(userSubscription => (
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
        <NotificationForm
          // @ts-ignore
          userSubscription={userSubscription}
          // @ts-ignore
          onSend={async (notificationForm: any) => {
            const { title, firstActionId, firstActionTitle, firstActionIcon, secondActionId, secondActionTitle, secondActionIcon, ...notification } = notificationForm;
            const actions = Object.assign([], firstActionTitle && firstActionId && [{ action: firstActionId, title: firstActionTitle, icon: firstActionIcon }], secondActionId && secondActionTitle && [{ action: secondActionId, title: secondActionTitle, icon: secondActionIcon }]);

            await handleTestSubscription(userSubscription.subscription, title, { actions, ...notification })
          }}
        />

          </Col>
      ))}
      </Row>
    </div>
  );
};

export default App;
