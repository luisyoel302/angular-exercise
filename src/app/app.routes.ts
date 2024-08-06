import { Routes } from '@angular/router';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    title: 'Basic Information',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
