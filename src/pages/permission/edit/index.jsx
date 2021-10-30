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
    permissionId: '',
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
      type: 'permission/resetCurrent',
    });
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      permissionId: this.props.location.query.id,
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'permission/get',
        payload: { id: this.props.location.query.id },
      });
    }
    dispatch({
      type: 'permission/getAllResources',
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.permission.current !== prevProps.permission.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { editing, permissionId } = this.state;
    const values = await this.formRef.current.validateFields(['resources', 'name']);
    if (!editing) {
      dispatch({
        type: 'permission/create',
        payload: { ...values },
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
        type: 'permission/change',
        payload: { ...payload, id: permissionId },
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
      permission: { resources, current },
    } = this.props;

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
              <Form.Item label="权限名" name="name" rules={[{ required: true, message: '权限名' }]}>
                <Input  />
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
                      {`${resource.type} - ${resource.identifier}`}
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

export default connect(({ permission, loading }) => ({
  creatingPermission: loading.effects['permission/create'],
  changingPermission: loading.effects['permission/change'],
  permission,
}))(BasicForm);
