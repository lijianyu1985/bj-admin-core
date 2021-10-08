import { Button, Form, Card, Input, Select, AutoComplete, Spin, notification } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import lodash from 'lodash';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class BasicForm extends Component {
  state = {
    editing: false,
    roleId: '',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'role/resetCurrent',
    });
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      roleId: this.props.location.query.id,
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'role/get',
        payload: { modelName: 'Role', id: this.props.location.query.id },
      });
    }
    dispatch({
      type: 'role/getAllResources',
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.role.current !== prevProps.role.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { editing, roleId } = this.state;
    const values = await this.formRef.current.validateFields(['resources', 'name']);
    if (!editing) {
      dispatch({
        type: 'role/create',
        payload: { data: { ...values }, modelName: 'Role' },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    } else {
      const payload = Object.assign({}, values);
      delete payload.username;
      dispatch({
        type: 'role/change',
        payload: { data: { ...payload }, id: roleId, modelName: 'Role' },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    }
  };

  render() {
    const {
      role: { resources, current },
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
            <Form ref={this.formRef} {...layout} initialValues={current}>
              <Form.Item
                label="角色名"
                name="name"
                rules={[{ required: true, message: '角色名' }]}
              >
                <Input disabled={editing} />
              </Form.Item>
              <Form.Item
                label="资源"
                name="resources"
                rules={[{ required: true, message: '资源' }]}
              >
                <Select
                  mode="multiple"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {resources.map(resource => (
                    <Option key={resource._id} value={resource._id}>
                      {`${resource.type} - ${resource.path}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ role, loading }) => ({
  creatingRole: loading.effects['role/create'],
  changingRole: loading.effects['role/change'],
  role,
}))(BasicForm);
