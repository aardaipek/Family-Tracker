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

// Minimum güncelleme uzaklığı --200 Metre Civarı
const MINIMUM_DISTANCE =  0.00300;

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
  memberAuthLoc: any[] = [];
  sayac = 0;

public lastLocation = {
  lat:Number(0),
  lng:Number(0)
}

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
      this.loadMap(user.photoURL, user.displayName, user.uid);
      this.sendLocationMember(user.uid);
      if (user) {
        this.membersOfUser();
      } else {
      }
    });
  }

  ionViewWillLeave() {
    console.log('leave page')
    //başka bir tab sayfası açıldığı zaman interval işlemi iptal edilecek yada unsubscribe() olacak
  }

  GetParentUid(uid) {
    return firebase
      .database()
      .ref("/Users/relations/")
      .child(uid)
      .once("value");
  }

  sendLocationMember(uid: any) {
// Eğer son gönderilen lokasyon 0 değilse ve minimum güncelleme mesafesinden uzak ise lokasyonu veri tabanına gönder.
   //let watch = this.geo.watchPosition();
  //   watch.subscribe(data => {
    let options = {enableHighAccuracy: true}
  setInterval(() => {
    this.geo.getCurrentPosition(options).then(data => {
      if(this.lastLocation.lat != 0  || this.lastLocation.lng != 0){
       let lat = parseFloat(data.coords.latitude.toFixed(5))
        let lng =  parseFloat(data.coords.longitude.toFixed(5))
          if(!this.isDifferent(lat,lng)){
            this.updateLocation(data.coords,uid);
          }
     }else{
          this.updateLocation(data.coords,uid);
    }
  });
},5000);
  }

  //Güncellemek için minimum değeri aştığını döndürür
  isDifferent(lat,lng){
    let distance = this.calculate(
      this.lastLocation.lat,
      this.lastLocation.lng,
      lat,
      lng,
    );

    let diff = distance >= MINIMUM_DISTANCE
    return  diff

  }

  updateLocation(data:Coordinates,uid:String){
    this.GetParentUid(uid).then(result => {
      let parentUID = result.val();
      if(data.accuracy <= 80){
        if (parentUID != null || parentUID != undefined) {
          this.memberUpdateLocation(parentUID,uid,data)
        } else {
          this.subscribedUpdateLocation(data,uid)
        }
      }
    });
  }

  timer(){
    setInterval(this.sendLocationMember,2000)
  }

  subscribedUpdateLocation(data:Coordinates,uid:String){
    this.dbs
    .list("/Users/subscribed/" + uid + "/locations")
    .snapshotChanges()
    .subscribe(() => {
      this.lastLocation.lat = parseFloat(data.latitude.toFixed(5))
      this.lastLocation.lng =  parseFloat(data.longitude.toFixed(5))
      firebase
        .database()
        .ref("/Users/subscribed/" + uid + "/locations")
        .update({
          lat: parseFloat(data.latitude.toFixed(5)),
          lng: parseFloat(data.longitude.toFixed(5)),
          accuracy: parseFloat(data.accuracy.toFixed(5)),
          speed: data.speed,
          heading: data.heading
          /* lat: parseFloat(this.curLat),
          lng: parseFloat(this.curLng) */
        });

    });
  }

  memberUpdateLocation(parentUID:any,uid:any,data:Coordinates){
    this.dbs
    .list(
      "/Users/subscribed/" +
        parentUID +
        "/members/" +
        uid +
        "/locations"
    )
    .snapshotChanges()
    .subscribe(item => {
    this.lastLocation.lat = parseFloat(data.latitude.toFixed(5))
    this.lastLocation.lng =  parseFloat(data.longitude.toFixed(5))
      firebase
        .database()
        .ref(
          "/Users/subscribed/" +
            parentUID +
            "/members/" +
            uid +
            "/locations"
        )
        .update({
         lat: parseFloat(data.latitude.toFixed(5)),
         lng: parseFloat(data.longitude.toFixed(5)) ,
         accuracy: data.accuracy,


          /* lat: parseFloat(this.curLat),
          lng: parseFloat(this.curLng) */
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

  loadMap(photo: string, name: string, uid:any) {
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
        // this.memberAuthMarker(this.map)
         this.marker(this.map, name, photo, uid);
        this.memberMarker(this.map);
      },
      err => {
        console.log("error", err)
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

  // auth olan ADMIN marker
  marker(map: any, name: string, photo: string, uid:any) {
    this.dbs
      .list("/Users/subscribed/" + uid + "/locations")
      .snapshotChanges()
      .subscribe(items => {
        let container = {
          lat: 0,
          lng: 0
        };
        items.forEach(item => {
          if (item.key == "lat") {
            container.lat = item.payload.toJSON() as number;
          } else if (item.key == "lng") {
            container.lng = item.payload.toJSON() as number;
          }
        });
        if (this.membersLoc.length > 0) {
          let lastLocationlat = this.adminLoc[this.adminLoc.length - 1].lat;
          let lastLocationlng = this.adminLoc[this.adminLoc.length - 1].lng;
          let distance =Math.sqrt((container.lat - lastLocationlat) * (container.lat - lastLocationlat) + (container.lng - lastLocationlng) * (container.lng - lastLocationlng))
          if((container.lat == lastLocationlat) && (container.lng == lastLocationlng)) {
            return distance = 0
          }else if(((container.lat - lastLocationlat) >= 200 || (container.lng - lastLocationlng) >= 200 ) || distance > MINIMUM_DISTANCE){
            console.log("fark 200")
              this.adminLoc.push(container);
              this.adminLoc.shift()
          }

        }else if(this.adminLoc.length > 2) {
          this.adminLoc.shift()
        }else {
              this.adminLoc.push(container);
        }
        let marker = new google.maps.Marker({
                   map: map,
                   clickable: true,
                   position: map.getCenter(),
                   icon: this.ico
                 });
      });
  }

  memberMarker(map: any) {
    this.dbs
      .list("/Users/subscribed/" + this.uid + "/members")
      .snapshotChanges()
      .subscribe(items => {
        let container = {
          lat: 0,
          lng: 0,
          icon: {
            url: "",
            scaledSize: { width: 50, heigth: 50 }
          },
          email: ""
        };
        items.forEach(item => {

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
             let filtered = this.getFilteredLocations(container.email)
             let lastLocation = filtered[filtered.length - 1];
             let distance =Math.sqrt((container.lat - lastLocation.lat) * (container.lat - lastLocation.lat) + (container.lng - lastLocation.lng) * (container.lng - lastLocation.lng))

             if((container.lat == lastLocation.lat) && (container.lng == lastLocation.lng2)) {
              return distance = 0
            }else if((container.lat - lastLocation.lat) >= 200 || (container.lng - lastLocation.lng) >= 200 ){
              console.log("fark 200")
                this.membersLoc.push(container);
            }

          }else if(this.membersLoc.length > 2) {
            this.membersLoc.shift()
          }else {
                this.membersLoc.push(container);
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

  /*  memberAuthMarker(map :any) {
    this.GetParentUid(this.uid).then(result => {
    let parentUID = result.val();
      this.dbs.list('/Users/subscribed/' + parentUID + '/members/' + this.uid + '/locations').snapshotChanges().subscribe(item => {
        var container = {
          lat: 0,
          lng: 0,
          icon: {
            url: "",
            scaledSize: { width: 50, heigth: 50 }
          },
          email: ""
        }
        item.forEach(items => {

          let photo = items.payload.child("photoUrl").toJSON() as string;
          container.icon.url = photo;
          let mail = items.payload.child("email").toJSON() as string;
            container.email = mail;
          item.forEach(element => {
            if (element.key === "lat") {
              container.lat = element.payload.toJSON() as number
            }
            else if (element.key === "lng") {
              container.lng = element.payload.toJSON() as number
            }
          })
          if (this.memberAuthLoc.length > 1) {
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
                if (this.memberAuthLoc.length >= 3) {
                  console.log(2);
                  this.memberAuthLoc.shift();
                  this.memberAuthLoc.push(container);
                } else {
                  console.log(3);

                  this.memberAuthLoc.push(container);
                }
              }
            } else {
              this.memberAuthLoc.push(container);
            }
          } else {
            this.memberAuthLoc.push(container);
            console.log("else 2 =>>");
          }
        })

        })

      for (let i = 0; i < this.memberAuthLoc.length; i++) {
        let marker = new google.maps.Marker({
          map: map,
          clickable: true,
          position: this.memberAuthLoc[i],
          icon: {
            url: this.memberAuthLoc[i].icon.url,
            scaledSize: new google.maps.Size(40, 40)
          }
        });
      }
    })

  } */

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
