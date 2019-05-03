import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(
    public geo: Geolocation,
    public alertController: AlertController,
    public actionSheet: ActionSheetController,
    private navCtrl: NavController,
    private authService: AuthService,
    private router:Router
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       
      } else {
        this.router.navigateByUrl('/login')
      }
    });
    
  }
 

  sendLocationToMember() {
    this.geo.watchPosition().subscribe(data => {
      firebase
        .database()
        .ref("/locations/coords")
        .update({ lat: data.coords.latitude, lng: data.coords.longitude });
    });
  }

  async createAlert() {
    const alert = await this.alertController.create({
      message: "Your location sent",
      buttons: ["OK"]
    });

    await alert.present();
  }
  async locAlert() {
    const alert = await this.alertController.create({
      message: "Your location ready to send",
      buttons: [
        {
          text: "Select Member",
          cssClass: "primary",
          handler: async () => {
            const action = await this.actionSheet.create({
              buttons: [
                {
                  text: "Mother",
                  handler: () => {
                    this.sendLocationToMember();
                    this.createAlert();
                  }
                },
                {
                  text: "Father",
                  handler: () => {
                    this.sendLocationToMember();
                    this.createAlert();
                  }
                },
                {
                  text: "Brother",
                  handler: () => {
                    this.sendLocationToMember();
                    this.createAlert();
                  }
                },
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel Clicked");
                  }
                }
              ]
            });
            await action.present();
          }
        },
        {
          text: "Emergency",
          cssClass: "secondary",
          handler: () => {
            this.sendLocationToMember();
            this.createAlert();
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel Clicked");
          }
        }
      ]
    });
    await alert.present();
  }
}
