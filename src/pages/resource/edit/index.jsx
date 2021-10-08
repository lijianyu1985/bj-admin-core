import { Button, Form, Card, Input, Select, Spin, notification } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const types = ['API', 'Admin', '小程序', '移动Web', 'Web', 'App'];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class BasicForm extends Component {
  state = {
    editing: false,
    resourceId: '',
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
      type: 'resource/resetCurrent',
    });
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      resourceId: this.props.location.query.id,
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'resource/get',
        payload: { modelName: 'Resource', id: this.props.location.query.id },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.resource.current !== prevProps.resource.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { editing, resourceId } = this.state;
    const values = await this.formRef.current.validateFields([
      'path',
      'name',
      'type',
      'data',
      'description',
    ]);
    if (!editing) {
      dispatch({
        type: 'resource/create',
        payload: { data: { ...values }, modelName: 'Resource' },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    } else {
      const payload = Object.assign({}, values);
      delete payload.name;
      dispatch({
        type: 'resource/change',
        payload: { data: { ...payload }, id: resourceId, modelName: 'Resource' },
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
      resource: { resources, current },
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
                label="资源名"
                name="name"
                rules={[{ required: true, message: '资源名' }]}
              >
                <Input disabled={editing} />
              </Form.Item>
              <Form.Item label="路径" name="path" rules={[{ required: true, message: '路径' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="类型" name="type" rules={[{ required: true, message: '类型' }]}>
                <Select>
                  {types.map(type => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="备注" name="description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="扩展Data" name="data">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ resource, loading }) => ({
  creatingResource: loading.effects['resource/create'],
  changingResource: loading.effects['resource/change'],
  resource,
}))(BasicForm);
