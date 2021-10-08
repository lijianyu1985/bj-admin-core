import { getAllResources } from './service';
import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  namespace: 'role',
  state: {
    list: [],
    resources:[]
  },
  effects: {
    *getAllResources({ _ }, { put, call }) {
      const response = yield call(getAllResources, {modelName:'Resource'});
      yield put({
        type: 'changeAllResources',
        payload: response,
      });
    },
  },
  reducers: {
    changeAllResources(state, { payload }) {
      return { ...state, resources: payload.list ||[]};
    },
  },
});
export default Model;
