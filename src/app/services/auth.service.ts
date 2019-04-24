import { Injectable } from "@angular/core";
import { User } from "firebase";
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: User;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private storage: Storage,
    private plt: Platform
  ) {
    
      this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(this.user.email));
        console.log(this.user.email)
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

  update(value) {

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
