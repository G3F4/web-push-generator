import { Button, Form } from 'antd';
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
}

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

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item validateStatus={titleError ? 'error' : ''} help={titleError || ''}>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please input notification title.' }],
        })(
          <TextArea
            placeholder="Title"
          />,
        )}
      </Form.Item>
      <Form.Item validateStatus={bodyError ? 'error' : ''} help={bodyError || ''}>
        {getFieldDecorator('body', {
          rules: [{ required: true, message: 'Please input notification body.' }],
        })(
          <TextArea
            placeholder="Body"
          />,
        )}
      </Form.Item>
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
