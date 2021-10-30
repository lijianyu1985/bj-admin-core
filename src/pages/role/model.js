import { getAllPermissions } from './service';
import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  urlPrefix: 'role',
  namespace: 'role',
  state: {
    list: [],
    permissions: [],
  },
  effects: {
    *getAllPermissions({ _ }, { put, call }) {
      const response = yield call(getAllPermissions, { projection: '_id name' });
      yield put({
        type: 'changeAllPermissions',
        payload: response && response.data,
      });
    },
  },
  reducers: {
    changeAllPermissions(state, { payload }) {
      return { ...state, permissions: payload || [] };
    },
  },
});
export default Model;
