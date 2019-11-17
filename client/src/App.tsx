import { Alert, Button, Col, Row, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
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
const fetchPermissionState = async () => {
  const { pushManager } = await navigator.serviceWorker.ready;

  // "denied" | "granted" | "prompt"
  return await pushManager.permissionState();
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
  const [permissionState, setPermissionState] = useState<PushPermissionState>();
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);

  useEffect(() => {
    fetchPermissionState().then(permissionState => setPermissionState(permissionState));
  }, []);

  useEffect(() => {
    fetchUserSubscriptions().then(({ subscriptions }) => setUserSubscriptions(subscriptions));
  }, []);

  return (
    <div>
      <Title>Web Push Generator</Title>
      <div style={{ display: 'flex' }}>
        <Button onClick={handleActivateNotifications}>activate notifications</Button>
        <Button onClick={handleTestNotifications}>test all subscriptions</Button>
        {permissionState ? (
          <Title
            type={{
              denied: 'danger',
              granted: 'secondary',
              prompt: 'warning',
            }[permissionState] as BaseType}
            style={{ marginLeft: 8 }}
            level={4}
          >{`Permission state: ${permissionState}`}</Title>
        ) : (
          <Alert message="Error checking permission state" type="error" showIcon />
        )}
      </div>
      <Row>
      {userSubscriptions.map(userSubscription => (
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
        <NotificationForm
          // @ts-ignore
          userSubscription={userSubscription}
          // @ts-ignore
          onSend={async (notificationForm: any) => {
            const { title, ...notification } = notificationForm;

            await handleTestSubscription(userSubscription.subscription, title, notification)
          }}
        />
          </Col>
      ))}
      </Row>
    </div>
  );
};

export default App;
