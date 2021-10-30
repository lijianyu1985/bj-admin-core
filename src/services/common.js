import request from '@/utils/request';

export async function queryList(params, urlPrefix) {
  return request(`/${urlPrefix}/Page`, {
    params,
  });
}

export async function all(params, urlPrefix) {
  return request(`/${urlPrefix}/Find`, {
    params,
  });
}

export async function create(params, urlPrefix) {
  return request(`/${urlPrefix}/Create`, {
    method: `POST`,
    data: params,
  });
}

export async function change(params, urlPrefix) {
  return request(`/${urlPrefix}/Update`, {
    method: `POST`,
    data: params,
  });
}

export async function get(params, urlPrefix) {
  return request(`/${urlPrefix}/Get`, {
    method: `GET`,
    params,
  });
}

export async function remove(params, urlPrefix) {
  return request(`/${urlPrefix}/Delete`, {
    method: `DELETE`,
    data: params,
  });
}
