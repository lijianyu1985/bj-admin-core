/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import {
  Descriptions,
  Card,
  Divider,
  List,
  Avatar,
  Timeline,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './index.less';
import { toDisplayTimestamp, jsonConvertToFlatten } from '../../../utils/utils';
import { orderStatusMap } from '../../../utils/const';

const toSubdivideString = sku => {
  const subdivide = [];
  if (sku) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < sku.subdivide.length; i++) {
      subdivide.push(sku.subdivide[i].value);
    }
  }
  return subdivide.join(', ');
};

const cancelableStatus = [orderStatusMap.Created, orderStatusMap.Paid];
const shippingableStatus = [orderStatusMap.Paid];
const refundableStatus = [orderStatusMap.Canceled, orderStatusMap.Returned];
const discountableStatus = [orderStatusMap.Canceled, orderStatusMap.Created];

class OrderView extends Component {
  state = {
    merchantAddress: {},
    isExpressModalVisible: false,
    isDiscountModalVisible: false,
  };

  formRef = React.createRef();

  discountFormRef = React.createRef();

  refreshCurrent = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/resetCurrent',
    });
    if (id) {
      dispatch({
        type: 'order/get',
        payload: {
          modelName: 'Order',
          id,
          selector: '_id orderNumber address commodityItems rate status description shipping',
        },
      });
    }
  };

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      orderId: this.props.location.query.id,
    });
    this.refreshCurrent(this.props.location.query.id);
  }

  cancelOrder = order => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'order/cancel',
      payload: {
        id: order._id,
      },
      callback: () => {
        this.refreshCurrent(order._id);
      },
    });
  };

  createExpressProcess = () => {
    // ??????
    this.showExpressModal();
  };

  createExpress = () => {
    if (this.state.merchantAddress && this.state.merchantAddress.address) {
      this.createExpressProcess();
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/getMerchantAddress',
        payload: {},
        callback: res => {
          this.setState(
            {
              merchantAddress: res.address,
            },
            this.createExpressProcess,
          );
        },
      });
    }
  };

  showExpressModal = () => {
    this.setState({ isExpressModalVisible: true }, () => {
      this.formRef.current.setFieldsValue({
        'sender.province': this.state.merchantAddress.province,
        'sender.city': this.state.merchantAddress.city,
        'sender.county': this.state.merchantAddress.county,
        'sender.address': this.state.merchantAddress.address,
        'sender.name': this.state.merchantAddress.name,
        'sender.phone': this.state.merchantAddress.phone,
        'sender.zipCode': this.state.merchantAddress.zipCode,
      });
      if (this.props.order && this.props.order.current && this.props.order.current.address)
        this.formRef.current.setFieldsValue({
          'receiver.province': this.props.order.current.address.province,
          'receiver.city': this.props.order.current.address.city,
          'receiver.county': this.props.order.current.address.county,
          'receiver.address': this.props.order.current.address.address,
          'receiver.name': this.props.order.current.address.name,
          'receiver.phone': this.props.order.current.address.phone,
          'receiver.zipCode': this.props.order.current.address.zipCode,
        });
    });
  };

  handleExpressModalOk = () => {
    this.handleCreateExpress(this.formRef.current.getFieldsValue());
    this.setState({ isExpressModalVisible: false });
  };

  handleExpressModalCancel = () => {
    this.setState({ isExpressModalVisible: false });
  };

  handleCreateExpress = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/createShipping',
      payload: jsonConvertToFlatten({
        ...data,
        id: this.props.order.current._id,
      }),
      callback: () => {
        this.refreshCurrent(this.props.order.current._id);
      },
    });
  };

  applyDiscount = ({ discount }) => {
    const {
      order: { current },
    } = this.props;
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'order/applyDiscount',
      payload: {
        id: current._id,
        discount,
      },
      callback: () => {
        this.refreshCurrent(current._id);
      },
    });
  };

  handleDiscountModalOk = () => {
    this.applyDiscount(this.discountFormRef.current.getFieldsValue());
    this.setState({ isDiscountModalVisible: false });
  };

  handleDiscountModalCancel = () => {
    this.setState({ isDiscountModalVisible: false });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const {
      order: { current },
    } = this.props;
    const { isExpressModalVisible, isDiscountModalVisible } = this.state;
    let count = 0;
    let weight = 0;
    if (current && current.commodityItems && current.commodityItems.length) {
      current.commodityItems.forEach(x => {
        count += x.count;
        weight += x.count * (x.commodity.weight || 0);
      });
    }
    return (
      <PageHeaderWrapper className={styles.pageHeader}>
        <div className={styles.main}>
          <GridContent>
            <Card
              title="??????"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                cancelableStatus.indexOf(
                  current.status && current.status.current && current.status.current.name,
                ) >= 0 ? (
                  <>
                    <Popconfirm
                      title="??????????????????????????????"
                      onConfirm={() => {
                        this.cancelOrder(current);
                      }}
                    >
                      <Button type="link">????????????</Button>
                    </Popconfirm>
                  </>
                ) : (
                  <></>
                )
              }
            >
              <Descriptions
                title="????????????"
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label="????????????">{current.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="??????">
                  {current.status && current.status.current && current.status.current.name}
                </Descriptions.Item>
              </Descriptions>
              <Divider
                style={{
                  marginBottom: 32,
                }}
              />
              <Descriptions title="????????????" style={{}} />
              <List
                itemLayout="horizontal"
                dataSource={current.commodityItems}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.commodity.photo} />}
                      title={
                        <Link to={`/product/commodity/edit?id=${item.commodity._id}`}>
                          {item.commodity.name}
                        </Link>
                      }
                      description={toSubdivideString(item.sku)}
                    />
                    <div>
                      <span>???{item.sku.price}</span>
                      <span style={{ marginLeft: 20 }}>
                        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>x</span>
                        {item.count}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </GridContent>
          <GridContent>
            <Card
              title="??????"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                current.address &&
                !current.shipping &&
                shippingableStatus.indexOf(
                  current.status && current.status.current && current.status.current.name,
                ) >= 0 && (
                  <>
                    <Button type="link" onClick={this.createExpress}>
                      ???????????????
                    </Button>
                  </>
                )
              }
            >
              {current.address ? (
                <>
                  <Descriptions style={{}}>
                    <Descriptions.Item label="??????">{current.address.name}</Descriptions.Item>
                    <Descriptions.Item label="??????">{current.address.phone}</Descriptions.Item>
                    <Descriptions.Item label="??????">{`${current.address.province},${current.address.city},${current.address.county},${current.address.address}`}</Descriptions.Item>
                  </Descriptions>
                </>
              ) : (
                <span>--</span>
              )}
              {current.shipping && (
                <>
                  <Divider style={{}} />
                  <Descriptions
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    <Descriptions.Item label="????????????">{current.orderNumber}</Descriptions.Item>
                    <Descriptions.Item label="????????????">??????</Descriptions.Item>
                  </Descriptions>
                  <Descriptions title="????????????" style={{}}>
                    <Descriptions.Item label="??????">?????????</Descriptions.Item>
                  </Descriptions>
                  <Timeline>
                    {current.shipping.items.map((x,i) => (
                      <Timeline.Item key={i}>
                        {x.status} {toDisplayTimestamp(x.timestamp)}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </>
              )}
            </Card>
          </GridContent>
          <GridContent>
            <Card
              title="?????????????????????????????????????????????????????????????????????????????????????????????"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                <>
                  {refundableStatus.indexOf(
                    current.status && current.status.current && current.status.current.name,
                  ) >= 0 && <Button type="link">??????</Button>}
                  {discountableStatus.indexOf(
                    current.status && current.status.current && current.status.current.name,
                  ) >= 0 && (
                    <Button
                      type="link"
                      onClick={() =>
                        this.setState({
                          isDiscountModalVisible: true,
                        })
                      }
                    >
                      ??????????????????
                    </Button>
                  )}
                </>
              }
            >
              {current.rate && (
                <Descriptions style={{}}>
                  <Descriptions.Item label="????????????">
                    ???{current.rate.commodityCost}
                  </Descriptions.Item>
                  <Descriptions.Item label="????????????">
                    ???{current.rate.shippingFee}
                  </Descriptions.Item>
                  <Descriptions.Item label="??????">???{current.rate.discount}</Descriptions.Item>
                  <Descriptions.Item label="?????????">???{current.rate.total}</Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </GridContent>
        </div>
        <Modal
          width="90%"
          title="???????????????"
          visible={isExpressModalVisible}
          onOk={this.handleExpressModalOk}
          onCancel={this.handleExpressModalCancel}
        >
          <Form ref={this.formRef}>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="???????????????">
                  <Form.Item name="sender.province" label="???" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.city" label="???" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.county" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.address" label="????????????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.zipCode" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.phone" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.name" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="???????????????">
                  <Form.Item name="receiver.province" label="???" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.city" label="???" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.county" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.address" label="????????????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.zipCode" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.phone" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.name" label="??????" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card style={{ marginTop: 16 }} title="????????????">
                  <Form.Item name="count" label="??????" initialValue={count} {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="weight" label="??????" initialValue={weight} {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="????????????"
          visible={isDiscountModalVisible}
          onOk={this.handleDiscountModalOk}
          onCancel={this.handleDiscountModalCancel}
        >
          <Form ref={this.discountFormRef}>
            <Row>
              <Col span={24}>
                <Form.Item name="discount" label="??????" {...formItemLayout}>
                  <InputNumber
                    style={{
                      width: 150,
                    }}
                    min="0"
                    step="0.01"
                    stringMode
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))(OrderView);
