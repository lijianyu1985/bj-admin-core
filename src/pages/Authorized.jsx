import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';
import { getToken } from '@/utils/authority';

const AuthComponent = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { routes = [] } = route;
  const isLogin = getToken();
  return (
    <Authorized
      path={location.pathname}
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({user}) => ({
  user,
}))(AuthComponent);
