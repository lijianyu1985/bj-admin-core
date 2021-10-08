import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  namespace: 'resource',
  state: {
    list: [],
    resources: [],
  },
  effects: {},
  reducers: {},
});
export default Model;
