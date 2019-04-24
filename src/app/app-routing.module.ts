import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /* { path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
  { path: '', redirectTo: '/tabs', pathMatch: 'full' },
 
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
   
 { path: 'register', loadChildren: './register/register.module#RegisterPageModule' }, */
 { path: '', redirectTo: '/login', pathMatch: 'full'},
 { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' , canActivate: [AuthGuard]},
 { path: 'register', loadChildren: './register/register.module#RegisterPageModule' }, 
 { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
 { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
 { path: 'home', loadChildren: './home/home.module#HomePageModule'  },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
 
  
   
  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
