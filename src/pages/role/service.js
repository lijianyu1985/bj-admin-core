import request from '@/utils/request';

export async function getAllPermissions(params) {
  return request('/permission/find', {
    method: 'GET',
    params,
  });
}
