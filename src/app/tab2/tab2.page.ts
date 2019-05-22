import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { ToastService } from "./../services/toast.service";

declare var google;
@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  title = "Locations";
  constructor(
    public alertController: AlertController,
    public dbs: AngularFireDatabase,
    public geo: Geolocation,
    public actionSheet: ActionSheetController,
    private toast: ToastService,
    private f: ChangeDetectorRef
  ) {}

  curLat:  any;
  curLng:  any;
  uid:     string;
  areaLat: any;
  areaLng: any;
  parentUID: string;
  userName: string;
  userPhoto: string;
  areaName: string;
  clickEvent: any;
  areaUniqueKey:any;
  area:      any[] = [];
  buttons:   any[] = [];
  selectedUser: string = "Seçili Yok";
  savedArea: any[] = [];
  areaLoc:   any[] = [];
  adminLoc:  any[] = [];
  id: number;
  ico = new google.maps.MarkerImage(
    "https://res.cloudinary.com/durky4ga0/image/upload/v1438339086/marker_plnomd.png"
  );

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.uid = user.uid;
      this.loadMap(user.photoURL, user.displayName);
      if (user) {
        this.getUserArea();
        //this.sendLocationMember(user.uid);
        this.getUserAreaLocation();
      } else {
      }
    });
  }

  //parametre almalı
  areaDelete() {
    /*   firebase.database().ref("/Users/subscribed/" + this.uid+ "/areas").once('value').then((snapshot)=>{
       snapshot.forEach(item => {
        let data = {
          aName: "",
         }
         let name = item.child("name").toJSON() as string
         data.aName = name
         this.aa.push(data)
       })
       for(let i = 0; i< this.savedArea.length;i++){
        console.log(this.savedArea[i].username)
       }
       console.log(this.aa)
     }) */

    let area = firebase
      .database()
      .ref("/Users/subscribed/" + this.uid + "/areas/");
    area
      .remove()
      .then(() => {
        console.log("success!");
      })
      .catch(err => {
        console.log("errorcode", err.code);
      });
  }

  getUserAreaLocation() {
    this.dbs
      .list("/Users/subscribed/" + this.uid + "/areas")
      .snapshotChanges()
      .subscribe(items => {
        items.forEach(item => {
          let container = {
            lat: 0,
            lng: 0
          };
          let child = item.payload.child("locations");
          child.forEach(element => {
            if (element.key == "lat") {
              container.lat = element.toJSON() as number;
            } else if (element.key == "lng") {
              container.lng = element.toJSON() as number;
            }
          });
          this.areaLoc.push(container);
        });
      });
  }

  getUserArea() {
    firebase
      .database()
      .ref("/Users/subscribed/" + this.uid + "/areas")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(items => {
          let containerData = {
            email: "",
            username: ""
          };
          let email = items.child("user").toJSON() as string;
          let memberUserName = items.child("name").toJSON() as string;
          containerData.email = email;
          containerData.username = memberUserName;
          this.savedArea.push(containerData);
        });
      });
  }

  selectUserActionSheet() {
    this.dbs
      .list("/Users/subscribed/" + this.uid + "/members")
      .snapshotChanges()
      .subscribe(items => {
        let container = [];
        items.forEach(item => {
          let email = item.payload.child("email").toJSON() as string;
          let areaName = item.payload.child("name").toJSON() as string;
          container.push({
            text: email,
            icon: "person",
            handler: this.onButtonClick.bind(this, email)
          });
        });
        this.buttons = container;
        this.showActionsheet();
      });
  }

  onButtonClick(value): any {
    this.selectedUser = value;
    this.updateArea(this.areaName, this.selectedUser);
  }

  updateArea(areaName: string, name: string) {
    let area = firebase
      .database()
      .ref("/Users/subscribed/" + this.uid + "/areas/");
    this.map.addListener("click", event => {
      this.clickEvent = event.latLng.toJSON();
      let lat = this.clickEvent["lat"];
      let lng = this.clickEvent["lng"];
      this.areaLat = lat;
      this.areaLng = lng;
      // let area = firebase.database().ref("/Users/subscribed/" + this.uid + "/areas/").push({ lat: lat, lng: lng });
      // this.areaUniqueKey = area.key;
      this.placeMarkerAndPanTo(this.clickEvent, this.map, areaName);
    });
    area.push({
      lat: this.areaLat,
      lng: this.areaLng,
      name: areaName,
      user: name
    });
    this.toast.areaNotificationToast(areaName);
    this.f.detectChanges();
  }


//MAP CİRCLE
  mapClick() {
    this.map.addListener("click", event => {
      this.clickEvent = event.latLng.toJSON();
      let lat = this.clickEvent["lat"];
      let lng = this.clickEvent["lng"];
      this.areaLat = lat;
      this.areaLng = lng;

      this.placeMarkerAndPanTo(this.clickEvent, this.map, this.areaName);
    });
  }

  //Kullanılmıyor
  photoUrl(uid) {
    return firebase
      .database()
      .ref("/Users/subscribed/" + uid)
      .child("photoUrl")
      .once("value");
  }

  GetParentUid(uid) {
    return firebase
      .database()
      .ref("/Users/relations/")
      .child(uid)
      .once("value");
  }

  loadMap(photo: string, name: string) {
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

        this.mapClick();
        this.marker(this.map, name, photo);
      },
      err => {
        alert(JSON.stringify(err));
      }
    );
  }
  //çizilmiş bir circle üzerinde yeni bir marker çizmiyor
  placeMarkerAndPanTo(latLng, map, areaALiasName) {
    var markers = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
    this.circle(latLng, this.uid);
    let content = "Bölge Adı :" + areaALiasName;
    this.addInfoWindow(markers, content);
  }

  circle(latlng: any, uid: any) {
    let circle = new google.maps.Circle({
      strokeColor: "#f9ad4f",
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: "#fbc96d",
      fillOpacity: 0.4,
      map: this.map,
      center: latlng,
      radius: 150 //yarıçap
    });
  }

  marker(map: any, name: string, photo: string) {
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      //icon: { url: photo, scaledSize: new google.maps.Size(50, 50) }
      icon: this.ico
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

  async createAlert() {
    const alert = await this.alertController.create({
      message: "Location service unavailable",
      buttons: ["OK"]
    });

    await alert.present();
  }
  
  async createAlertError() {
    const alert = await this.alertController.create({
      message: "Location service is not available",
      buttons: ["OK"]
    });

    await alert.present();
  }

  async showActionsheet() {
    const actionSheet = await this.actionSheet.create({
      header: "Kullanıcılar",
      buttons: this.buttons
    });
    await actionSheet.present();
  }
}
