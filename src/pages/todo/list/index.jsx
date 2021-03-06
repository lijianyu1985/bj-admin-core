/* eslint-disable react/sort-comp */
import { Button, Card, Divider, Popconfirm, Table, Col, Input, Row, Tag } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import router from 'umi/router';
import styles from './style.less';
import { Form } from '@ant-design/compatible';
import { PlusOutlined } from '@ant-design/icons';
import { clearEmptyFields } from '../../../utils/utils';

const FormItem = Form.Item;

@connect(({ todo, loading }) => ({
  todo,
  loading: loading.models.todo,
}))
class TodoList extends Component {
  state = {
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      page: 1,
    },
    prevSearchName: '',
  };

  columns = [
    {
      title: 'TODO名',
      dataIndex: 'name',
      key: 'name',
      render: text => text,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            key="edit"
            onClick={e => {
              e.preventDefault();
              this.editItem(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteItem(record)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'todo/page',
      payload: {
        size: pagination.pageSize || 10,
        page: pagination.current || 1,
        selector: '_id name',
      },
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSearch = e => {
    // eslint-disable-next-line no-unused-expressions
    e && e.preventDefault && e.preventDefault();
    const { dispatch, form } = this.props;
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState(
      {
        pagination,
        prevSearchName: form.getFieldValue('name'),
      },
      () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          dispatch({
            type: 'todo/page',
            payload: {
              size: pagination.pageSize || 10,
              page: pagination.current || 1,
              selector: '_id name',
              query: clearEmptyFields(fieldsValue),
            },
          });
        });
      },
    );
  };

  deleteItem = todo => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'todo/remove',
      // eslint-disable-next-line no-underscore-dangle
      payload: { ids: [todo._id] },
      callback: this.handleSearch,
    });
  };

  editItem = todo => {
    router.push({
      pathname: 'edit',
      query: {
        // eslint-disable-next-line no-underscore-dangle
        id: todo._id,
      },
    });
  };

  handleTableChange = pagination => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const pager = { ...this.state.pagination };
    const {
      todo: { total },
      dispatch,
      form,
    } = this.props;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    pager.total = total;
    const { prevSearchName } = this.state;
    this.setState(
      {
        pagination: pager,
      },
      () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          dispatch({
            type: 'todo/page',
            payload: {
              size: pagination.pageSize || 10,
              page: pagination.current || 1,
              selector: '_id name',
              query: clearEmptyFields(fieldsValue),
            },
          });
        });
      },
    );
  };

  componentDidUpdate() {
    const { pagination } = this.state;
    if (this.props.todo.total !== pagination.total) {
      pagination.total = this.props.todo.total;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ pagination });
    }
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="TODO名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      todo: { list },
      loading,
    } = this.props;
    const { pagination } = this.state;

    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card bordered={false}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            </Card>
            <Card
              className={styles.listCard}
              bordered={false}
              title=""
              style={{
                marginTop: 24,
              }}
              bodyStyle={{
                padding: '0 32px 40px 32px',
              }}
            >
              <Button
                type="dashed"
                style={{
                  marginTop: 24,
                  width: '100%',
                  marginBottom: 8,
                }}
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push({
                    pathname: 'edit',
                    query: {
                      id: '',
                    },
                  })
                }
                ref={component => {
                  // eslint-disable-next-line  react/no-find-dom-node
                  this.addBtn = findDOMNode(component);
                }}
              >
                添加
              </Button>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={list}
                pagination={pagination}
                rowKey={record => record.username}
                onChange={this.handleTableChange}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create()(TodoList);
