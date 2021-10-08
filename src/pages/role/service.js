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

export async function getAccountService(params) {
  return request('/AccountManagement/Get', {
    method: 'GET',
    params,
  });
}

export async function getAllResources(params) {
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
