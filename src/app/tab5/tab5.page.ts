import { Tab1Page } from "./../tab1/tab1.page";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { AlertController } from "@ionic/angular";
import { Camera, CameraOptions  } from '@ionic-native/camera/ngx';


@Component({
  selector: "app-tab5",
  templateUrl: "./tab5.page.html",
  styleUrls: ["./tab5.page.scss"]
})
export class Tab5Page implements OnInit {
  title = "Profile";
  email:string;
  uid: any;
  userName : string;
  currentImage: any;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public camera:Camera
  ) {}

  ngOnInit() {
    if (firebase.auth().currentUser != null) {
      firebase.auth().currentUser.providerData.forEach((profile) => {
        console.log("  UserName: " + profile.displayName);
        console.log("  Email: " + profile.email);
        this.userName = profile.displayName
        this.email =  profile.email
        
     
      });
    }
  }
 
  async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Başarıyla çıkış yapıldı',
      buttons: ["OK"]
    });

    await alert.present();
  }

  
  logout() {
    this.authService
      .logoutUser()
      .then(res => {
        this.logoutAlert()
        this.navCtrl.navigateBack("/login");
      })
      .catch(error => {
        console.log(error);
      });
  }
  takeSelfie() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,

    }
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.authService.addProfilePhoto(this.currentImage)
    }, (err) => {
     // Handle error
     console.log("Camera issue:" + err);
    });

  }
  

  goToEdit() {
    this.navCtrl.navigateForward('/edit-profile')
  }
  goToDashboard() {
    this.navCtrl.navigateForward("/dashboard");
  }
 
}
