import { ToastService } from "./../services/toast.service";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { AuthService } from "./../services/auth.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {IonContent} from '@ionic/angular';
declare var google;


@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild(IonContent, {read: IonContent}) myContent: IonContent;

  @ViewChild("map") mapElement: ElementRef;
  map: any;
  clickEvent: any;
  curLat: any;
  curLng: any;
  areaUniqueKey:any;


  title = " Family Home";
  mail: string;
  userName: string;
  uid: string;
  userMail:string;
  members:any[] = [];

  constructor(
    public alertController: AlertController,
    public dbs: AngularFireDatabase,
    private navCtrl: NavController,
    private authService: AuthService,
    private Diagnostic: Diagnostic,
    private toast: ToastService,
    public geo: Geolocation,
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.uid = user.uid;
      this.loadMap(user.photoURL, user.displayName);
      if (user) {
      } else {
      }
    });
    /*  */
    /* firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        // Send token to your backend via HTTPS
      })
      .catch(error => {
        // Handle error
      }); */

    /*  */
    this.Diagnostic.getBluetoothState()
      .then(state => {
        if (state == this.Diagnostic.bluetoothState.POWERED_ON) {
          this.toast.monthlySubToast("Açık");
        } else {
          this.toast.monthlySubToast("Kapalı");
        }
      })
      .catch(e => console.error(e));
      /*  */
  }

  getMembers(){
  
    this.dbs.list("/Users/subscribed/" + this.uid+ "/members").snapshotChanges().subscribe(items => {
     items.forEach(item => {
       let container = {
         lat:0,
         lng:0,
         photo:"", 
         email:"",
         username: ""
       }
       let child = item.payload.child("locations")
         child.forEach(element => {
           if (element.key == "lat") {
             container.lat = element.toJSON() as number
           } else if (element.key == "lng") {
             container.lng = element.toJSON() as number
           }
        })
       let email = item.payload.child("email").toJSON() as string
       let photo = item.payload.child("photoUrl").toJSON() as string
       let memberUserName = item.payload.child("username").toJSON() as string
       container.username = memberUserName
       container.photo= photo
       container.email = email
      this.members.push(container)
       console.log(this.members);

       
     })
     })
  
  }

  goToDashboard() {
    this.navCtrl.navigateForward("/dashboard");
  }
  goToMap() {
    this.navCtrl.navigateForward("/home");
  }

  memberAdd() {
    if (this.mail == null) {
      this.errAlert();
    } else {
      this.authService.inviteUser(this.mail);
      this.memberAddAlert(this.mail);
    }
  }

  async errAlert() {
    const alert = await this.alertController.create({
      message: "Mail adresi boş bırakılmaz",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async memberAddAlert(mail: string) {
    const alert = await this.alertController.create({
      message: "Davetiyeniz  " + mail + " adresine gönderildi",
      buttons: ["OK"]
    });

    await alert.present();
  }






  loadMap(photo: string, name: string) {
    let clickLatLng;
    this.geo.getCurrentPosition().then(
      position => {
        this.curLat = position.coords.latitude;
        this.curLng = position.coords.longitude;

        let latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );
        
        this.marker(this.map, name, photo);
      },
      err => {
        alert(JSON.stringify(err));
      }
    );
  }
 

  
  marker(map: any, name: string, photo: string) {
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      icon: { url: photo, scaledSize: new google.maps.Size(50, 50) }
    });
    let content = " bu " + name;
    this.addInfoWindow(marker, content);
  }
  addInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content,
      maxWidth: 200
    });
    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  scrollToTop()  {
    this.myContent.scrollToTop()
   
  }
  
}
