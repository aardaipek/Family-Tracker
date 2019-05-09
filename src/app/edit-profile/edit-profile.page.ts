import { AuthService } from "./../services/auth.service";
import { ToastService } from "./../services/toast.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import * as firebase from "firebase/app";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  title = "Profil Güncelleme";
  userName: string;

  constructor(
    private toast: ToastService,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  up(userName) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authService.update(this.userName,user.uid)
      }else{

      }
  })
}

}