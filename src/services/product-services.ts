import { Injectable } from '@angular/core'
import { FirebaseListObservable, AngularFire } from 'angularfire2'
import { LoadingController } from 'ionic-angular'
import { Network } from 'ionic-native'

@Injectable()
export class ProductServices {

    constructor(private angularFire: AngularFire, private loadingCtrl: LoadingController) { }

    getProductsByCategory(categoryId: any) {
        return this.angularFire.database.list('/products/' + categoryId + '/category_products');
    }

    getProducts() {
        return new Promise((res, rej) => {
            let productsList = JSON.parse(localStorage.getItem('productsList'));
            if (productsList) {
                res(productsList);
            }

            else {
                rej();
            }
        })
    }

    fetchProducts() {
        return new Promise((res, rej) => {
            if (Network.type !== 'none') {
                let loading = this.loadingCtrl.create({
                    content: 'Loading products...'
                });
                loading.present();

                let productSubscription = this.angularFire.database.list('/products').subscribe((data) => {
                    loading.dismiss();
                    productSubscription.unsubscribe();
                    res(data);
                })
            }
            else {
                rej('not available');
            }
        })
    }

    fetchProductsToStorage() {
        return new Promise((res, rej) => {
            if (Network.type !== 'none') {
                let loading = this.loadingCtrl.create({
                    content: 'Loading products...'
                });
                loading.present();

                let productSubscription = this.angularFire.database.list('/products').subscribe((data) => {
                    productSubscription.unsubscribe();
                    localStorage.setItem('productsList', JSON.stringify(data));
                    loading.dismiss();
                    res();
                })
            }
            else {
                rej('not available');
            }
        })
    }

    mapTest() {
        this.angularFire.database.list('/orders/').subscribe((data) => {
            data.forEach((val, idx) => {
                console.log(val);
                console.log(idx);
                console.log(data.length);
                if(idx == (data.length - 1)) {
                    console.log('last');
                }
            })
        })
    }
}   