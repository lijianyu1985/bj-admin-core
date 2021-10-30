import modelFactory from '../../utils/modelFactory';

const Model = modelFactory({
  urlPrefix: 'todo',
  namespace: 'todo',
  state: {
    list: [],
    resources: [],
  },
  effects: {
  },
  reducers: {
  },
});
export default Model;
