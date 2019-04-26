import { ToastService } from './toast.service';
import { Injectable } from "@angular/core";
import { User } from "firebase";
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";
import * as firebase from 'firebase/app';
import { AnyTxtRecord } from 'dns';
import { snapshotChanges } from '@angular/fire/database';



@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: User;
email:string;
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private storage: Storage,
    private plt: Platform,
    private toast: ToastService
  ) {  }

  

 isLogged(){
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(this.user.email));
        console.log("*AuthService*login olan user maili: ",this.user.email)
      } else {
        localStorage.setItem("user", null);
      }
    });  
  }   

  registerUser(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
   }
   loginUser(email: string, password: string): Promise<firebase.auth.UserCredential>{
   return firebase.auth().signInWithEmailAndPassword(email,password)
   
   /*  return new Promise<any>((resolve, reject) => {
      
      .then(
        res => resolve(res)
       ).catch(
        err => reject(err)
        )
    }) */
   }
   logoutUser(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          console.log("LOG Out");
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }
 
  addProfilePhoto(photo:string) {
      firebase.auth().currentUser.updateProfile({
        photoURL : photo
      }).then(() => {
        this.toast.updateProfileToast()
      }).catch((error) => {
        return error;
      })
      firebase.storage().ref('/pp/'+new Date().toISOString()).putString(photo, 'data_url')

      
  }

 

  update(userName:string,)  {
    firebase.auth().currentUser.updateProfile({
      displayName:  userName,
    }).then(() => {
      console.log("başarılı")
      this.toast.updateProfileToast()
    }).catch((error) => {
      return error;
    })
  }
  
  resetPass(email:string) {
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        console.log( "kullanıcı var")
      }else {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve()
        }).catch((error) => {
          reject();
        })
      }
    })
  }


  

  /* async Login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(["tabs"]);
    } catch (e) {
      alert("Error!" + e.message);
    }
  }

  async Logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }

  async SignUp(email: string, password: string) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.router.navigate(["login"]);
    } catch (e) {
      alert("Error!" + e.message);
    }
  } */
}
