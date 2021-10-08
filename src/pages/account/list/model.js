import { notification } from 'antd';
import { archiveAccount, queryAccountList, defaultPassword } from './service';

const Model = {
  namespace: 'accountList',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      if (response && response.success) {
        yield put({
          type: 'queryList',
          payload: response || {},
        });
      }
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(archiveAccount, payload);
      if (response && response.success) {
        notification.success({
          message: '成功',
          description: '删除账户成功',
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
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.list || [],
        page: action.payload.page || 1,
        size: action.payload.size || 10,
        total: action.payload.total || 0,
      };
    },
  },
};
export default Model;
