import React, { useContext } from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';

import history from '../helpers/history';
import DashboardContainer from '../modules/dashboard/dashboard.container';
import LandingContainer from '../modules/landing/landing.container';
import LoginForm from '../modules/login-form/login-form';
import { AddOrderContainer } from '../modules/order/add-order.container';
import { Route as CustomRoute, getRoutes } from '../services/role-management/routes';
import { PageNotFound } from '../shared/components/PageNotFound/PageNotFound';
import { SessionContext } from '../shared/contexts/session';

import PrivateSection from './PrivateSection';

export default function AppRoute(): JSX.Element {
  const [state] = useContext(SessionContext);
  const routes: CustomRoute[] = getRoutes();

  return (
    <Router history={history}>
      <PrivateSection>
        <Switch>
          <Redirect path="/" exact to="/order" />
          <Route path="/order" render={(): JSX.Element => <AddOrderContainer />} />
          {routes.map((route, key) => (
            <Route path={route.url} key={key} exact render={(): JSX.Element => <route.component />} />
          ))}
          <Route path="*" render={(): React.ReactNode => <PageNotFound />} />
        </Switch>
      </PrivateSection>
    </Router>
  );
}
