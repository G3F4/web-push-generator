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
      <Collapse>
        <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''} label="Title">
          <Tooltip title="prompt text">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input notification title.' }],
            })(
              <TextArea
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
                <TextArea
                  placeholder="Enter body"
                />,
              )}
            </Tooltip>
          </Form.Item>
        <Panel header="More" key="more">
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
              {getFieldDecorator('dir')(
                <Select defaultValue="auto" style={{ width: 120 }}>
                  <Option value="auto">auto</Option>
                  <Option value="ltr">ltr</Option>
                  <Option value="rtl">rtl</Option>
                </Select>
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
        </Panel>
        <Panel header="Actions" key="actions">
          <Form.Item label="First action title">
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionTitle')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter first action title"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item label="First action id">
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionId')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter first action id"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item label="First action icon" validateStatus={firstActionIconError ? 'error' : ''} help={firstActionIconError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('firstActionIcon', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter first action icon"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item label="Second action id">
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionId')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter second action id"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item label="Second action icon" validateStatus={secondActionIconError ? 'error' : ''} help={secondActionIconError || ''}>
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionIcon', {
                rules: [{ pattern: new RegExp('(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'), message: 'Please input valid url.' }],
              })(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter second action icon url"
                />,
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item label="Second action title">
            <Tooltip title="prompt text">
              {getFieldDecorator('secondActionTitle')(
                <Input
                  prefix={<Icon type="trademark" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter second action title"
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
