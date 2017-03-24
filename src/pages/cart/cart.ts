import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { CartServices } from '../../services/cart-services'

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private cartServices: CartServices,
    private actionSheetController: ActionSheetController,
    private alertCtrl: AlertController) { }

  cartSubscription: any;
  cartItems: any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');

    this.cartSubscription = this.cartServices.getCartFromFirebase();
    this.cartSubscription.subscribe((data) => {
      this.cartItems = data;
    })
  }

  ionViewWillLeave() {
    if (!this.cartSubscription.closed) {
      this.cartSubscription.unsubscribe();
    }
  }

  clickItem(selectedItem: any) {
    console.log(selectedItem);
    let action = this.actionSheetController.create({
      title: 'Options',
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: 'Confirm',
              message: 'Are you sure you want to remove ' + selectedItem.order_title + ' from your cart?',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Confirm',
                  handler: () => {
                    this.cartServices.deleteFromCart(selectedItem.$key);
                  }
                }
              ]
            });
            alert.present();
          }
        },
        {
          text: 'Edit quantity',
          icon: 'clipboard',
          handler: () => {
            this.alertCtrl.create({
              subTitle: 'Enter new quantity.',
              inputs: [
                {
                  name: 'txtQuantity',
                  value: selectedItem.order_prefs[0].pref_value
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Confirm',
                  handler: (data) => {
                    let newOrderPrefs = selectedItem;
                    newOrderPrefs.order_prefs[0].pref_value = data.txtQuantity;
                    this.cartServices.updateQuantity(selectedItem.$key, newOrderPrefs)
                  }
                }
              ]
            }).present();
          }
        },
        {
          text: 'Cancel',
          icon: 'close'
        }
      ]
    });

    action.present();
  }

  clickCheckOut() {
    this.alertCtrl.create({
      subTitle: 'Are you sure you wish to place the order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.cartServices.checkoutCart().catch(() => {});
          }
        }
      ]
    }).present();
  }
}
