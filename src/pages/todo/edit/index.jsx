import { Button, Form, Card, Input } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './style.less';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class BasicForm extends Component {
  state = {
    editing: false,
    todoId: '',
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
      type: 'todo/resetCurrent',
    });
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      todoId: this.props.location.query.id,
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'todo/get',
        payload: { modelName: 'Todo', id: this.props.location.query.id },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.todo.current !== prevProps.todo.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { editing, todoId } = this.state;
    const values = await this.formRef.current.validateFields(['name']);
    if (!editing) {
      dispatch({
        type: 'todo/create',
        payload: { data: { ...values }, modelName: 'Todo' },
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
        type: 'todo/change',
        payload: { data: { ...payload }, id: todoId, modelName: 'Todo' },
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
      todo: { current },
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
              <Form.Item label="TODO名" name="name" rules={[{ required: true, message: 'TODO名' }]}>
                <Input />
              </Form.Item>
            </Form>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ todo, loading }) => ({
  todo,
}))(BasicForm);
