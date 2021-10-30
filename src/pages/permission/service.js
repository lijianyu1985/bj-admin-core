import request from '@/utils/request';

export async function getAllResources(params) {
  return request('/resource/find', {
    method: 'GET',
    params,
  });
}