import { Avatar, Button, Col, Divider, Layout, Row, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import React, { useCallback, useEffect, useState } from 'react';
import NotificationForm from './modules/notificationForm/NotificationForm';
import registerUserSubscription from './service-worker/registerUserSubscription';
import testAllSubscriptions from './testAllSubscriptions';
import testSingleSubscription from './testSingleSubscription';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
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
    <Layout>
      <Header style={{ padding: 0 }}>
        <Row type="flex" align="middle" justify="center">
          <Avatar shape="square" src="/favicon.ico" />
          <Title
            level={2}
            style={{
              margin: 8,
              textAlign: 'center',
              color: '#eee',
              whiteSpace: 'nowrap',
            }}
          >Web Push Generator</Title>
        </Row>
      </Header>
      <Content>
        <Row type="flex" justify="center" style={{ margin: 8 }}>
          <Text
            type={{
              denied: 'danger',
              granted: 'secondary',
              default: 'warning',
            }[Notification.permission] as BaseType}
            style={{ marginBottom: 8, marginRight: 8, textAlign: 'center', fontSize: 18 }}
            strong
          >{`Notifications permission state: ${Notification.permission}`}</Text>
          <Button onClick={handleActivateNotifications} disabled={Notification.permission === 'denied'}>
            {{
              denied: 'Not active',
              granted: 'Resend subscription',
              default: 'Ask for permission',
            }[Notification.permission] as BaseType}
          </Button>
          <Button onClick={testAllSubscriptions}>Test all subscriptions</Button>
        </Row>
        <Row>
          {userSubscriptions.map(userSubscription => (
            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={userSubscription.subscription.endpoint}>
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
      </Content>
    </Layout>
  );
};

export default App;
