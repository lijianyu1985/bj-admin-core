import { queryCurrent } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response && response.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: response && response.data,
        });
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: null,
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: (action.payload) || {} };
    },
  },
};
export default UserModel;
