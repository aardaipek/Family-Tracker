import { ToastService } from "./../services/toast.service";
import { Component, OnInit,NgZone } from "@angular/core";
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
  address: any []=[]
  parentUid:string;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public camera: Camera,
    private toast: ToastService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
  if (firebase.auth().currentUser != null) {
      firebase.auth().currentUser.providerData.forEach(profile => {
        this.userName = profile.displayName;
        this.email = profile.email;
        this.image = profile.photoURL

      });
    } 
    firebase.auth().onAuthStateChanged(user => {
      this.uid = user.uid
      this.getUserArea()
      this.getParentUid(user.uid)
      this.ard()
    })
  
  
  }

  getUserArea(){
    firebase.database().ref("/Users/subscribed/" + this.uid+ "/areas").once('value').then((snapshot)=>{
      snapshot.forEach(items =>{
       let containerData = {
         email:"",
         username: ""
        }
        let email = items.child("user").toJSON() as string
        let memberUserName = items.child("name").toJSON() as string
        containerData.email =email
        containerData.username = memberUserName
        this.address.push(containerData)
      })
   })
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
  getParentUid(uid){
    let ref = firebase.database().ref('/Users/relations').child(uid).once('value').then((data) => {
      let parent= data.val()
    })
   
   
  }
  ard() {
    firebase.database().ref('/Users/relations').child(this.uid).once('value').then((data) => {
      let parent= data.val()
    })
}
  
  photoToFire(arda: any) {
    let ref = firebase.database().ref('/Users/relations').child(this.uid).once('value').then((data) => {
      let parent= data.val()
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          firebase
            .storage()
            .ref("/pp/" + new Date().toISOString())
            .putString(arda, "data_url")
            .then(snapshot => {
              snapshot.ref.getDownloadURL().then(downloadUrl => {
                let userr = firebase.database().ref('/Users/subscribed/' +user.uid);
                let parent= data.val()
                if(parent === null){
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

                }else {

                  firebase.database().ref("/Users/subscribed/" + parent+ "/members/" + user.uid).child("photoUrl").set(downloadUrl);
                  firebase.auth().currentUser.updateProfile({
                    photoURL : downloadUrl
                  }).then(() => {
                  
                  }).catch((error) => {
                    this.toast.monthlySubToast(error)
                  })
                 
                 
                }
              });
            });
        }
      });
    })
 
  
  }
  takeSelfie() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
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
