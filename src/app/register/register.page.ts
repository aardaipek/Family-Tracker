import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import * as firebase from "firebase";
import { AngularFireDatabase } from "@angular/fire/database";



@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  title = "Sign Up";
  email: string;
  password: string;
  userName:string;
  parentUid: any;
  parentsUid:any;

  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";

  validation_messages = {
    email: [
      { type: "required", message: "Email is required." },
      { type: "pattern", message: "Enter a valid email." }
    ],
    password: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long."
      }
    ]
  };

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public dbs: AngularFireDatabase,

  ) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });

    
  }
  postUid(uid,parentUid) {
    return firebase.database().ref("/Users/relations/" + uid).set(parentUid)
 }

  tryRegister(value){
  
    this.authService.registerUser(value)
     .then(res => { 
    /*   firebase.auth().onAuthStateChanged(user => {
        this.dbs.list("/Users/subscribed/").snapshotChanges().subscribe(items=>{
          items.forEach(item=>{
            let container = {
              uid:"",
              email:""
            }

           container.uid = item.key as string
           container.email = item.payload.child("members").child(user.uid).child("email").toJSON() as string
           this.parentsUid.push(container)
            console.log(container.email)
           if(user.email === item.payload.child("members").child(user.uid).child("email").toJSON()) {
              for (let i = 0; i <1000000; i++) {
   
                this.parentUid = this.parentsUid[i].uid
                this.postUid(user.uid,this.parentUid)
            
              }
          }   
          })
        })

       }) */
     
  
     
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }
 
  goLoginPage(){
    this.navCtrl.navigateBack('');
  }
}
