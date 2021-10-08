/* eslint-disable react/sort-comp */
import { Button, Card, Divider, Popconfirm, Table, Col, Input, Row, Tag,Select } from 'antd';
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

const types = ['API','Admin','小程序','移动Web','Web','App'];

@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
class ResourceList extends Component {
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
      title: '资源名',
      dataIndex: 'name',
      key: 'name',
      render: text => text,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      render: text => text,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: text => text,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
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
      type: 'resource/page',
      payload: {
        size: pagination.pageSize || 10,
        page: pagination.current || 1,
        modelName: 'Resource',
        selector: '_id name path type description',
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
            type: 'resource/page',
            payload: {
              size: pagination.pageSize || 10,
              page: pagination.current || 1,
              modelName: 'Resource',
              selector: '_id name path type description',
              query: clearEmptyFields(fieldsValue),
            },
          });
        });
      },
    );
  };

  deleteItem = resource => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/remove',
      // eslint-disable-next-line no-underscore-dangle
      payload: { modelName: 'Resource', ids: [resource._id] },
      callback: this.handleSearch,
    });
  };

  editItem = resource => {
    router.push({
      pathname: 'edit',
      query: {
        // eslint-disable-next-line no-underscore-dangle
        id: resource._id,
      },
    });
  };

  handleTableChange = pagination => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const pager = { ...this.state.pagination };
    const {
      resource: { total },
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
            type: 'resource/page',
            payload: {
              size: pagination.pageSize || 10,
              page: pagination.current || 1,
              modelName: 'Resource',
              selector: '_id name path type description',
              query: clearEmptyFields(fieldsValue),
            },
          });
        });
      },
    );
  };

  componentDidUpdate() {
    const { pagination } = this.state;
    if (this.props.resource.total !== pagination.total) {
      pagination.total = this.props.resource.total;
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
          <FormItem label="资源名">
            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select style={{ width: 200 }} allowClear >
                  {types.map(type => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>)}
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
      resource: { list },
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

export default Form.create()(ResourceList);
