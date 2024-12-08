import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/stocks', pathMatch: 'full' },
  {
    path: 'stocks',
    loadComponent: () => import('./components/stock/stock-list/stock-list.component')
      .then(m => m.StockListComponent)
  },
  {
    path: 'employes',
    loadComponent: () => import('./components/employe/employe-list/employe-list.component')
      .then(m => m.EmployeListComponent)
  },
  {
    path: 'achats',
    loadComponent: () => import('./components/achat/achat-list/achat-list.component')
      .then(m => m.AchatListComponent)
  },
  {
    path: 'ventes',
    loadComponent: () => import('./components/vente/vente-list/vente-list.component')
      .then(m => m.VenteListComponent)
  }
];
