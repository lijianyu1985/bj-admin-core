import React from 'react';
import { CURRENT } from './renderAuthorize';
import { trim } from 'lodash';
import PromiseRender from './PromiseRender';

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 当前路径 | Current path } path
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, path, currentAuthority, target, Exception) => {
  // 没有判定权限. 做resource检查
  // Retirement authority, return target;
  if (currentAuthority === '*' || currentAuthority.some(item => item === '*')) {
    return target;
  }
  const targetAuthority = authority || (path.indexOf('exception') >= 0 ? '' : trim(path, '/'));

  if (authority === false || !targetAuthority) {
    return target;
  } // 数组处理
  if (Array.isArray(targetAuthority)) {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some(item => targetAuthority.includes(item))) {
        return target;
      }
    } else if (targetAuthority.includes(currentAuthority)) {
      return target;
    }

    return Exception;
  } // string 处理

  if (typeof targetAuthority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some(item => targetAuthority === item)) {
        return target;
      }
    } else if (targetAuthority === currentAuthority) {
      return target;
    }

    return Exception;
  } // Promise 处理

  if (targetAuthority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={targetAuthority} />;
  } // Function 处理

  if (typeof targetAuthority === 'function') {
    try {
      const bool = targetAuthority(currentAuthority); // 函数执行后返回值是 Promise

      if (bool instanceof Promise) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }

      if (bool) {
        return target;
      }

      return Exception;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  throw new Error('unsupported parameters');
};

export { checkPermissions };

function check(authority, path, target, Exception) {
  return checkPermissions(authority, path, CURRENT, target, Exception);
}

export default check;
