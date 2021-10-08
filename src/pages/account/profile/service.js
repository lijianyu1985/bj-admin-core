import request from '@/utils/request';

export async function getProfile(params) {
  return request('/AccountProfile/Get', {
    params,
  });
}

export async function changeProfile(params) {
  return request('/AccountProfile/Change', {
    method: 'POST',
    data: params,
  });
}

export async function changePassword(params) {
  return request('/AccountProfile/ChangePassword', {
    method: 'POST',
    data: params,
  });
}
