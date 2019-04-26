import { Tab1Page } from './../tab1/tab1.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { Tab2Page } from '../tab2/tab2.page';
import { Tab3Page } from '../tab3/tab3.page';
import { Tab4Page } from '../tab4/tab4.page';
import { Tab5Page } from '../tab5/tab5.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      /* {
        path: 'tab1',
        outlet: 'tab1',
        loadChildren: '../tab1/tab1.module#Tab1PageModule',
      },
      {
        path: 'tab2',
        outlet: 'tab2',
        loadChildren: '../tab2/tab2.module#Tab2PageModule'
      },
       {
        path: 'tab3',
        outlet: 'tab3',
        loadChildren: '../tab3/tab3.module#Tab3PageModule'
      }, 
      {
        path: 'tab4',
        outlet: 'tab4',
        loadChildren: '../tab4/tab4.module#Tab4PageModule'
      },
      {
        path: 'tab5',
        outlet: 'tab5',
        loadChildren: '../tab5/tab5.module#Tab5PageModule'
      } */
         {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule',
          },
          {
            path: 'dashboard',
            loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
          },
          {
            path: 'home',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      }, 
      {
         path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ] 
      },
      {
         path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ] 
      }, 
      {
        
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: '../tab4/tab4.module#Tab4PageModule'
          }
        ] 
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren: '../tab5/tab5.module#Tab5PageModule'
          },
          {
            path: 'home',
            loadChildren: '../home/home.module#HomePageModule'
          }

        ] 
      }, 
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }  
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
    //loadChildren: '../tab1/tab1.module#Tab1PageModule',
  }  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
  
}
