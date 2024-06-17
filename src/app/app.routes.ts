import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./BizsolErp/Masters/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'leads',
        loadChildren: () => import('./BizsolErp/Masters/lead-master.routes').then((m) => m.routes)
      },

      {
        path: 'transactions',
        loadChildren: () => import('./BizsolErp/Transactions/transactions.routes').then((m) => m.routes)
      },

      // {
      //   path: 'reports',
      //   loadChildren: () => import('./views/pages/components/reports/reports.routes').then((m) => m.routes)
      // }
    ]
  },
];
