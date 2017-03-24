import { Component } from '@angular/core';
import { App, NavController, NavParams, ToastController, Nav, Platform } from 'ionic-angular';
import { LoginServices } from '../../services/login-services'
import { CategoriesPage } from '../categories/categories';


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loginServices: LoginServices, private toastCtrl: ToastController, private appCtrl: App) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  clickLogin(Email: string, Password: string) {
    this.loginServices.loginUser(Email, Password).then((success) => {
      // let toast = this.toastCtrl.create({
      //   message: 'Login Successful!',
      //   duration: 3000
      // });
      // toast.present();
      this.appCtrl.getRootNav().setRoot(({ title: 'Categories', component: CategoriesPage }).component);
    }).catch((err) => {
      // let toast = this.toastCtrl.create({
      //   message: 'Login Failed!',
      //   duration: 3000
      // });
      // toast.present();
    })
  }
}
