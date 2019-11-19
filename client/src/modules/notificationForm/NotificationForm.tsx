import { Button, Card, Checkbox, Dropdown, Form, Icon, Input, Menu, Modal, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { FC, useEffect } from 'react';
import deleteSingleSubscription from '../../deleteSingleSubscription';

function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => {
    if (field === 'keys' || field === 'names') {
      return false;
    }

    return fieldsError[field];
  });
}

let id = 0;

export interface NotificationFormProps {
  userSubscription: any;

  onFormDataCopy(notification: any): void;
  onFormDataPaste(notification: any): void;
  onSend(notification: any): Promise<void>;
  onDeleted(): void;
}

interface FormValues {
  title: string;
  body: string;
  icon: string;
  badge: string;
  image: string;
  renotify: boolean;
  requireInteraction: boolean;
  silent: boolean;
  keys: any[];
  names: any[];
}

const { confirm } = Modal;
const NotificationForm: FC<FormComponentProps<FormValues> & NotificationFormProps> = (props) => {
  const { getFieldDecorator, getFieldsError, getFieldError, getFieldValue, isFieldTouched } = props.form;

  useEffect(() => {
    // To disabled submit button at the beginning.
    props.form.validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, ...rest } = values;

        props.onSend({ actions: names ? names.filter(Boolean).map((name, index) => ({ action: index, title: name })) : [], ...rest });
      }
    });
  };
  // Only show error after a field is touched.
  const titleError = isFieldTouched('title') && getFieldError('title');
  const bodyError = isFieldTouched('body') && getFieldError('body');
  const iconError = isFieldTouched('icon') && getFieldError('icon');
  const badgeError = isFieldTouched('badge') && getFieldError('badge');
  const imageError = isFieldTouched('image') && getFieldError('image');
  const remove = (k: number) => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter((key: number) => key !== k),
    });
  };
  const add = () => {
    const { form } = props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 6 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 18 },
      md: { span: 14 },
    },
  };

  getFieldDecorator('keys', { initialValue: [] });

  const keys = getFieldValue('keys');
  const formItems = keys.map((k: any, index: number) => (
    <Form.Item
      label={['First action', 'Second action', 'Third action'][index]}
      required={false}
      key={k}
    >
      {getFieldDecorator(`names[${k}]`)(<Input placeholder="Enter action title" style={{ width: '80%', marginRight: 8 }} />)}
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => remove(k)}
      />
    </Form.Item>
  ));
  const deleteSubscription = async () => {
    await deleteSingleSubscription(props.userSubscription.subscription.endpoint);
  };

  function showDeleteConfirm() {
    confirm({
      title: 'Are you sure delete this subscription?',
      content: 'You can add subscription again later.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        console.log('OK');
        await deleteSubscription();
        props.onDeleted();

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={props.onFormDataCopy}>
        Copy form data
      </Menu.Item>
      <Menu.Item onClick={props.onFormDataPaste}>
        Paste form data
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={showDeleteConfirm}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Card
        key={props.userSubscription.subscription.endpoint}
        title={`Browser: ${props.userSubscription.info.browser} | Os: ${props.userSubscription.info.os}`}
        extra={
            <div>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
                style={{ marginRight: 8 }}
              >
                Send
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="menu" />
              </Dropdown>
            </div>
        }
        hoverable
      >
        <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''} label="Title">
          <Tooltip title="Title of notification will appear at the top of Your notification.">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input notification title.' }],
            })(
              <Input
                placeholder="Enter title"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item validateStatus={bodyError ? 'error' : ''} help={bodyError || ''} label="Body">
          <Tooltip title="Notification body text. It can be long, multiline text.">
            {getFieldDecorator('body', {
              rules: [{ required: true, message: 'Please input notification body.' }],
            })(
              <Input
                placeholder="Enter body"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Icon" validateStatus={iconError ? 'error' : ''} help={iconError || ''}>
          <Tooltip title="Icon displayed in notification.">
            {getFieldDecorator('icon', {
              rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
            })(
              <Input
                prefix={<Icon type="question" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter icon url"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Badge" validateStatus={badgeError ? 'error' : ''} help={badgeError || ''}>
          <Tooltip title="Badge is icon displayed in mobile devices toolbar.">
            {getFieldDecorator('badge', {
              rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
            })(
              <Input
                prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter badge url"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Image" validateStatus={imageError ? 'error' : ''} help={imageError || ''}>
          <Tooltip title="Image displayed after notification body.">
            {getFieldDecorator('image', {
              rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
            })(
              <Input
                prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter image ulr"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Vibrate">
          <Tooltip title="Vibration pattern for the device's vibration hardware to emit when the notification fires.">
            {getFieldDecorator('vibrate')(
              <Input
                prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter vibration pattern"
              />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Renotify">
          <Tooltip title="Specifies whether the user should be notified after a new notification replaces an old one.">
            {getFieldDecorator('renotify')(
              <Checkbox />,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Require action">
          <Tooltip title="Active until the user clicks or dismisses it.">
            {getFieldDecorator('requireInteraction')(
              <Checkbox />,
            )}
          </Tooltip>
        </Form.Item>
        {formItems}
        {keys.length < 3 && (
          <Form.Item label={['First action', 'Second action', 'Third action'][keys.length]}>
            <Button type="dashed" onClick={add} style={{ width: '80%' }}>
              <Icon type="plus" /> Add action
            </Button>
          </Form.Item>
        )}
      </Card>
    </Form>
  );
};

export default Form.create({ name: 'horizontal_login' })(NotificationForm);
