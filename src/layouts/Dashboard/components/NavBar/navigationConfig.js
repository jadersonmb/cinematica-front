/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
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
            href: '/especialidade'
          },
          {
            title: 'Profissão',
            href: '/profissao'
          },
          {
            title: 'Horário',
            href: '/horario'
          },
          {
            title: 'Formas de Pagamento',
            href: '/formaPagamento'
          }
        ]
      },
      {
        title: 'Financeiro',
        href: '/financeiro',
        icon: MonetizationOnIcon,
        children: [
          {
            title: 'Fluxo de Caixa',
            href: '/fluxoCaixa'
          }
        ]
      }
    ]
  }
];
