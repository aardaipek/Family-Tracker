import { Router } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from "@ionic/angular";

declare var google;

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  constructor(
    public alertController: AlertController,
    public geo: Geolocation,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMap();
  }
  curLat: any;
  curLng: any;
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

  route() {
    this.router.navigateByUrl('tabs/tab1')
  }
}
