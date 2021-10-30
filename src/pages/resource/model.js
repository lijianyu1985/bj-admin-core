import modelFactory from '../../utils/modelFactory';
import { generateApiResources, generateAdminResources } from './service';

const Model = modelFactory({
  urlPrefix: 'resource',
  namespace: 'resource',
  state: {
    list: [],
    resources: [],
  },
  effects: {
    *generate({ payload, callback }, { put, call }) {
      const response = yield call(generateApiResources, payload);
      callback && callback(response);
    },
    *generateAdmin({ payload, callback }, { put, call }) {
      const response = yield call(generateAdminResources, payload);
      callback && callback(response);
    },
  },
  reducers: {
  },
});
export default Model;
