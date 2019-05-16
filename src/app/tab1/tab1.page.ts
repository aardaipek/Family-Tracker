import { ToastService } from "./../services/toast.service";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { AuthService } from "./../services/auth.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { IonContent } from "@ionic/angular";
import * as _ from "lodash";

declare var google;

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild(IonContent, { read: IonContent }) myContent: IonContent;

  @ViewChild("map") mapElement: ElementRef;
  map: any;
  clickEvent: any;
  curLat: any;
  curLng: any;
  parentUID: string;
  areaUniqueKey: any;

  title = " Family Home";
  mail: string;
  userName: string;
  uid: string;
  userMail: string;
  membersLoc: any[] = [];
  membersData: any[] = [];
  adminLoc: any[] = [];
  icon: string;
  ico = new google.maps.MarkerImage(
    "https://res.cloudinary.com/durky4ga0/image/upload/v1438339086/marker_plnomd.png"
  );
  sayac = 0;
  constructor(
    public alertController: AlertController,
    public dbs: AngularFireDatabase,
    private navCtrl: NavController,
    private authService: AuthService,
    private Diagnostic: Diagnostic,
    private toast: ToastService,
    public geo: Geolocation
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.uid = user.uid;
      this.loadMap(user.photoURL, user.displayName);
      if (user) {
        this.membersOfUser();
        this.sendLocationMember(user.uid);
      } else {
      }
    });
    /*  this.Diagnostic.getBluetoothState()
      .then(state => {
        if (state == this.Diagnostic.bluetoothState.POWERED_ON) {
          this.toast.monthlySubToast("Açık");
        } else {
          this.toast.monthlySubToast("Kapalı");
        }
      })
      .catch(e => console.error(e)); */
    /*  */
  }
  GetParentUid(uid) {
    return firebase
      .database()
      .ref("/Users/relations/")
      .child(uid)
      .once("value");
  }

  //TODO : member photo ve location sorunları giderilmeli
  sendLocationMember(uid: any) {
    this.geo.watchPosition().subscribe(data => {
      this.GetParentUid(uid).then(result => {
        this.parentUID = result.val();
        if (this.parentUID != null || this.parentUID != undefined) {
          this.dbs.list("/Users/subscribed/" +this.parentUID +"/members/" +uid +"/locations").snapshotChanges().subscribe(item => {
            firebase.database().ref("/Users/subscribed/" +this.parentUID +"/members/" +uid +"/locations" )
            .update({
                  /*  lat: parseFloat(data.coords.latitude.toFixed(5)),
                  lng: parseFloat(data.coords.longitude.toFixed(5)) */
                  lat: parseFloat(this.curLat.toFixed(5)),
                  lng: parseFloat(this.curLng.toFixed(5))
                });
            });
        } else {
          this.dbs.list("/Users/subscribed/" + uid + "/locations").snapshotChanges().subscribe(item => {
              firebase.database().ref("/Users/subscribed/" + uid + "/locations")
              .update({
                  /*  lat: parseFloat(data.coords.latitude.toFixed(5)),
                  lng: parseFloat(data.coords.longitude.toFixed(5)) */
                  lat: parseFloat(this.curLat.toFixed(5)),
                  lng: parseFloat(this.curLng.toFixed(5))
                });
            });
        }
      });
    });
  }
  membersOfUser() {
    firebase
      .database()
      .ref("/Users/subscribed/" + this.uid + "/members")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(items => {
          let containerData = {
            photo: "",
            email: "",
            username: ""
          };
          let email = items.child("email").toJSON() as string;
          let photo = items.child("photoUrl").toJSON() as string;
          let memberUserName = items.child("username").toJSON() as string;
          containerData.photo = photo;
          containerData.email = email;
          containerData.username = memberUserName;
          this.membersData.push(containerData);
        });
      });
  }

  memberAdd() {
    if (this.mail == null) {
      this.errAlert();
    } else {
      this.authService.inviteUser(this.mail);
      this.memberAddAlert(this.mail);
    }
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
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          clear: true
        };
        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );

        this.marker(this.map, name, photo);
        this.memberMarker(this.map);
      },
      err => {
        alert(JSON.stringify(err));
      }
    );
  }

  getFilteredLocations(email: String) {
    return _.filter(this.membersLoc, container => container.email === email);
  }
  calculate(lat1, lng1, lat2, lng2) {
    return Math.sqrt(
      (lat1 - lat2) * (lat1 - lat2) + (lng1 - lng2) * (lng1 - lng2)
    );
  }

  marker(map: any, name: string, photo: string) {
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      // icon: { url: photo, scaledSize: new google.maps.Size(50, 50) }
      icon: this.ico
    });
    let content = " bu " + name;
    this.addInfoWindow(this.marker, content);
  }

  memberMarker(map: any) {
    this.dbs
      .list("/Users/subscribed/" + this.uid + "/members")
      .snapshotChanges()
      .subscribe(items => {
        items.forEach(item => {
          let container = {
            lat: 0,
            lng: 0,
            icon: {
              url: "",
              scaledSize: { width: 50, heigth: 50 }
            },
            email: ""
          };
          let photo = item.payload.child("photoUrl").toJSON() as string;
          container.icon.url = photo;
          let mail = item.payload.child("email").toJSON() as string;
          container.email = mail;
          let child = item.payload.child("locations");
          child.forEach(element => {
            if (element.key == "lat") {
              container.lat = element.toJSON() as number;
            } else if (element.key == "lng") {
              container.lng = element.toJSON() as number;
            }
          });
          if (this.membersLoc.length > 1) {
            let filtered = this.getFilteredLocations(container.email);
            console.log("filtered", filtered.length);
            if (filtered.length != 0) {
              let lastLocation = filtered[filtered.length - 1];
              let distance = this.calculate(
                container.lat,
                container.lng,
                lastLocation.lat,
                lastLocation.lng
              );
              console.log("distance", distance);

              if (distance >= 0.00019) {
                console.log(1);
                if (this.membersLoc.length >= 3) {
                  console.log(2);
                  this.membersLoc.shift();
                  this.membersLoc.push(container);
                } else {
                  console.log(3);

                  this.membersLoc.push(container);
                }
              }
            } else {
              this.membersLoc.push(container);
            }
          } else {
            this.membersLoc.push(container);
            console.log("else 2 =>>");
          }
        });
        for (let i = 0; i < this.membersLoc.length; i++) {
          let marker = new google.maps.Marker({
            map: map,
            clickable: true,
            position: this.membersLoc[i],
            icon: {
              url: this.membersLoc[i].icon.url,
              scaledSize: new google.maps.Size(40, 40)
            }
          });
        }
      });
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
  scrollToTop() {
    this.myContent.scrollToTop();
  }
  goToDashboard() {
    this.navCtrl.navigateForward("/dashboard");
  }
  goToMap() {
    this.navCtrl.navigateForward("/home");
  }
}
