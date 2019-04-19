import { Tab1Page } from "./../tab1/tab1.page";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab5",
  templateUrl: "./tab5.page.html",
  styleUrls: ["./tab5.page.scss"]
})
export class Tab5Page implements OnInit {
  title = "Profile";
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  go() {
    this.navCtrl.navigateForward("/dashboard");
  }

  logout() {
    this.authService
      .logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack("/login");
      })
      .catch(error => {
        console.log(error);
      });
  }
}
