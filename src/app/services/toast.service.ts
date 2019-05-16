import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }


  async loginWelcomeToast(text:string) {
    const toast = await this.toastController.create({
      message: 'Hoşgeldin ' +text,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  async resetPasswordToast(text:string) {
    const toast = await this.toastController.create({
      message: 'Şifre sıfırlamak için gerekenler  ' +text+ ' adresine gönderildi.',
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  async monthlySubToast(text:string) {
    const toast = await this.toastController.create({
      message: 'Satın almanız için teşekkür ederiz. ' +text+ '. Aboneliğiniz başlamıştır',
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }
  async notLoginToast() {
    const toast = await this.toastController.create({
      message: 'Önce giriş yapmalısınız',
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  async updateProfileToast() {
    const toast = await this.toastController.create({
      message: 'Yaptığınız değişiklikler kaydedildi ',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  async areaNotificationToast(text:string) {
    const toast = await this.toastController.create({
      message: 'Belirlediğiniz bölge "' +text+ '" adıyla eklenmiştir',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
