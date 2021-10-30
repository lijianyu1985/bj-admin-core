import request from '@/utils/request';

export async function queryAccountList(params) {
  return request('/account/Page', {
    params,
  });
}

export async function archiveAccount(params) {
  return request('/account/delete', {
    method: 'DELETE',
    data: params,
  });
}

export async function defaultPassword(params) {
  return request('/account/DefaultPassword', {
    method: 'POST',
    data: params,
  });
}
