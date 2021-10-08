import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/AccountAuth/Signin', {
    method: 'POST',
    data: params,
  });
}
