import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login'
import { CategoriesPage } from '../pages/categories/categories'
import { ProductsPage } from '../pages/products/products'
import { ProductDetailsPage } from '../pages/product-details/product-details'
import { RegisterPage } from '../pages/register/register'
import { CartPage } from '../pages/cart/cart'
import { AccountPage } from '../pages/account/account'

import { LoginServices } from '../services/login-services';
import { CartServices } from '../services/cart-services';
import { ProductServices } from '../services/product-services';
import { AccountServices } from '../services/account-services';
import { HttpServices } from '../services/http-services';

import { AngularFireModule, FirebaseListObservable, AuthMethods, AuthProviders } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyDF4duDkn_s4erjcCKcQWkK4YKokPMf0T0",
  authDomain: "shady-threads.firebaseapp.com",
  databaseURL: "https://shady-threads.firebaseio.com",
  storageBucket: "shady-threads.appspot.com",
  messagingSenderId: "744250490012"
};

export const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password,
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    CategoriesPage,
    ProductsPage,
    ProductDetailsPage,
    RegisterPage,
    CartPage,
    AccountPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        scrollAssist: false, 
        autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    CategoriesPage,
    ProductsPage,
    ProductDetailsPage,
    RegisterPage,
    CartPage,
    AccountPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginServices,
    CartServices,
    ProductServices,
    AccountServices,
    HttpServices
  ]
})
export class AppModule { }
