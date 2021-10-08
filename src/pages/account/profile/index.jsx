import { Button, Form, Card, Input, Select, Modal, Spin, notification } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import lodash from 'lodash';
import styles from './style.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class BasicForm extends Component {
  state = { visible: false };

  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  formRef = React.createRef();
  formPasswordRef = React.createRef();

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetch',
      payload: {},
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.profile.current !== prevProps.profile.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const values = await this.formRef.current.validateFields(['phone', 'name']);
    const payload = Object.assign({}, values);
    delete payload.username;
    dispatch({
      type: 'profile/change',
      payload: { ...payload },
    });
  };

  validatorNewPasswordConfirm = (rule, value, callback) => {
    if (value && value !== this.formPasswordRef.current.getFieldValue('newPassword')) {
      callback('确认密码不匹配');
    }
    callback();
  };

  validatorPassword = (rule, value, callback) => {
    if (
      value &&
      (value.length < 6 ||
        value.length > 20 ||
        !/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!?.+=@#$%^&*])(?=.{8,20}$)/.test(value))
    ) {
      callback('密码长度必须是8-20位字符，包含字母和数字还有特殊字符');
    }
    callback();
  };

  handleResetPassword = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const values = await this.formPasswordRef.current.validateFields([
      'oldPassword',
      'newPassword',
      'newPasswordConfirm',
    ]);

    dispatch({
      type: 'profile/changePassword',
      payload: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      callback: () => {
        this.handleCancel();
        dispatch({
          type: 'login/logout',
        });
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      loading,
      profile: { current },
    } = this.props;

    const modalFooter = {
      okText: '保存',
      onOk: this.handleResetPassword,
      onCancel: this.handleCancel,
    };

    const { visible } = this.state;

    const getModalContent = () => (
      <Form ref={this.formPasswordRef}>
        <Form.Item
          label="旧密码"
          name="oldPassword"
          {...this.formLayout}
          rules={[
            {
              required: true,
              message: '请输入旧密码',
            },
            {
              validator: this.validatorPassword,
            },
          ]}
        >
          <Input type="password" placeholder="输入旧密码" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          {...this.formLayout}
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
            {
              validator: this.validatorPassword,
            },
          ]}
        >
          <Input type="password" placeholder="输入新密码" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="newPasswordConfirm"
          {...this.formLayout}
          rules={[
            {
              required: true,
              message: '请输确认密码',
            },
            {
              validator: this.validatorNewPasswordConfirm,
            },
            {
              validator: this.validatorPassword,
            },
          ]}
        >
          <Input type="password" placeholder="输入确认密码" />
        </Form.Item>
      </Form>
    );

    return (
      <>
        <PageHeaderWrapper>
          <Spin spinning={!!loading} size="large">
            <div className={styles.tableListOperator}>
              <Button size="large" type="primary" onClick={this.handleSubmit}>
                保存
              </Button>
              <Button size="large" type="primary" onClick={this.showModal}>
                修改密码
              </Button>
            </div>
            <Card bordered={false}>
              <Form ref={this.formRef} {...layout} initialValues={current}>
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: '用户名' }]}
                >
                  <Input disabled={true} />
                </Form.Item>
                <Form.Item label="姓名" name="name" rules={[{ required: true, message: '姓名' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="电话" name="phone" rules={[{ required: true, message: '电话' }]}>
                  <Input />
                </Form.Item>
              </Form>
            </Card>
          </Spin>
        </PageHeaderWrapper>
        <Modal
          title="修改密码"
          className={styles.standardListForm}
          width={640}
          bodyStyle={{
            padding: '28px 0 0',
          }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </>
    );
  }
}

export default connect(({ profile, loading }) => ({
  loading: loading.models.profile,
  profile,
}))(BasicForm);
