import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { User } from '../../implementation/roverpay.impl';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'modal-changepassword',
  templateUrl: 'changepassword.html',
})

export class ChangePasswordModal {

  private changePasswordForm: FormGroup;

  private stateCode: string = "";
  
  private stateNewPassword: string = "";

  private stateConfirmPassword: string = "";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private user: User) {

    this.changePasswordForm = new FormGroup({
      'code': new FormControl(this.stateCode, [Validators.required]),
      'newPassword': new FormControl(this.stateNewPassword, [Validators.minLength(8)]),
      'confirmedPassword': new FormControl(this.stateConfirmPassword, [Validators.minLength(8)])
    });
  }

  ionViewWillEnter() {}

  ionViewDidEnter() {
    this.changePasswordForm.reset();
  }

  get code() { return this.changePasswordForm.get('code'); }

  get newPassword() { return this.changePasswordForm.get('newPassword'); }

  get confirmedPassword() { return this.changePasswordForm.get('confirmedPassword'); }

  doChangePassword() {
    let data = {
      "password": this.newPassword.value,
      "username": this.user.username,
      "validationCode": this.code.value
    }

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.user.changePassword(data, (result) => {
      loading.dismiss();
      if(result && result.code === "OK") {
        this.viewCtrl.dismiss({success: true})
      } else {
        let alert = this.alertCtrl.create({
          title: 'Failed',
          message: result.message,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      }
    });
  }

  closeChangePasswordModal() {
    this.viewCtrl.dismiss();
  }
}
