import { notification } from 'antd';
import { changeProfile, getProfile, changePassword, defaultPassword } from './service';

const Model = {
  namespace: 'profile',
  state: {
    current: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProfile, payload);
      if (response && response.success) {
        yield put({
          type: 'current',
          payload: response || {},
        });
      }
    },
    *change({ payload, callback }, { call, put }) {
      const response = yield call(changeProfile, payload);
      if (response && response.success) {
        yield put({
          type: 'current',
          payload: response || {},
        });
        notification.success({
          message: '成功',
          description: '修改成功',
        });
        // eslint-disable-next-line no-unused-expressions
        callback && callback();
      }
    },
    *changePassword({ payload, callback }, { call }) {
      const response = yield call(changePassword, payload);
      if (response && response.success) {
        notification.success({
          message: '成功',
          description: '修改密码成功',
        });
        // eslint-disable-next-line no-unused-expressions
        callback && callback();
      }
    },
    *resetPassword({ payload, callback }, { call }) {
      const response = yield call(defaultPassword, payload);
      if (response && response.success) {
        notification.success({
          message: '成功',
          description: '重置密码成功',
        });
        // eslint-disable-next-line no-unused-expressions
        callback && callback();
      }
    },
  },
  reducers: {
    current(state, action) {
      return {
        ...state,
        current: (action.payload && action.payload.data) || {},
      };
    },
  },
};
export default Model;
