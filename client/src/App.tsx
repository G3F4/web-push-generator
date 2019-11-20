import { Avatar, Button, Col, Layout, Row, Skeleton, Typography, message } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import React, { useCallback, useEffect, useState } from 'react';
import NotificationForm from './modules/notificationForm/NotificationForm';
import registerUserSubscription from './service-worker/registerUserSubscription';
import testAllSubscriptions from './testAllSubscriptions';
import testSingleSubscription from './testSingleSubscription';

async function registerSubscription() {
  const registration = await navigator.serviceWorker.ready;

  await registerUserSubscription(registration);
}

async function fetchUserSubscriptions() {
  const response = await fetch('/subscriptions');

  return await response.json();
}

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
  const [copiedNotification, setCopiedSubscription] = useState<UserSubscription>();
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [loadingAdding, setLoadingAdding] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const handleActivateNotifications = useCallback(async () => {
    setLoadingAdding(true);

    await registerSubscription();

    const { subscriptions } = await fetchUserSubscriptions();

    setLoadingAdding(false);
    setUserSubscriptions(subscriptions);
  }, [setUserSubscriptions, setLoadingAdding]);
  const handleSubscriptionDeleted = useCallback(async () => {
    const { subscriptions } = await fetchUserSubscriptions();

    setUserSubscriptions(subscriptions);
  }, [setUserSubscriptions]);

  useEffect(() => {
    fetchUserSubscriptions().then(({ subscriptions }) => {
      setUserSubscriptions(subscriptions);
      setLoadingList(false);
    });
  }, []);

  return (
    <Layout>
      <Layout.Header style={{ padding: 0 }}>
        <Row align="middle" justify="center" type="flex">
          <Avatar shape="square" src="/favicon.ico" />
          <Typography.Title
            level={2}
            style={{
              margin: 8,
              textAlign: 'center',
              color: '#eee',
              whiteSpace: 'nowrap',
            }}
          >Web Push Generator</Typography.Title>
        </Row>
      </Layout.Header>
      <Layout.Content>
        <Row justify="center" style={{ margin: 8 }} type="flex">
          <Typography.Text
            strong
            style={{ marginBottom: 8, whiteSpace: 'nowrap', marginRight: 8, textAlign: 'center', fontSize: 18 }}
            type={{
              denied: 'danger',
              granted: 'secondary',
              default: 'warning',
            }[Notification.permission] as BaseType}
          >{`Notifications permission state: ${Notification.permission}`}</Typography.Text>
          <Button disabled={Notification.permission === 'denied'} onClick={handleActivateNotifications}>
            {{
              denied: 'Not active',
              granted: 'Resend subscription',
              default: 'Ask for permission',
            }[Notification.permission] as BaseType}
          </Button>
          {userSubscriptions.length > 0 && (
            <Button onClick={testAllSubscriptions}>Test all subscriptions</Button>
          )}
        </Row>
        <Skeleton active loading={loadingList}>
          <Row>
            {userSubscriptions.map(userSubscription => (
              <Col key={userSubscription.subscription.endpoint} lg={12} md={12} sm={24} xl={8} xs={24} xxl={6}>
                <NotificationForm
                  // @ts-ignore
                  copiedNotification={copiedNotification}
                  // @ts-ignore
                  userSubscription={userSubscription}
                  // @ts-ignore
                  onDeleted={handleSubscriptionDeleted}
                  // @ts-ignore
                  onFormDataCopy={(notificationForm: any) => {
                    message.info('Form copied!');
                    setCopiedSubscription(notificationForm);
                  }}
                  // @ts-ignore
                  onSend={async (notificationForm: any) => {
                    const { title, ...notification } = notificationForm;
                    const { send } = await testSingleSubscription(userSubscription.subscription, title, notification);

                    console.log(['testSingleSubscription.send'], send);
                  }}
                />
              </Col>
            ))}
            {loadingAdding && (
              <Col lg={12} md={12} sm={24} xl={8} xs={24} xxl={6}>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </Col>
            )}
          </Row>
        </Skeleton>
      </Layout.Content>
    </Layout>
  );
};

export default App;
