import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App, ToastController } from 'ionic-angular';
import { ProductServices } from '../../services/product-services'
import { HttpServices } from '../../services/http-services'
import { ProductsPage } from '../products/products'
import { LoginPage } from '../login/login'
import { Network } from 'ionic-native'
import { Observable } from 'rxjs/Observable'

/*
  Generated class for the Categories page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  connected: boolean;
  // connectSubscription: any;
  disconnectSubscription: any;
  productSubscription: any;
  products: any;
  loader: any;
  // storage: Storage = new Storage();

  constructor(public navCtrl: NavController, public navParams: NavParams, private productServices: ProductServices, private loading: LoadingController, private alertCtrl: AlertController, private appCtrl: App, private toastCtrl: ToastController, private httpServices: HttpServices) {
    this.loader = this.loading.create({
      content: 'Loading Products...',
      dismissOnPageChange: true
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');

    this.productServices.fetchProductsToStorage().then(() => {
      this.productServices.getProducts().then((data) => this.products = data).catch(() => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'No data availabe. Please check your internet connection and try again.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.appCtrl.getRootNav().setRoot({ title: 'Login', component: LoginPage }.component);
            }
          }]
        });
        alert.present();
      })
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Failed to fetch new products.',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.productServices.getProducts().then((data) => this.products = data).catch(() => {
              let alert = this.alertCtrl.create({
                title: 'Error',
                message: 'No data available. Please check your internet connection and try again.',
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.appCtrl.getRootNav().setRoot({ title: 'Login', component: LoginPage }.component);
                  }
                }]
              });
              alert.present();
            })
          }
        }]
      });
      alert.present();
    })

    // this.productServices.fetchProducts().then((data) => {
    //   this.products = data;
    // }).catch(() => {})

    // this.products = JSON.parse(localStorage.getItem('productsList'));



    // let productSubscription = this.productServices.getProducts().subscribe((data) => {
    //   this.products = data;
    //   productSubscription.unsubscribe();
    //   console.log('loaded and unsubscribed!');
    // })


    // if (Network.type !== 'none') {
    //   this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
    //     console.log('Internet Disonnected');
    //     this.appCtrl.getRootNav().setRoot({ title: 'Login', component: LoginPage }.component);
    //     let alert = this.alertCtrl.create({
    //       title: 'Error!',
    //       subTitle: 'Failed to load data. Please check your internet conection and try again.',
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   })

    //   this.loader.present();
    //   this.productSubscription = this.productServices.getProducts().subscribe((data => {
    //     this.products = data;
    //     localStorage.setItem('productsList', JSON.stringify(data));
    //     console.log('Storage Updated');
    //     this.loader.dismiss();
    //     this.disconnectSubscription.unsubscribe();
    //   }));
    // }

    // else {
    //   let productsList = JSON.parse(localStorage.getItem('productsList'));
    //   if (productsList) {
    //     console.log('local data found!');
    //     this.products = productsList;
    //   }

    //   else {
    //     this.appCtrl.getRootNav().setRoot({ title: 'Login', component: LoginPage }.component);
    //     let alert = this.alertCtrl.create({
    //       title: 'Error!',
    //       subTitle: 'Failed to load data. Please check your internet conection and try again.',
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   }
    // }
  }



  // this.connectSubscription = Network.onConnect().subscribe(() => {
  //   this.connected = true;
  //   console.log('Internet Connected');

  //   this.loader.present();
  // });

  // });

  // setTimeout(() => {
  //   if (!this.products) {
  //     loader.dismiss();
  //     console.log('not found');

  //   }
  // }, 10000);

  // this.productSubscription.unsubscribe();

  clickCheckOut() {
    // this.productServices.mapTest();
    this.httpServices.getData().subscribe((data) => console.log(data));
    // .then((res) => console.log(res)).catch((err) => console.log('error at component: ' + err))
  }

  doRefresh(refresher) {
    this.productServices.fetchProductsToStorage().then(() => {
      this.productServices.getProducts().then((data) => {
        this.products = data;
        refresher.complete();
      }).catch(() => {
        let toast = this.toastCtrl.create({
          message: 'Failed to refresh',
          duration: 3000
        });
        toast.present();
        refresher.cancel();
      })
    }).catch(() => {
      let toast = this.toastCtrl.create({
        message: 'Failed to refresh',
        duration: 3000
      });
      toast.present();
      refresher.cancel();
    })


    // this.productServices.fetchProducts().then((data) => {
    //   this.products = data;
    //   refresher.complete();
    // }).catch(() => {
    //   let toast = this.toastCtrl.create({
    //     message: 'Failed to refresh',
    //     duration: 3000
    //   });
    //   toast.present();
    //   refresher.cancel();
    // })
  }

  // ionViewWillLeave() {
  //   if(!this.productSubscription.closed) {
  //     this.productSubscription.unsubscribe();
  //   }
  //   // this.connectSubscription.unsubscribe();
  //   // this.disconnectSubscription.unsubscribe();
  //   console.log('unsubscribed');
  // }

  clickCategory(category: any) {
    this.navCtrl.push(ProductsPage, { category: category });
  }

}
