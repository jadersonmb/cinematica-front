/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
/*import OverviewView from './views/Overview';
import PresentationView from './views/Especialidade'; */

const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboards/default" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('views/Login'))
      },
      {
        path: '/auth/register',
        exact: true,
        component: lazy(() => import('views/Register'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/dashboards/default',
        exact: true,
        component: DashboardDefaultView
      },
      {
        path: '/especialidade',
        exact: true,
        component: lazy(() => import('views/Especialidade/Especialidade'))
      },
      {
        path: '/profissao',
        exact: true,
        component: lazy(() => import('views/Profissao/Profissao'))
      },
      {
        path: '/horario',
        exact: true,
        component: lazy(() => import('views/Horario/Horario'))
      },
      {
        path: '/fluxoCaixa',
        exact: true,
        component: lazy(() => import('views/FluxoCaixa/FluxoCaixa'))
      },
      {
        path: '/formaPagamento',
        exact: true,
        component: lazy(() => import('views/FormaPagamento/FormaPagamento'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];

export default routes;
