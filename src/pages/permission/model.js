import {
  getAllResources
} from './service';
import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  urlPrefix: 'permission',
  namespace: 'permission',
  state: {
    list: [],
    resources: [],
  },
  effects: {
    * getAllResources({
      _
    }, {
      put,
      call
    }) {
      const response = yield call(getAllResources, {
        projection: '_id name identifier type'
      });
      yield put({
        type: 'changeAllResources',
        payload: response && response.data,
      });
    },
  },
  reducers: {
    changeAllResources(state, {
      payload
    }) {
      return {
        ...state,
        resources: payload || []
      };
    },
  },
});
export default Model;
