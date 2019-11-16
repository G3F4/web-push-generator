import { Button, Card, Form, Icon, Input, Radio, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { FC, useEffect } from 'react';

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

  onSend(notification: any): Promise<void>;
}

interface FormValues {
  title: string;
  body: string;
  icon: string;
  badge: string;
  image: string;
  dir: string;
  firstActionId: string;
  firstActionTitle: string;
  firstActionIcon: string;
  keys: any[];
  names: any[];
}

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
  const dirError = isFieldTouched('dir') && getFieldError('dir');

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
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
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
      {getFieldDecorator(`names[${k}]`)(<Input placeholder="Enter action title" style={{ width: '90%', marginRight: 8 }} />)}
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        onClick={() => remove(k)}
      />
    </Form.Item>
  ));

  console.log(['render'], hasErrors(getFieldsError()))

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Card
        key={props.userSubscription.subscription.endpoint}
        title={`Browser: ${props.userSubscription.info.browser} | Os: ${props.userSubscription.info.os}`}
        extra={
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Send
            </Button>
        }
      >
        <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''} label="Title">
          <Tooltip title="prompt text">
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
          <Tooltip title="prompt text">
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
          <Tooltip title="prompt text">
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
          <Tooltip title="prompt text">
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
          <Tooltip title="prompt text">
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
        <Form.Item label="Direction" validateStatus={dirError ? 'error' : ''} help={dirError || ''}>
          <Tooltip title="prompt text">
            {getFieldDecorator('dir', { initialValue: 'auto' })(
              <Radio.Group>
                <Radio value="auto">Auto</Radio>
                <Radio value="ltr">Left to right</Radio>
                <Radio value="rtl">Right to left</Radio>
              </Radio.Group>,
            )}
          </Tooltip>
        </Form.Item>
        <Form.Item label="Additional data">
          <Tooltip title="prompt text">
            {getFieldDecorator('data')(
              <Input
                prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter additional data"
              />,
            )}
          </Tooltip>
        </Form.Item>
        {formItems}
        {keys.length < 3 && (
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={add} style={{ width: '90%' }}>
              <Icon type="plus" /> Add action
            </Button>
          </Form.Item>
        )}
      </Card>
    </Form>
  );
};

export default Form.create({ name: 'horizontal_login' })(NotificationForm);
