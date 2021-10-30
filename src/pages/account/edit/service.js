import request from '@/utils/request';

export async function getAccountService(params) {
  return request('/account/Get', {
    method: 'GET',
    params,
  });
}

export async function getAllRoles(params) {
  return request('/role/find', {
    method: 'GET',
    params,
  });
}

export async function createAccount(params) {
  return request('/account/Create', {
    method: 'POST',
    data: params,
  });
}

export async function changeAccount(params) {
  return request('/account/Change', {
    method: 'POST',
    data: params,
  });
}
