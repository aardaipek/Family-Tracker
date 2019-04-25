import { AuthService } from './../services/auth.service';
import { ToastService } from "./../services/toast.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase/app';


@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  title = "Şifre Sıfırlama";
  email:string;
  userName:string

  constructor(private toast: ToastService, 
    private authService: AuthService,
    private navCtrl: NavController,
    ) {}

  ngOnInit() {}
  password(email) {
    firebase.auth().sendPasswordResetEmail(this.email).then( ()=> {
      console.log("oldu")
      this.toast.resetPasswordToast(this.email)
      this.navCtrl.navigateBack('/login')
    }).catch(() => {
      console.log("error")
    })
  }

  up(userName) {
    this.authService.update(this.userName)
  }

  /* resetPass() {
    this.AuthService.resetPass(this.email).then(res => {
      this.toast.resetPasswordToast(this.email)
      this.navCtrl.navigateBack('/login')
    }) .catch(error => {
      console.log(error);
    });
  } */
}
