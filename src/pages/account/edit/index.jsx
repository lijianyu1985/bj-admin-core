import { Button, Form, Card, Input, Select, AutoComplete, Spin, notification } from 'antd';
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
  state = {
    editing: false,
    accountId: '',
  };

  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      accountId: this.props.location.query.id,
    });
    const { dispatch } = this.props;
    if (this.props.location.query.id) {
      dispatch({
        type: 'accountEdit/getAccount',
        payload: { id: this.props.location.query.id },
      });
    }
    dispatch({
      type: 'accountEdit/getAllRoles',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.accountEdit.currentAccount !== prevProps.accountEdit.currentAccount) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { editing, accountId } = this.state;
    const values = await this.formRef.current.validateFields(['username', 'roles', 'name']);
    if (!editing) {
      dispatch({
        type: 'accountEdit/create',
        payload: { ...values },
      });
    } else {
      const payload = Object.assign({}, values);
      delete payload.username;
      dispatch({
        type: 'accountEdit/change',
        payload: { ...payload, id: accountId },
      });
    }
  };

  render() {
    const {
      accountEdit: { roles, currentAccount },
    } = this.props;
    const { editing } = this.state;

    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.tableListOperator}>
            <Button size="large" type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
          </div>
          <Card bordered={false}>
            <Form ref={this.formRef} {...layout} initialValues={currentAccount}>
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '用户名' }]}
              >
                <Input disabled={editing} />
              </Form.Item>
              <Form.Item label="角色" name="roles" rules={[{ required: true, message: '角色' }]}>
                <Select mode="multiple">
                  {roles.map(role => (
                    <Option key={role._id} value={role.name}>
                      {role.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '姓名' }]}>
                <Input />
              </Form.Item>
            </Form>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ accountEdit, loading }) => ({
  accountEdit,
}))(BasicForm);
