import { Routes } from '@angular/router';
import {ProfileComponent} from '../pages/profile/profile.component';
import {ProtectedComponent} from '../pages/protected/protected.component';
import {canActivateAuthRole} from '../services/auth.guard';

export const routes: Routes = [
  {path: '', component: ProfileComponent},
  {path: 'protected-all-authenticated', component: ProtectedComponent, canActivate: [canActivateAuthRole], data: {role: 'any'}},
  {path: 'protected-with-role', component: ProtectedComponent, canActivate: [canActivateAuthRole], data: {role: 'demo'}},
];
