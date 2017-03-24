import { Injectable, Inject } from '@angular/core'
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from 'angularfire2'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AlertController, LoadingController, ToastController } from 'ionic-angular'

@Injectable()
export class CartServices {

    constructor(private angularFire: AngularFire,
        @Inject(FirebaseRef) fbref: any,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) {
        fbref.database().ref('/cart/').on('child_added', cart => {
            if (cart.key == localStorage.getItem('currentUser')) {
                this.rebindCart(cart.key);
            }
        });

        this.rebindCart(localStorage.getItem('currentUser'));
    }

    private _cartSource = new BehaviorSubject<FirebaseListObservable<any[]>>(null);
    private _cart$ = this._cartSource.asObservable();

    rebindCart(userKey: string) {
        this._cartSource.next(this.angularFire.database.list('/cart/' + userKey));
    }

    addToCart(order: Object) {
        this.alertCtrl.create({
            title: 'Confirm',
            message: 'Are you sure you want to add this item to cart?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        let loader = this.loadingCtrl.create({
                            content: 'Adding item...'
                        });
                        loader.present();
                        this.searchIfExists(order).then((data: any) => {
                            console.log('search works')
                            this.alertCtrl.create({
                                subTitle: 'The item currently exists in the cart. Do you wish to add the new quantity?',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        handler: () => {
                                            loader.dismiss()
                                        }
                                    },
                                    {
                                        text: 'Confirm',
                                        handler: () => {
                                            this.updateQuantity(data.itemKey, data.newPrefs).then(() => loader.dismiss()).catch(() => loader.dismiss())
                                        }
                                    }
                                ]
                            }).present();
                        }).catch(() => {
                            console.log('not found')
                            this.angularFire.database.list('/cart/' + localStorage.getItem('currentUser')).push(order).then(
                                (success) => {
                                    console.log('item added!')
                                    this.toastCtrl.create({
                                        message: 'Item added to cart!',
                                        duration: 3000
                                    }).present();
                                    loader.dismiss();
                                }
                            ).catch(
                                ((err) => {
                                    console.log('cart-service-error: ' + err);
                                    this.toastCtrl.create({
                                        message: 'Failed to add item!',
                                        duration: 3000
                                    }).present();
                                    loader.dismiss();
                                })
                                );
                        })
                    }
                }
            ]
        }).present();
    }

    getCartFromFirebase() {
        return this._cart$;
    }

    deleteFromCart(itemIndex: string) {
        let loading = this.loadingCtrl.create({
            content: 'Removing from cart...'
        })
        this.angularFire.database.list('/cart/' + localStorage.getItem('currentUser') + '/' + itemIndex).remove().then(
            (success) => {
                this.toastCtrl.create({
                    message: 'Item successfully removed!',
                    duration: 3000
                }).present();
                loading.dismiss();
                // this.sharedServices.addToast('Item Deleted', 'The selected item has been successfully deleted from your cart.', 'success');
            }
        ).catch(
            ((err) => {
                console.log('cart-service-error: ' + err);
                this.toastCtrl.create({
                    message: 'Failed to remove!',
                    duration: 3000
                }).present();
                loading.dismiss();
                // this.sharedServices.addToast('Item Not Deleted', 'The selected item could not be deleted due to an error.', 'error')
            })
            )
    }

    deleteAllFromCart() {
        this.angularFire.database.list('/cart/' + localStorage.getItem('currentUser')).remove().then(
            (success) => {
                // this.sharedServices.addToast('Cart Emptied', 'All the items have been removed from your cart.', 'success');
            }
        ).catch(
            ((err) => {
                console.log('cart-service-error: ' + err);
                // this.sharedServices.addToast('Cart Not Emptied', 'The items could not be removed from the cart due to an error.', 'error');
            })
            )
    }

    checkoutCart() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Placing order...'
            });
            loading.present();
            this.createArrayFromCart().then((orderProduct) => {
                this.angularFire.database.list('/orders').push({
                    order_user: localStorage.getItem('currentUser'),
                    order_items: orderProduct
                }).then((success) => {
                    this.deleteAllFromCart();
                    this.toastCtrl.create({
                        message: 'Order placed successfully!',
                        duration: 3000
                    }).present();
                    loading.dismiss();
                }).catch(() => {
                    this.toastCtrl.create({
                        message: 'Failed to place order!',
                        duration: 3000
                    }).present();
                    loading.dismiss();
                })
            })
            // setTimeout(() => {

            // }, 500);
        })
    }

    updateQuantity(itemId: string, newPrefs: any) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating quantity...'
            });
            loading.present();
            this.angularFire.database.object('/cart/' + localStorage.getItem('currentUser') + '/' + itemId).set(newPrefs).then(() => {
                this.toastCtrl.create({
                    message: 'Quantity updated successfully!',
                    duration: 3000
                }).present();
                loading.dismiss();
                res();
            }).catch(() => {
                this.toastCtrl.create({
                    message: 'Failed to update quantity!',
                    duration: 3000
                }).present();
                loading.dismiss();
                rej();
            })
        })
    }

    searchIfExists(itemOrig: any) {
        return new Promise((res, rej) => {
            let item = JSON.parse(JSON.stringify(itemOrig));
            let prevCount = item.order_prefs[0].pref_value;
            item.order_prefs.splice(0, 1);
            this.angularFire.database.list('/cart/' + localStorage.getItem('currentUser'), {
                query: {
                    orderByChild: 'order_title',
                    equalTo: item.order_title
                }
            }).subscribe((value: any) => {


                value.forEach((data) => {
                    let newCount = data.order_prefs[0].pref_value;
                    data.order_prefs.splice(0, 1);

                    if (JSON.stringify(data.order_prefs) == JSON.stringify(item.order_prefs)) {
                        item.order_prefs.splice(0, 0, {
                            pref_title: 'Quantity',
                            pref_value: parseInt(prevCount) + parseInt(newCount)
                        })

                        return res({
                            itemKey: data.$key,
                            newPrefs: item
                        });
                    }
                })
                rej();
            })
        })
    }

    createArrayFromCart() {
        return new Promise((res, rej) => {
            let orderProduct = [];
            this.angularFire.database.list('/cart/' + localStorage.getItem('currentUser')).subscribe(data => {
                data.forEach((val, index) => {
                    orderProduct.push({
                        order_prefs: val.order_prefs,
                        order_title: val.order_title
                    })
                    if (index == (data.length - 1)) {
                        res(orderProduct);
                    }
                })
            })
        })
    }
}