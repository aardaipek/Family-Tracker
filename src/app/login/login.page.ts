import { ToastService } from './../services/toast.service';
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
    public router:Router,
    private toast:ToastService
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.router.navigateByUrl('/tabs')
        console.log("log user =>",user)
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
        Validators.compose([Validators.minLength(4), Validators.required])
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
        this.toast.loginWelcomeToast(this.email);
        console.log(res);
      },
      err => {
        this.errorMessage = err.message;
      }
      
    );
  }
 
  goToRegisterPage() {
    this.navCtrl.navigateForward("/register");
    
  }

}
