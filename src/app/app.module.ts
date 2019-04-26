import { AuthService } from './services/auth.service';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { environment } from "../environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from "@angular/fire/auth"; 
import { IonicStorageModule  } from '@ionic/storage';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { BatteryStatus } from "@ionic-native/battery-status/ngx";
import { ReactiveFormsModule } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    
    

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    Diagnostic,
    BatteryStatus,
    AuthService,
    Camera
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
