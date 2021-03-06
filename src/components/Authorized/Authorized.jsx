import React from 'react';
import { Result } from 'antd';
import check from './CheckPermissions';

const Authorized = ({
  children,
  authority,
  path,
  noMatch = (
    <Result
      status={403}
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  ),
}) => {
  const childrenRender = typeof children === 'undefined' ? null : children;
  const dom = check(authority, path, childrenRender, noMatch);
  return <>{dom}</>;
};

export default Authorized;
