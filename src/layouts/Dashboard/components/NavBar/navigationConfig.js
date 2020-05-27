/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import { Label } from 'components';

export default [
  {
    title: 'Páginas',
    pages: [
       {
        title: 'Dashboards',
        href: '/dashboards/default',
        icon: DashboardIcon
      },
      {
        title: 'Cadastro',
        href: '/cadastro',
        icon: DesktopMacIcon,
        children: [
          {
            title: 'Especialidade',
            href: '/Especialidade'
          }
        ]
      }
    ]
  }
];
