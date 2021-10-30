import request from '@/utils/request';

export async function generateApiResources(params) {
  return request('/resource/generateApi', {
    method: 'POST',
    data: params,
  });
}

export async function generateAdminResources(params) {
  return request('/resource/generateAdmin', {
    method: 'POST',
    data: params,
  });
}
