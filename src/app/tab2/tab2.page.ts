import { Component, ViewChild, ElementRef } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { container } from '@angular/core/src/render3';


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
    public actionSheet: ActionSheetController
  ) {}

  curLat: any;
  curLng: any;
  uid: string;
  userName: string;
  userPhoto: string;
  areaName: string;
  clickEvent: any;
  areaUniqueKey:any;
  area:any[] = [];

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.uid = user.uid;
      this.loadMap(user.photoURL, user.displayName);
      if (user) {
        this.sendLocation(user.uid);
      } else {
      }
    });
  }

 
 

  async selectUserActionSheet() {
    let userEmail:string;
   //TODO: firebaseden kullanıcılar çekilip gösterilecek

   //kullanıcıları çekme
   this.dbs.list("/Users/subscribed/" + this.uid+ "/areas").snapshotChanges().subscribe(items => {
    items.forEach(item => {
      let container = {
        areaName:"",
        email:"",
        username: ""
      }
      let email = item.payload.child("email").toJSON() as string
      let areaName = item.payload.child("name").toJSON() as string
      container.areaName = areaName
      container.email = email
      userEmail = container.email;
      this.area.push(container)
    })
    })
 
 
    const actionSheet = await this.actionSheet.create({
      header: 'Kullanıcılar',
      buttons: [
        {
        text: userEmail,
        icon: 'person',
        handler: () => {
       
        }
      }, 
    ]
    });
    await actionSheet.present();
  }

  //Kullanılmıyor
  photoUrl(uid) {
    return firebase
      .database()
      .ref("/Users/subscribed/" + uid)
      .child("photoUrl")
      .once("value");
  }
  sendLocation(uid: any) {
    this.geo.watchPosition().subscribe(data => {
      this.dbs
        .list("/Users/subscribed/" + uid + "/locations")
        .snapshotChanges()
        .subscribe(item => {
          firebase
            .database()
            .ref("/Users/subscribed/" + uid + "/locations")
            .update({ lat: data.coords.latitude, lng: data.coords.longitude });
        });
    });
  }

  /* updateLocation(x: any, y: any, uid:any) {
      firebase.database().ref('/Users/subscribed/'+ uid + '/locations').update({ lat: x, lng: y })
      let userLoc = this.dbs.list('/Users/subscribed/'+ uid + '/locations')
          userLoc.snapshotChanges().subscribe(item => {
            let xlat;
            let ylng;
            let jsonObject ={x:0,y:0};
            item.forEach(element => {
              if(element.key === "lat") {
              xlat = element.payload.toJSON()
              }else if(element.key === "lng") {
                ylng = element.payload.toJSON()
              }
            })
            jsonObject.x = xlat;
            jsonObject.y = ylng
          })
    } */
  /* addArea(areaName:string) {
      firebase
      .database()
      .ref('/Users/subscribed/'+ this.uid + '/areas')
      .update({lat: , lng: , name: areaName})
}  */

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
        
          this.map.addListener("click", event => {
            this.clickEvent = event.latLng.toJSON()
            let lat = this.clickEvent['lat']
            let lng = this.clickEvent['lng']
            let area = firebase.database().ref('/Users/subscribed/' + this.uid + '/areas/').push({ lat: lat, lng: lng })
            this.areaUniqueKey = area.key
    
            this.placeMarkerAndPanTo(this.clickEvent, this.map);
          });
        this.marker(this.map, name, photo);
      },
      err => {
        alert(JSON.stringify(err));
      }
    );
  }
  //çizilmiş bir circle üzerinde yeni bir marker çizmiyor
  placeMarkerAndPanTo(latLng, map) {
    var markers = new google.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
    this.circle(latLng, this.uid);
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

  updateArea(areaName:string) {
  firebase.database().ref('/Users/subscribed/' + this.uid + '/areas/'+this.areaUniqueKey).update({name: areaName})  
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
}
