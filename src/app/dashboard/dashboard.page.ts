import { ToastService } from './../services/toast.service';
import { Platform } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';


  const MONTHLY_KEY = 'Product ID';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
    title:string = "Aboneliğim"

    products = [];
    monthlySub = false
    previousPurchases = [];

  constructor( private authService: AuthService, private plt: Platform, private iap:InAppPurchase, private toast:ToastService) {

    this.plt.ready().then(() => {
      if(this.plt.is('cordova')){
        this.iap.getProducts([MONTHLY_KEY]).then(products => {
          console.log('products: ',products);
          this.products = products
        })
      }
    }).catch(err => {
      console.log('error : ',err)
    });

}

  ngOnInit() {}

   buy(product){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.iap.buy(product).then(data => {
          //this.enableSub(product);
          this.iap.consume(data.productType,data.receipt,data.signature).then(() => {
            console.log('success')
            this.toast.monthlySubToast(user.displayName)
          })
        })
      } else { 
        (error) => {
          this.toast.notLoginToast();
          console.log('err : ', error)
        }
      }
    });
   }

   restore(){
    this.iap.restorePurchases().then(purchases => {
      this.previousPurchases = purchases;

      for(let prev of this.previousPurchases) {
        this.enableSub(prev.productId)
      }
    })
   }



   enableSub(id){
     if(id === MONTHLY_KEY ){
       this.monthlySub = true;
     }
   }


 
 
  
 

}
