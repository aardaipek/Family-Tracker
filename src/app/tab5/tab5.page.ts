import { ToastService } from "./../services/toast.service";
import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { AlertController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-tab5",
  templateUrl: "./tab5.page.html",
  styleUrls: ["./tab5.page.scss"]
})
export class Tab5Page implements OnInit {
  title = "Profile";
  email: string;
  uid: any;
  userName: string;
  currentImage: any;
  image:any

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public camera: Camera,
    private toast: ToastService
  ) {}

  ngOnInit() {
    if (firebase.auth().currentUser != null) {
      firebase.auth().currentUser.providerData.forEach(profile => {
        console.log("  UserName: " + profile.displayName);
        console.log("  Email: " + profile.email);
        this.userName = profile.displayName;
        this.email = profile.email;
        this.image = profile.photoURL
      });
    }
    


  }

  async logoutAlert() {
    const alert = await this.alertController.create({
      header: "Başarıyla çıkış yapıldı",
      buttons: ["OK"]
    });

    await alert.present();
  }
  fbGetUrl(uid) {
    return firebase
      .database()
      .ref("/Users/subscribed/" + uid + "/photoUrl/")
      .child("photoUrl")
      .once("value");
  }
  photoToFire(arda: any) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .storage()
          .ref("/pp/" + new Date().toISOString())
          .putString(arda, "data_url")
          .then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadUrl => {
              firebase
                .database()
                .ref("/Users/subscribed/" + user.uid)
                .child("photoUrl")
                .set(downloadUrl); 
                firebase.auth().currentUser.updateProfile({
                  photoURL : downloadUrl
                }).then(() => {
                
                }).catch((error) => {
                  return error;
                })
            });
          });
      }
    });
  }
  takeSelfie() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(
      imageData => {
        this.currentImage = "data:image/jpeg;base64," + imageData;
        this.photoToFire(this.currentImage);
      },
      err => {
        // Handle error
        console.log("Camera issue:" + err);
      }
    );
  }

  logout() {
    this.authService
      .logoutUser()
      .then(res => {
        this.logoutAlert();
        this.navCtrl.navigateBack("/login");
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToEdit() {
    this.navCtrl.navigateForward("/edit-profile");
  }
  goToDashboard() {
    this.navCtrl.navigateForward("/dashboard");
  }
}
