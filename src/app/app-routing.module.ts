import { AuthGuard } from './auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 { path: '', redirectTo: '/login', pathMatch: 'full' },
 { path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
 { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
 { path: 'register', loadChildren: './register/register.module#RegisterPageModule' }, 
 { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
 { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
 { path: 'home', loadChildren: './home/home.module#HomePageModule' },
 { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'reset-pass', loadChildren: './reset-pass/reset-pass.module#ResetPassPageModule' },
 

];
@NgModule({
  imports: [



    
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
