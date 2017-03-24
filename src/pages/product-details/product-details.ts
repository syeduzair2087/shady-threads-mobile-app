import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { CartServices } from '../../services/cart-services';
import { LoginServices } from '../../services/login-services'

/*
  Generated class for the ProductDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html'
})
export class ProductDetailsPage {
  categoryPrefs: Array<any>;
  product: any;
  quantity: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private cartServices: CartServices, private loginServices: LoginServices) {
    this.categoryPrefs = navParams.get('prefs');
    this.product = navParams.get('product');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  clickAddToCart() {
    // console.log((<HTMLInputElement>document.getElementById('select_color')).querySelector('.select-text').innerHTML);
    // console.log(this.quantity);
    if (this.loginServices.getLoginState()) {
      let OrderPrefs = [];

      OrderPrefs.push({
        pref_title: 'Quantity',
        // pref_value: (<HTMLInputElement>document.getElementById('select_quantity')).value
        pref_value: this.quantity
      })

      OrderPrefs.push({
        pref_title: 'Color',
        pref_value: (<HTMLInputElement>document.getElementById('select_color')).querySelector('.select-text').innerHTML
      });

      this.categoryPrefs.forEach((pref) => {
        OrderPrefs.push({
          pref_title: pref.pref_title,
          pref_value: (<HTMLInputElement>document.getElementById('select_' + pref.pref_title)).querySelector('.select-text').innerHTML
        });
      });

      let cartItem = {
        order_title: this.product.product_name,
        order_prefs: OrderPrefs
      }

      // this.cartServices.searchIfExists(cartItem);
      this.cartServices.addToCart(cartItem);
    }

    else {
      this.alertCtrl.create({
        title: 'Error',
        message: 'You need to login before you can add items to cart.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      }).present();
    }
  }
}
