import { Injectable, Inject } from '@angular/core'
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, FirebaseAuthState, AngularFire, FirebaseApp, AngularFireAuth } from 'angularfire2'
import { LoginServices } from './login-services';
// import { SharedServices } from './shared-services'
import { Router } from '@angular/router'

@Injectable()
export class AccountServices {
    firebase: any;
    imageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec';
    email: string = '';
    displayName: string = '';

    constructor(private angularFire: AngularFire, @Inject(FirebaseApp) firebaseApp: any, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private loginServices: LoginServices, private alertCtrl: AlertController) {
        this.firebase = firebaseApp;
        // this.loadUserData();
    }

    uploadImage(data) {
        return new Promise((res, rej) => {
            // let fileName = name + ".jpg";
            let loading = this.loadingCtrl.create({
                content: 'Uploading Image...'
            });
            loading.present();
            let uploadTask = this.firebase.storage().ref('/profile_images/' + localStorage.getItem('currentUser')).putString(data, 'base64', { contentType: 'image/jpg' });
            uploadTask.on('state_changed', snapshot => {
            }, function (error) {
                loading.dismiss();
                rej(error);
            }, function () {
                var downloadURL = uploadTask.snapshot.downloadURL;
                loading.dismiss();
                res(downloadURL);
            });
        });
        // return promise;
    }

    deleteImage(imageId: string) {
        let image = this.firebase.storage().ref('/profile_images/' + imageId);
        image.getDownloadURL().then(() => {
            image.delete();
        }).catch((err) => {});
    }


    updateImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl;
    }

    // getUserNameAndImage() {
    //     return new Promise((res, rej) => {
    //         let sub = this.angularFire.auth.subscribe((user) => {
    //             let photoUrl = this.imageUrl;
    //             if (user.auth.photoURL) {
    //                 photoUrl = user.auth.photoURL;
    //             }
    //             sub.unsubscribe();
    //             res(user.auth.displayName
    //                 // {
    //                 // userName: user.auth.displayName,
    //                 // photoUrl: photoUrl
    //                 // }
    //             );

    //         })
    //     })
    // }

    loadUserData() {
        // console.log('loading...');

        return this.angularFire.auth;



        // let af = this.angularFire.auth;
        // af.

        // setTimeout(() => {
        //     // console.log(this.displayName);
        //     af.unsubscribe();    
        // }, 5000);


        // this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
        //     if (user) {
        //         if(user.auth.photoURL != null){
        //             this.imageUrl = user.auth.photoURL;
        //         }
        //         this.displayName = user.auth.displayName;
        //         this.email = user.auth.email;
        //     }
        // }).unsubscribe();
    }

    getUserData() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Loading information...'
            });
            loading.present();
            let currentAuth = this.angularFire.auth;
            currentAuth.subscribe((data: FirebaseAuthState) => {
                if (data) {
                    let userData = {
                        email: data.auth.email,
                        name: data.auth.displayName,
                        photoUrl: data.auth.photoURL
                    }
                    loading.dismiss();
                    res(userData);
                }
                else {
                    loading.dismiss();
                    rej();
                }
            });

            // let currentAuth = this.angularFire.auth.getAuth().auth;
            // let userData = {
            //     email: currentAuth.email,
            //     name: currentAuth.displayName,
            //     photoUrl: currentAuth.photoURL
            // }

            // console.log(userData);

            // if (userData) {
            //     loading.dismiss();
            //     res(userData)
            // }

            // else {
            //     loading.dismiss();
            //     rej();
            // }
        })
    }

    fetchUserData() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Loading data...'
            });
            loading.present();
            let dataSub = this.angularFire.auth;
            dataSub.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    let userName = user.auth.displayName;
                    let userEmail = user.auth.email;
                    let userImage = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec'
                    if (user.auth.photoURL) {
                        userImage = user.auth.photoURL;
                    }
                    dataSub.unsubscribe();
                    loading.dismiss();
                    res({ name: userName, email: userEmail, image: userImage });
                }

                else {
                    this.toastCtrl.create({
                        message: 'Failed to load data.',
                        duration: 3000
                    }).present();
                    dataSub.unsubscribe();
                    loading.dismiss();
                    rej();
                }
            });
        })
    }

    updateInfo(displayNameValue, imageUrl) {

        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating information...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    user.auth.updateProfile({
                        displayName: displayNameValue,
                        photoURL: imageUrl,
                    }).then(() => {
                        this.toastCtrl.create({
                            message: 'Information updated successfully!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        res();
                    }).catch((err) => {
                        this.toastCtrl.create({
                            message: 'Information update failed!',
                            duration: 3000
                        }).present();
                        console.log(err);
                        rej();
                    });
                }
            })
        })
    }

    updateEmail(emailValue: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating information...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                user.auth.updateEmail(emailValue).then((success) => {
                    this.loginServices.updateLoginState();
                    this.toastCtrl.create({
                        message: 'Information updated successfully!',
                        duration: 3000
                    }).present();
                    loading.dismiss();
                    res();
                }).catch((err: any) => {
                    this.toastCtrl.create({
                        message: 'Information update failed!',
                        duration: 3000
                    }).present();
                    if (err.code === 'auth/requires-recent-login') {
                        this.alertCtrl.create({
                            subTitle: err.message,
                            buttons: [
                                {
                                    text: 'OK',
                                    role: 'cancel'
                                }
                            ]
                        }).present();
                    }
                    loading.dismiss();
                    console.log(err);
                    rej();
                })
            })
        })
    }

    removeAccount() {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Deleting account...'
            });
            loading.present();
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    var imageId = localStorage.getItem('currentUser');
                    this.deleteImage(imageId);
                    user.auth.delete().then((success) => {
                        localStorage.removeItem('currentUser');
                        this.loginServices.updateLoginState();
                        this.toastCtrl.create({
                            message: 'Account successfully deleted!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        res();
                    }).catch((error) => {
                        this.toastCtrl.create({
                            message: 'Delete account failed!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        rej();
                    });
                }
            }).unsubscribe();
        })
    }

    updatePassword(newPassword: string) {
        return new Promise((res, rej) => {
            let loading = this.loadingCtrl.create({
                content: 'Updating password...'
            });
            this.angularFire.auth.subscribe((user: FirebaseAuthState) => {
                if (user) {
                    user.auth.updatePassword(newPassword).then((success) => {
                        this.toastCtrl.create({
                            message: 'Password updated successfully!',
                            duration: 3000
                        }).present();
                        loading.dismiss();
                        res();
                    }).catch((err: any) => {
                        this.toastCtrl.create({
                            message: 'Password update failed!',
                            duration: 3000
                        }).present();
                        if (err.code === 'auth/requires-recent-login') {
                            this.alertCtrl.create({
                                subTitle: err.message,
                                buttons: [
                                    {
                                        text: 'OK',
                                        role: 'cancel'
                                    }
                                ]
                            }).present();
                        }
                        loading.dismiss();
                        rej();
                    });
                }
            }).unsubscribe();
        })
    }

    // resetPassword(emailAddress: string) {
    //     this.angularFire.auth.first().subscribe((user: FirebaseAuthState) => {
    //         if (user) {
    //             this.firebase.auth().sendPasswordResetEmail(emailAddress).then((success) => {
    //                 this.sharedServices.addToast('Mail Sent', 'A mail with the instructions to reset your password has been sent to your email account.', 'success')
    //             }).catch((error) => {
    //                 this.sharedServices.addToast('Mail Send Failed', 'A mail with the instructions to reset your password could not be sent to your email account.', 'error')
    //             });
    //         }
    //     }).unsubscribe();
    // }
}