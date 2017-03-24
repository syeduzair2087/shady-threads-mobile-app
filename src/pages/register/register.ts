import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { LoginServices } from '../../services/login-services'
import { AccountPage } from '../account/account';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginServices: LoginServices, private toastCtrl: ToastController, private appCtrl: App) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  clickRegister(Name: string, Email: string, Password: string) {
    this.loginServices.registerUser(Email, Password, Name).then((success) => {
      this.appCtrl.getActiveNav().setRoot({title: 'Account Settings', component: AccountPage}.component);
    }).catch((err) => {})
  }
}
