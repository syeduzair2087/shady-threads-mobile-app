import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import { Page1 } from '../pages/page1/page1';
// import { Page2 } from '../pages/page2/page2';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { CategoriesPage } from '../pages/categories/categories';
import { CartPage } from '../pages/cart/cart';
import { AccountPage } from '../pages/account/account'

import { LoginServices } from '../services/login-services'
import { ProductServices } from '../services/product-services'
import { AccountServices } from '../services/account-services'

import { FirebaseAuthState } from 'angularfire2'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  isLoggedIn: boolean;
  imageSource: string;
  userName: string;

  @ViewChild(Nav) nav: Nav;

  // rootPage: any = CategoriesPage;
  rootPage: any = CategoriesPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    private loginServices: LoginServices,
    private productServices: ProductServices,
    private accountServices: AccountServices,
    private alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'Page One', component: Page1 },
      // { title: 'Page Two', component: Page2 },
      // { title: 'Login', component: LoginPage },

      { title: 'Products', component: CategoriesPage }
    ];

    this.loginServices.getLoginStateSubscription().subscribe((data) => {
      this.isLoggedIn = data;
      if(data) {
        this.accountServices.getUserData().then((data: any) => {
          this.imageSource = data.photoUrl;
          this.userName = data.name;
        }).catch(() => {});
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  clickCart() {
    this.nav.setRoot({ title: 'Cart', component: CartPage }.component);
  }

  clickLogin() {
    // this.nav.setRoot({ title: 'Login', component: LoginPage }.component);
    let alertLogin = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'txtEmail',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'txtPassword',
          type: 'password',
          placeholder: 'Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Login',
          handler: (data) => {
            this.loginServices.loginUser(data.txtEmail, data.txtPassword).catch(() => {});
          }
        }
      ]
    });
    alertLogin.present();
  }

  clickRegister() {
    this.nav.setRoot({ title: 'Sign Up', component: RegisterPage }.component);
  }

  clickAccount() {
    this.nav.setRoot({ title: 'Account Settings', component: AccountPage }.component);
  }

  clickLogout() {
    this.loginServices.logoutUser();
    this.nav.setRoot({ title: 'Categories', component: CategoriesPage }.component);
  }
}
