import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, App } from 'ionic-angular';
import { FirebaseAuthState } from 'angularfire2'
import { AccountServices } from '../../services/account-services'
import { RegisterPage } from '../register/register';
import { Camera } from 'ionic-native';

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  userName: string;
  userEmail: string;
  userImage: string;
  authObject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private actionCtrl: ActionSheetController, private alertCtrl: AlertController, private accountServices: AccountServices, private appCtrl: App) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
    this.accountServices.getUserData().then((data: any) => {
      this.userName = data.name;
      this.userEmail = data.email;
      this.userImage = data.photoUrl;
    })
    // this.accountServices.fetchUserData().then((data: any) => {
    //   this.userName = data.name;
    //   this.userEmail = data.email;
    //   this.userImage = data.image;
    // })

    // this.authObject = this.accountServices.loadUserData().subscribe((user: FirebaseAuthState) => {
    //   if (user) {
    //     this.userName = user.auth.displayName;
    //     this.userEmail = user.auth.email;
    //     this.userImage = 'https://firebasestorage.googleapis.com/v0/b/shady-threads.appspot.com/o/resources%2Fprofile.png?alt=media&token=c66c991f-8d4e-40a1-9749-0b6749ecaaec'
    //     if (user.auth.photoURL) {
    //       this.userImage = user.auth.photoURL;
    //     }
    //   }
    // });



    // let dataSubscription = this.accountServices.loadUserData();
    // dataSubscription.subscribe((user: FirebaseAuthState) => {
    //   if(user) {
    //     this.userName = user.auth.displayName;
    //     this.userEmail = user.auth.email;
    //     let imageUrl = user.auth.photoURL;
    //     if(imageUrl) {
    //       this.userImage = imageUrl
    //     }
    //     dataSubscription.unsubscribe();
    //   }
    // })
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave AccountPage');
    this.authObject.unsubscribe();
  }

  clickImage() {
    this.actionCtrl.create({
      title: 'Select source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            Camera.getPicture({
              targetWidth: 300,
              targetHeight: 300,
              quality: 70,
              allowEdit: true,
              correctOrientation: false,
              saveToPhotoAlbum: true,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            }).then((selectedImage) => {
              this.accountServices.uploadImage(selectedImage).then((downloadUrl: string) => {
                this.accountServices.updateInfo(this.userName, downloadUrl).then(() => {
                  this.userImage = downloadUrl;
                  this.alertCtrl.create({
                    subTitle: 'Your image has been successfully updated.',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel'
                      }
                    ]
                  }).present();
                }).catch(() => { })
              }).catch(() => {
                this.alertCtrl.create({
                  subTitle: 'Failed to upload image. Please try again.',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                }).present()
              })
            }).catch((error) => {
              this.alertCtrl.create({
                message: error,
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              }).present();
            })
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            Camera.getPicture({
              targetWidth: 300,
              targetHeight: 300,
              quality: 70,
              allowEdit: true,
              correctOrientation: false,
              saveToPhotoAlbum: true,
              encodingType: Camera.EncodingType.JPEG,
              mediaType: Camera.MediaType.PICTURE,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA
            }).then((selectedImage) => {
              this.accountServices.uploadImage(selectedImage).then((downloadUrl: string) => {
                this.accountServices.updateInfo(this.userName, downloadUrl).then(() => {
                  this.userImage = downloadUrl;
                  this.alertCtrl.create({
                    subTitle: 'Your image has been successfully updated.',
                    buttons: [
                      {
                        text: 'OK',
                        role: 'cancel'
                      }
                    ]
                  }).present();
                }).catch(() => { })
              }).catch(() => {
                this.alertCtrl.create({
                  subTitle: 'Failed to upload image. Please try again.',
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel'
                    }
                  ]
                }).present()
              })
            }).catch((error) => {
              this.alertCtrl.create({
                message: error,
                buttons: [
                  {
                    text: 'OK',
                    role: 'cancel'
                  }
                ]
              }).present();
            })
          }
        },
        {
          text: 'Cancel',
          icon: 'close'
        }
      ]
    }).present();
  }

  clickName() {
    this.alertCtrl.create({
      subTitle: 'Enter new name',
      inputs: [
        {
          name: 'txtNewName',
          value: this.userName
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountServices.updateInfo(data.txtNewName, this.userImage).then(() => this.userName = data.txtNewName);
          }
        }
      ]
    }).present();
  }

  clickEmail() {
    this.alertCtrl.create({
      subTitle: 'Enter new email',
      inputs: [
        {
          name: 'txtNewEmail',
          type: 'email',
          value: this.userEmail
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountServices.updateEmail(data.txtNewEmail).then(() => this.userEmail = data.txtNewEmail).catch(() => { });
          }
        }
      ]
    }).present();
  }

  clickPassword() {
    this.alertCtrl.create({
      subTitle: 'Enter new password',
      inputs: [
        {
          name: 'txtNewPassword',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.accountServices.updatePassword(data.txtNewPassword).catch(() => { });
          }
        }
      ]
    }).present();
  }

  clickDelete() {
    this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.accountServices.removeAccount().then(() => {
              this.appCtrl.getActiveNav().setRoot({ title: 'Sign Up', component: RegisterPage }.component);
            })
          }
        }
      ]
    }).present();
  }
}
