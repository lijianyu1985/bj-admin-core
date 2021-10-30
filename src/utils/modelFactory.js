import {
  queryList,
  create,
  change,
  get,
  remove
} from '../services/common';

function Model(options) {
  this.namespace = options.namespace;
  options.urlPrefix = options.urlPrefix || 'common';
  this.state = {
    list: [],
    current: {},
    ...options.state,
  };
  this.effects = {
    * page({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(queryList, payload, options.urlPrefix);
      if (response && response.success) {
        yield put({
          type: 'pageList',
          payload: response && response.data || {},
        });
      }
    },
    * create({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(create, payload, options.urlPrefix);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
        yield put({
          type: 'current',
          payload: {},
        });
      }
    },
    * change({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(change, payload, options.urlPrefix);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
        yield put({
          type: 'current',
          payload: {},
        });
      }
    },
    * remove({
      payload,
      callback
    }, {
      call
    }) {
      const response = yield call(remove, payload, options.urlPrefix);
      if (response && response.success) {
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
    * get({
      payload,
      callback
    }, {
      call,
      put
    }) {
      const response = yield call(get, payload, options.urlPrefix);
      if (response && response.success) {
        yield put({
          type: 'current',
          payload: response && response.data || {},
        });
        // eslint-disable-next-line no-unused-expressions
        if (callback) {
          callback(response);
        }
      }
    },
    * resetCurrent({
      payload
    }, {
      put
    }) {
      yield put({
        type: 'current',
        payload: payload || {},
      });
    },
    ...options.effects,
  };
  this.reducers = {
    pageList(state, action) {
      return {
        ...state,
        list: action.payload.list || [],
        page: action.payload.page || 1,
        size: action.payload.size || 10,
        total: action.payload.total || 0,
      };
    },
    current(state, action) {
      return {
        ...state,
        current: (action.payload) || {},
      };
    },
    ...options.reducers,
  };
}

const modelFactory = options => new Model(options);

export default modelFactory;
