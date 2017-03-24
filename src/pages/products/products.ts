import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductServices } from '../../services/product-services'
import { ProductDetailsPage } from '../product-details/product-details'

/*
  Generated class for the Products page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  productsList: any;
  categoryPrefs: any;
  imgSource: string = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fcollapse-image.jpg?alt=media&token=5e575654-ca27-4d57-9865-9a275280b355';


  constructor(public navCtrl: NavController, public navParams: NavParams, private productServices: ProductServices) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    let category = this.navParams.get('category');
    this.productsList = category.category_products;
    this.categoryPrefs = category.category_prefs;
  }

  clickProduct(product: any) {
    this.navCtrl.push(ProductDetailsPage, {
      product: product,
      prefs: this.categoryPrefs
    });
  }
}
