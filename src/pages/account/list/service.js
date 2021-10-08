import request from '@/utils/request';

export async function queryAccountList(params) {
  return request('/Common/Page', {
    params,
  });
}

export async function archiveAccount(params) {
  return request('/AccountManagement/Archive', {
    method: 'POST',
    data: params,
  });
}

export async function defaultPassword(params) {
  return request('/AccountManagement/DefaultPassword', {
    method: 'POST',
    data: params,
  });
}
