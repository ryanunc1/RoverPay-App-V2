import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { User } from '../../implementation/roverpay.impl';
import { CreditCardModal } from '../../modal/creditcard/creditcard'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

    private isEdit: boolean = false;

    private email: string;

    private showNofifService = true;

    private showLocationService = true;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public menuCtrl: MenuController,
                private alertCtrl: AlertController,
                private modalCtrl: ModalController,
                private navParams: NavParams,
                private user: User) {

        this.email = this.user.username;


    }

    ionViewWillEnter() {
        this.showLocationService = (this.user.isLocationEnabled()) ? true : false;
        this.showNofifService = (this.user.isPushNotifEnabled()) ? true : false;
    }

    close() {
        this.navCtrl.popToRoot();
    }

    editProfile() {
        this.isEdit = (this.isEdit) ? false : true; 
    }

    showChangeName() {
        let alert = this.alertCtrl.create({
            title: 'Change Name',
            cssClass: 'rover-alert-class',
            inputs: [
              {
                name: 'firstName',
                placeholder: 'First Name'
              },
              {
                name: 'lastName',
                placeholder: 'Last Name'
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'alert-cancel-button',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Save',
                cssClass: 'alert-save-button',
                handler: data => {
                    if(!data.firstName || !data.lastName) {
                        let alert = this.alertCtrl.create({
                            title: 'Error changing name',
                            message: 'Please enter your first and last name',
                            buttons: ["OK"],
                            cssClass: 'rover-alert-class'
                        });
                        alert.present();
                    } else {
                        let loading = this.loadingCtrl.create({
                            spinner: 'hide',
                            content: 'Loading...',
                            cssClass: 'rover-loading-class'
                        });

                        loading.present();
                        this.user.updateName(this.user.userId, data.firstName, data.lastName, (response) => {
                            console.log(data.firstName);
                            console.log(data.lastName);
                            
                            if(response && response.code === "OK") {
                                this.user.firstName = data.firstName;
                                this.user.lastName = data.lastName;
                                this.user.save();
                            } else {
                                let alert = this.alertCtrl.create({
                                    title: 'Error changing name',
                                    message: 'Bad Request',
                                    buttons: ["OK"],
                                    cssClass: 'rover-alert-class'
                                });
                                alert.present();
                            }
                            loading.dismiss();
                        });

                        
                    }
                }
              }
            ]
          });
          alert.present();
    }

    updateEmailAddress() {

        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading...',
            cssClass: 'rover-loading-class'
        });

        loading.present();

        this.user.updateProfile(this.user.userId, this.email, (data) => {
            loading.dismiss();
            if(data && data.code === "OK") {
                this.user.username = this.email;
                this.user.save();
                let alert = this.alertCtrl.create({
                    title: 'Success',
                    message: 'Successfully update your username',
                    buttons: ["OK"],
                    cssClass: 'rover-alert-class'
                });
                alert.present();

            } else {
                let alert = this.alertCtrl.create({
                    title: 'Error changing username',
                    message: 'Bad Request',
                    buttons: ["OK"],
                    cssClass: 'rover-alert-class'
                });
                alert.present();
            }
        });
    }

    showChangePassword() {
        let alert = this.alertCtrl.create({
            title: 'Enter New Password',
            cssClass: 'rover-alert-class',
            inputs: [
                {
                    name: 'newPassword',
                    placeholder: 'New Password',
                    type: 'password'
                },
                {
                    name: 'confirmPassword',
                    placeholder: 'Confirm Password',
                    type: 'password'
                }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'alert-cancel-button',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Save',
                cssClass: 'alert-save-button',
                handler: data => {
                    if(!data.newPassword || !data.confirmPassword || data.newPassword.length < 8) {
                        let alert = this.alertCtrl.create({
                            title: 'Error changing Password',
                            message: 'Passwords must be at least 8 characters long',
                            buttons: ["OK"],
                            cssClass: 'rover-alert-class'
                        });
                        alert.present();
                    } else if(data.newPassword.search(/[A-Z]/) === -1 || data.newPassword.search(/[a-z]/) === -1) {
                        let alert = this.alertCtrl.create({
                            title: 'Error changing Password',
                            message: 'Password must contain uppercase and lowercase characters',
                            buttons: ["OK"],
                            cssClass: 'rover-alert-class'
                        });
                        alert.present();
                    } else if(!data.newPassword || !data.confirmPassword || data.newPassword !== data.confirmPassword) {
                        let alert = this.alertCtrl.create({
                            title: 'Error changing Password',
                            message: 'Passwords must match',
                            buttons: ["OK"],
                            cssClass: 'rover-alert-class'
                        });
                        alert.present();
                    } else {
                        let loading = this.loadingCtrl.create({
                            spinner: 'hide',
                            content: 'Loading...',
                            cssClass: 'rover-loading-class'
                        });

                        this.user.updatePassword(data.newPassword, (result) => {
                            loading.dismiss();
                            if(result && result.code === "OK") {
                                let alert = this.alertCtrl.create({
                                    title: 'Success',
                                    message: 'Successfully updated your password',
                                    buttons: ["OK"],
                                    cssClass: 'rover-alert-class'
                                });
                                alert.present();
                            } else {
                                let alert = this.alertCtrl.create({
                                    title: 'Error changing Password',
                                    message: 'Bad Requestt',
                                    buttons: ["OK"],
                                    cssClass: 'rover-alert-class'
                                });
                                alert.present();
                            }
                        })
                      
                        loading.present();
                    }
                }
              }
            ]
          });
          alert.present();
    }

    showPayment() {
        let paymentModal = this.modalCtrl.create(CreditCardModal);
        paymentModal.present();
    }

    enableLocation() {
        this.user.enableLocation();
        this.showLocationService = false;
    }

    enablePushNotif() {
        this.user.enablePush();
        this.showNofifService = false;
    }
}
