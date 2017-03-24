import { Injectable } from '@angular/core'
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2'
import { LoadingController, AlertController, ToastController } from 'ionic-angular'
// import { Router } from '@angular/router';
// import { SharedServices } from './shared-services'
import { CartServices } from './cart-services'
import { Observable, BehaviorSubject } from 'rxjs'

@Injectable()
export class LoginServices {
    private _loginStateSource = new BehaviorSubject<boolean>(null);
    private _loginState$ = this._loginStateSource.asObservable();

    constructor(private angularFire: AngularFire, private cartServices: CartServices, private loadingCrtl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
        this.updateLoginState();
    }

    getUserData() {
        return new Promise((res, rej) => {
            let currentAuth = this.angularFire.auth.getAuth().auth;
            let userData = {
                email: currentAuth.email,
                name: currentAuth.displayName,
                photoUrl: currentAuth.photoURL
            }

            console.log(userData);

            if (userData) {
                res(userData)
            }

            else {
                rej();
            }
        })
    }

    loginUser(email: string, password: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCrtl.create({
                content: 'Authenticating...'
            });
            loading.present();
            this.angularFire.auth.login({ email: email, password: password }).then(
                (success) => {
                    localStorage.setItem('currentUser', success.uid);
                    this.cartServices.rebindCart(success.uid);
                    this.updateLoginState();
                    let toast = this.toastCtrl.create({
                        message: 'Login successful!',
                        duration: 3000
                    });
                    toast.present();
                    loading.dismiss();
                    // this.updateLoginState();
                    // console.log(success);
                    console.log('login successful!');
                    console.log(success);
                    res(success);
                }).catch(
                (err) => {
                    console.log('error: ' + err);
                    let toast = this.toastCtrl.create({
                        message: 'Login failed!',
                        duration: 3000
                    });
                    toast.present();
                    let alert = this.alertCtrl.create({
                        title: 'Login Failed',
                        message: 'Check your credentials and try again',
                        buttons: [{
                            text: 'OK',
                            role: 'cancel'
                        }]
                    });
                    loading.dismiss();
                    alert.present();
                    rej(err);
                })
        })
    }

    logoutUser() {
        return new Promise((res, rej) => {
            let loading = this.loadingCrtl.create({
                content: 'Logging out...'
            });
            loading.present();
            this.angularFire.auth.logout().then((success) => {
                localStorage.removeItem('currentUser');
                this.updateLoginState();
                let toast = this.toastCtrl.create({
                    message: 'Logged out successfully!',
                    duration: 3000
                });
                toast.present();
                loading.dismiss();
                res();
            }).catch((err) => {
                let alert = this.alertCtrl.create({
                    title: 'Logout Failed',
                    message: 'Failed to logout. Please try again.',
                    buttons: [{
                        text: 'OK',
                        role: 'cancel'
                    }]
                });
                loading.dismiss();
                alert.present();
                rej(err);
            })
        })


        // setTimeout(() => {
        //     this.router.navigate(['home']);
        // }, 1000)
        // this.sharedServices.isLoggedIn = false;
        // this.loggedIn = this.sharedServices.isLoggedIn;
    }

    getLoginState() {
        if (localStorage.getItem('currentUser')) {
            return true;
        }

        else {
            return false;
        }
    }

    getLoginStateSubscription() {
        return this._loginState$;
    }

    updateLoginState() {
        this._loginStateSource.next(this.getLoginState())
    }

    registerUser(userEmail: string, userPassword: string, userName: string) {
        let loading = this.loadingCrtl.create({
            content: 'Creating Account...'
        });
        loading.present();
        return new Promise((res, rej) => {
            this.angularFire.auth.createUser({ email: userEmail, password: userPassword }).then((success) => {
                success.auth.updateProfile({
                    displayName: userName,
                    photoURL: 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec'
                }).then(() => {
                    this.toastCtrl.create({
                        message: 'Account created successfully!',
                        duration: 3000
                    }).present();
                    this.loginUser(userEmail, userPassword);
                    loading.dismiss();
                    res();
                }).catch((err) => {
                    console.log('error in info update: ' + err);
                    this.toastCtrl.create({
                        message: 'Failed to create account!',
                        duration: 3000
                    }).present();
                    loading.dismiss();
                    rej(err);
                })
            }).catch((err) => {
                this.toastCtrl.create({
                    message: 'Failed to create account!',
                    duration: 3000
                }).present();
                loading.dismiss();
                console.log(userEmail);
                console.log('err2: ' + err);
                rej(err);
            })
        })
    }

    // setTimeout(() => {
    //     this.loginUser(userEmail, userPassword).then((user: any) => {
    //         user.auth.displayName = name;
    //         user.auth.photoURL = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec';
    //         this.toastCtrl.create({
    //             message: 'Account created successfully!',
    //             duration: 3000
    //         }).present();
    //         loading.dismiss();
    //         res(success);
    //         loading.dismiss();
    //         console.log('successfull!');
    //     })

    // .then((user) => {
    //     this.angularFire.auth.subscribe((data) => {
    //         data.auth.displayName = name;
    //         data.auth.photoURL = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec';
    //         this.toastCtrl.create({
    //             message: 'Account created successfully!',
    //             duration: 3000
    //         }).present();
    //         loading.dismiss();
    //         res(success);
    //     })
    // }).catch((err) => {
    //     loading.dismiss();
    //     console.log('err1: ' + err);
    //     rej(err);
    // })

    // }, 1000);

}