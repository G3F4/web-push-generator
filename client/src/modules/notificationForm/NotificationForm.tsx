import { Button, Form, Icon, Input, Select, Tooltip, Collapse } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import TextArea from 'antd/lib/input/TextArea';
import React, { FC, useEffect } from 'react';

function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export interface NotificationFormProps {
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
}

const { Option } = Select;
const { Panel } = Collapse;

const NotificationForm: FC<FormComponentProps<FormValues> & NotificationFormProps> = (props) => {
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

  useEffect(() => {
    // To disabled submit button at the beginning.
    props.form.validateFields();
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.onSend(values);
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
  const firstActionIconError = isFieldTouched('firstActionIcon') && getFieldError('firstActionIcon');
  const secondActionIconError = isFieldTouched('secondActionIcon') && getFieldError('secondActionIcon');

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Collapse defaultActiveKey="1">
        <Panel header="Basic" key="1">
          <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input notification title.' }],
              })(
                <TextArea
                  placeholder="Title"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={bodyError ? 'error' : ''} help={bodyError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('body', {
                rules: [{ required: true, message: 'Please input notification body.' }],
              })(
                <TextArea
                  placeholder="Body"
                />,
              )}
            </Tooltip>
          </Form.Item>
        </Panel>
        <Panel header="More" key="2">
          <Form.Item validateStatus={iconError ? 'error' : ''} help={iconError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('icon', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="question" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Icon"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={badgeError ? 'error' : ''} help={badgeError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('badge', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Badge"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={imageError ? 'error' : ''} help={imageError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('image', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Image"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={dirError ? 'error' : ''} help={dirError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('dir')(
                <Select defaultValue="auto">
                  <Option value="auto">auto</Option>
                  <Option value="ltr">ltr</Option>
                  <Option value="rtl">rtl</Option>
                </Select>
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Tooltip title="prompt text">
              {getFieldDecorator('data')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Additional data"
                />,
              )}
            </Tooltip>
          </Form.Item>
        </Panel>
        <Panel header="Actions" key="3">
          <Form.Item>
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionId')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="First action id"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionTitle')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="First action title"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={firstActionIconError ? 'error' : ''} help={firstActionIconError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionIcon', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="First action icon"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionId')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Second action id"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item>
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionTitle')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Second action title"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item validateStatus={secondActionIconError ? 'error' : ''} help={secondActionIconError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionIcon', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Second action icon"
                />,
              )}
            </Tooltip>
          </Form.Item>
        </Panel>
      </Collapse>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
        >
          Send
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create({ name: 'horizontal_login' })(NotificationForm);
