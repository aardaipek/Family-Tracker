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

  constructor(
    private navCtrl: NavController,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router:Router
  ) {}

  ngOnInit() {
    
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
    this.authService.loginUser("test@test.com","123456").then(
      res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward("/tabs/tab1");
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }
  goToRegisterPage() {
    this.navCtrl.navigateForward("/register");
  }
  goToOtherPage() {
    this.navCtrl.navigateForward("/dashboard");
  }
}
