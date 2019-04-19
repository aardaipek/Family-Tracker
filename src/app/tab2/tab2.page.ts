import { Component, ViewChild, ElementRef  } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from "firebase";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from '@ionic/angular';

declare var google;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  title = "Locations"
  constructor( 
    public alertController: AlertController,
    public dbs: AngularFireDatabase,
    public geo: Geolocation,
    private statusBar: StatusBar
    ){}

    curLat: any;
  curLng: any;

    ngOnInit() {
      this.loadMap();
      
    }
    loadMap() {
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
        },
        err => {
          alert(JSON.stringify(err));
        }
      );
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
