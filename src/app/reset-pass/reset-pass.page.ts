import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './../services/auth.service';
import { ToastService } from "./../services/toast.service";
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {
  title:string ="Şifre Sıfırlama"
  email:string;

  constructor(private toast: ToastService, 
    private authService: AuthService,
    private navCtrl: NavController,
    ) {}

  ngOnInit() {
  }
  resetPassword(email) {
    firebase.auth().sendPasswordResetEmail(this.email).then( ()=> {
      console.log("oldu")
      this.toast.resetPasswordToast(this.email)
      this.navCtrl.navigateBack('/login')
    }).catch(() => {
      console.log("error")
    })
  }


}
