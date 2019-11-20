import { Button, Card, Checkbox, Dropdown, Form, Icon, Input, Menu, Modal, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
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

//const showPersistentNotifications = async () => {
//  const serviceWorker = await navigator.serviceWorker.ready;
//  const notifications = await serviceWorker.getNotifications();
//
//  notifications.forEach(({ title, ...options }) => {
//    //@ts-ignore
//    serviceWorker.showNotification(title, options);
//  });
//};

let id = 0;
const UrlRegex = new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?');

export interface NotificationFormProps {
  copiedNotification: any;
  userSubscription: any;

  onDeleted(): void;
  onFormDataCopy(notification: any): void;
  onSend(notification: any): Promise<void>;
}

interface FormValues {
  title: string;
  body: string;
  icon: string;
  badge: string;
  image: string;
  tag: boolean;
  vibrate: boolean;
  silent: boolean;
  renotify: boolean;
  requireInteraction: boolean;
  keys: any[];
  names: any[];
}

interface FormCheckboxProps {
  fieldId: string;
  label: string;
  hint: string;
  formUtils: WrappedFormUtils<FormValues>;
  options?: GetFieldDecoratorOptions;
}

interface FormInputProps {
  fieldId: string;
  label: string;
  hint: string;
  iconType: string;
  placeholder: string;
  formUtils: WrappedFormUtils<FormValues>;
  options?: GetFieldDecoratorOptions;
}

const FormInput = ({ formUtils, label, fieldId, placeholder, options, hint, iconType }: FormInputProps) => {
  const { isFieldTouched, getFieldError, getFieldDecorator } = formUtils;
  const error = isFieldTouched(fieldId) && getFieldError(fieldId);

  return (
    <Form.Item help={error || ''} label={label} validateStatus={error ? 'error' : ''}>
      <Tooltip title={hint}>
        {getFieldDecorator(fieldId, options)(
          <Input
            placeholder={placeholder}
            prefix={<Icon style={{ color: 'rgba(0,0,0,.25)' }} type={iconType} />}
          />,
        )}
      </Tooltip>
    </Form.Item>
  );
};
const FormCheckbox = ({ formUtils: { getFieldDecorator }, fieldId, label, hint, options }: FormCheckboxProps) => (
  <Form.Item label={label}>
    <Tooltip title={hint}>
      {getFieldDecorator(fieldId, options)(
        <Checkbox />,
      )}
    </Tooltip>
  </Form.Item>
);
const NotificationForm: FC<FormComponentProps<FormValues> & NotificationFormProps> = (props) => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldValue,
    getFieldsValue,
    setFields,
  } = props.form;

  useEffect(() => {
    // To disabled submit button at the beginning.
    props.form.validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendNotification = (event: any) => {
    event.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, ...rest } = values;

        props.onSend({
          actions: names ? names.filter(Boolean).map((name, index) => ({ action: index, title: name })) : [],
          ...rest,
        });
      }
    });
  };
  const deleteSubscription = async () => {
    await deleteSingleSubscription(props.userSubscription.subscription.endpoint);
  };
  const showDeleteConfirm = () => {
    Modal.confirm({
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
  };
  const removeAction = (actionKey: string) => {
    const { form } = props;
    const keys = form.getFieldValue('keys');

    form.setFieldsValue({
      keys: keys.filter((key: string) => key !== actionKey),
    });
  };
  const addAction = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  getFieldDecorator('keys', { initialValue: [] });

  const keys = getFieldValue('keys');
  const actionsItems = keys.map((key: string, index: number) => (
    <Form.Item
      key={key}
      label={['First action', 'Second action', 'Third action'][index]}
    >
      {getFieldDecorator(`names[${key}]`)(
        <Input
          placeholder="Enter action title"
          style={{ width: '80%', marginRight: 8 }}
        />
      )}
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => removeAction(key)}
      />
    </Form.Item>
  ));
  const menu = (
    <Menu>
      <Menu.Item onClick={() => {
        props.onFormDataCopy(getFieldsValue());
      }}>
        Copy form data
      </Menu.Item>
      <Menu.Item onClick={() => {
        setFields(Object.keys(props.copiedNotification)
          .reduce((acc, key) => ({ ...acc, [key]: { value: props.copiedNotification[key]}}), {}));
      }}>
        Paste form data
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={showDeleteConfirm}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const oses: Record<string, string> = {
    'Mac OS': 'apple',
    'Android': 'android',
    'Windows': 'windows',
  };
  const type = oses[props.userSubscription.info.os];

  return (
    <Form
      labelCol={{
        xs: { span: 8 },
        sm: { span: 6 },
        md: { span: 10 },
      }}
      wrapperCol={{
        xs: { span: 16 },
        sm: { span: 18 },
        md: { span: 14 },
      }}
      onSubmit={sendNotification}
    >
      <Card
        extra={
            <div>
              <Button
                disabled={hasErrors(getFieldsError())}
                htmlType="submit"
                style={{ marginRight: 16 }}
                type="primary"
              >
                Send
              </Button>
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="menu" />
              </Dropdown>
            </div>
        }
        key={props.userSubscription.subscription.endpoint}
        title={
          <>
            {type ? (
            <Icon style={{ fontSize: 32 }} type={type} />
          ) : props.userSubscription.info.os}
            {` ${props.userSubscription.info.browser}`}
          </>
        }
      >
        <FormInput
          fieldId="title"
          formUtils={props.form}
          hint="Title of notification will appear at the top of Your notification."
          iconType="trademark"
          label="Title"
          options={{
            initialValue: '',
            rules: [{
              required: true,
              message: 'Please input notification title.',
            }],
          }}
          placeholder="Enter title"
        />
        <FormInput
          fieldId="body"
          formUtils={props.form}
          hint="Notification body text. It can be long, multiline text."
          iconType="trademark"
          label="Body"
          options={{ initialValue: '' }}
          placeholder="Enter body"
        />
        <FormInput
          fieldId="icon"
          formUtils={props.form}
          hint="Icon displayed in notification."
          iconType="trademark"
          label="Icon"
          options={{
            initialValue: '',
            rules: [{
              pattern: UrlRegex,
              message: 'Please input valid url.',
            }],
          }}
          placeholder="Enter icon url"
        />
        <FormInput
          fieldId="badge"
          formUtils={props.form}
          hint="Badge is icon displayed in mobile devices toolbar."
          iconType="trademark"
          label="Badge"
          options={{
            initialValue: '',
            rules: [{
              pattern: UrlRegex,
              message: 'Please input valid url.',
            }],
          }}
          placeholder="Enter badge url"
        />
        <FormInput
          fieldId="image"
          formUtils={props.form}
          hint="Image displayed after notification body."
          iconType="trademark"
          label="Image"
          options={{
            initialValue: '',
            rules: [{
              pattern: UrlRegex,
              message: 'Please input valid url.',
            }],
          }}
          placeholder="Enter image url"
        />
        <FormInput
          fieldId="vibrate"
          formUtils={props.form}
          hint="Vibration pattern for the device's vibration hardware to emit when the notification fires."
          iconType="trademark"
          label="Vibrations"
          options={{ initialValue: '' }}
          placeholder="Enter vibration pattern, i.e.: 100, 20, 50, 20, 60"
        />
        <FormInput
          fieldId="tag"
          formUtils={props.form}
          hint="Tag for the notification."
          iconType="trademark"
          label="Tag"
          options={{ initialValue: '' }}
          placeholder="Enter tag"
        />
        <FormCheckbox
          fieldId="renotify"
          formUtils={props.form}
          hint="Specifies whether the user should be notified after a new notification replaces an old one."
          label="Renotify"
          options={{ initialValue: false }}
        />
        <FormCheckbox
          fieldId="silent"
          formUtils={props.form}
          hint="Specifies whether the notification should be silent, i.e., no sounds or vibrations should be issued, regardless of the device settings."
          label="Silent"
          options={{ initialValue: false }}
        />
        <FormCheckbox
          fieldId="requireInteraction"
          formUtils={props.form}
          hint="Active until the user clicks or dismisses it."
          label="Require action"
          options={{ initialValue: false }}
        />
        {actionsItems}
        {keys.length < 3 && (
          <Form.Item label={['First action', 'Second action', 'Third action'][keys.length]}>
            <Button style={{ width: '80%' }} type="dashed" onClick={addAction}>
              <Icon type="plus" /> Add action
            </Button>
          </Form.Item>
        )}
      </Card>
    </Form>
  );
};

export default Form.create({ name: 'horizontal_login' })(NotificationForm);
