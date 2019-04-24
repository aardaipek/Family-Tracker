import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { Router } from '@angular/router';
import * as firebase from "firebase";


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  title = "Giriş";
  email: string;
  password: string;
  validations_form: FormGroup;
  errorMessage: string = "";
  userMail:string;
  

  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router:Router
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("user bu",user)
      } else {
        console.log("user yok")
      }
    });
   
    
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      )
    });

    
  } 
    
  validation_messages = {
    email: [
      { type: "required", message: "Email gerekli" },
      { type: "pattern", message: "Geçerli bir email adresi yazınız" }
    ],
    password: [
      { type: "required", message: "Parola gerekli" },
      {
        type: "minlength",
        message: "Parola 5 karakterden uzun olmalı"
      }
    ]
  };

  loginUser() {
    this.authService.loginUser(this.email,this.password).then(
      res => {
        //this.errorMessage = "";
        this.router.navigate(['tabs'])
        console.log(res);
      },
      err => {
        this.errorMessage = err.message;
      }
      
    );
  }
  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }
  goToRegisterPage() {
    this.navCtrl.navigateForward("/register");
    
  }
  goToOtherPage() {
    this.navCtrl.navigateForward("/dashboard");
  }
}
