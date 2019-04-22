import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
     /*  {
        path: 'tab1',
        loadChildren: '../tab1/tab1.module#Tab1PageModule',
      },
      {
        path: 'tab2',
        loadChildren: '../tab2/tab2.module#Tab2PageModule',
      },
      {
        path: 'tab4',
        loadChildren: '../tab4/tab4.module#Tab4PageModule',
      },
      {
        path: 'tab5',
        loadChildren: '../tab5/tab5.module#Tab5PageModule',
      }, */
      {
        path: 'tab1',
        children: [
          {
            path: '',
            outlet: 'tab1',
            loadChildren: '../tab1/tab1.module#Tab1PageModule',
          }
        ]
      }, 
      
     
      {
        
         path: 'tab2',
        children: [
          {
            path: '',
            outlet: 'tab2',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ] 
      },
      {
       
         path: 'tab3',
        children: [
          {
            path: '',
            outlet: 'tab3',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ] 
      },
      
      {
        
        path: 'tab4',
        children: [
          {
            path: '',
            outlet: 'tab4',
            loadChildren: '../tab4/tab4.module#Tab4PageModule'
          }
        ] 
      },
      
      {
        path: 'tab5',
        children: [
          {
            path: '',
            outlet: 'tab5',
            loadChildren: '../tab5/tab5.module#Tab5PageModule'
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
    loadChildren: '../tab1/tab1.module#Tab1PageModule',
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
