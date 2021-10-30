import request from '@/utils/request';

export async function getProfile(params) {
  return request('/account/profile', {
    params,
  });
}

export async function changeProfile(params) {
  return request('/account/changeProfile', {
    method: 'POST',
    data: params,
  });
}

export async function changePassword(params) {
  return request('/account/ChangePassword', {
    method: 'POST',
    data: params,
  });
}
