import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";



@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  title = " Family Home";
  mail:string;
  userName:string;

  constructor(public alertController: AlertController,private navCtrl: NavController) {}

  ngOnInit() {}

  goToDashboard() {
    this.navCtrl.navigateForward("/dashboard");
  }
  goToMap() {
    this.navCtrl.navigateForward('/home')
  }

  memberAdd(){
    if(this.mail == null || this.userName ==null){
      this.errAlert()
    }else{
      this.memberAddAlert(this.mail);
    }
    
  }

  async errAlert(){
    const alert = await this.alertController.create({
      message: "Mail adresi ve kullanıcı adı boş bırakılmaz" ,
      buttons: ["OK"]
    });

    await alert.present();
  }

  async memberAddAlert(mail:string) {
    const alert = await this.alertController.create({
      message: "Davetiyeniz  " +  mail + " adresine gönderildi" ,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
