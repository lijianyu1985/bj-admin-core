import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { getAllRoles, createAccount, changeAccount, getAccountService } from './service';

const Model = {
  namespace: 'accountEdit',
  state: { roles: [] },
  effects: {
    *getAccount({ payload, callback }, { put, call }) {
      const response = yield call(getAccountService, payload);
      yield put({
        type: 'setCurrentAccount',
        payload: response && response.data,
      });
      // eslint-disable-next-line no-unused-expressions
      callback && callback(response && response.data);
    },
    *getAllRoles({ _ }, { put, call }) {
      const response = yield call(getAllRoles, { modelName: 'Role', projection: 'id name' });
      yield put({
        type: 'changeAllRoles',
        payload: response && response.data,
      });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(createAccount, payload);
      if (response && response.success) {
        notification.success({
          message: '成功',
          description: '新建账户成功',
        });
        yield put(routerRedux.replace('/account/list'));
      }
    },
    *change({ payload }, { call, put }) {
      const response = yield call(changeAccount, payload);
      if (response && response.success) {
        notification.success({
          message: '成功',
          description: '修改账户成功',
        });
        yield put(routerRedux.replace('/account/list'));
      }
    },
  },
  reducers: {
    changeAccountList(state, { payload }) {
      return { ...state, accountList: payload };
    },
    changeAllRoles(state, { payload }) {
      return { ...state, roles: payload || [] };
    },
    setCurrentAccount(state, { payload }) {
      return { ...state, currentAccount: payload };
    },
  },
};
export default Model;
