import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    title:string = "Aboneliğim"
  constructor(private menu: MenuController, private authService: AuthService) { }

  ngOnInit() {
    
  }

 
 
  
 

}
