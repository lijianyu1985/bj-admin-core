import request from '@/utils/request';

export async function getAccountService(params) {
  return request('/AccountManagement/Get', {
    method: 'GET',
    params,
  });
}

export async function getAllRoles(params) {
  return request('/Common/All', {
    method: 'GET',
    params,
  });
}

export async function createAccount(params) {
  return request('/AccountManagement/Create', {
    method: 'POST',
    data: params,
  });
}

export async function changeAccount(params) {
  return request('/AccountManagement/Change', {
    method: 'POST',
    data: params,
  });
}
