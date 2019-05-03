import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController, Events } from 'ionic-angular';

import { User } from '../../implementation/roverpay.impl';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { ChangePasswordModal } from '../../modal/changepassword/changepassword';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'walkthrough',
  templateUrl: 'walkthrough.html'
})

export class Walkthrough {

  private token;

  private state: string = "";

  private loginForm: FormGroup;

  private signUpForm: FormGroup;

  private forgotPasswordForm: FormGroup;

  private validatedPassword: string;

  private triggerAnimation = false;

  private viewLoaded = false;

  constructor(public navCtrl: NavController,
              private user: User,
              private fb: Facebook,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public events: Events) {
  
                
    //this.token = this.user.getToken();

    this.loginForm = new FormGroup({
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.validatedPassword, [Validators.required])
    });

    this.signUpForm = new FormGroup({
      'firstName': new FormControl(this.user.firstName, [Validators.required]),
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.validatedPassword, [Validators.minLength(8)])
    });

    this.forgotPasswordForm = new FormGroup({
      'username': new FormControl(this.user.username, [Validators.required, Validators.email]),
    });

    console.log("LOGOUT USER");
    console.log(this.user);

  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.viewLoaded = true;
      setTimeout(() => {
        this.setToDefault();
        this.state = 'default';
      }, 500)
    }, 500)
  }

  changeState(state: State) {
    this.state = "";
    setTimeout(() => {
      this.state = state;
      this.setToDefault();
    }, 300);
  }

  get loginUsername() { return this.loginForm.get('username'); }

  get loginPassword() { return this.loginForm.get('password'); }

  get signUpFirstname() { return this.signUpForm.get('firstName'); }
  
  get signUpUsername() { return this.signUpForm.get('username'); }

  get signUpPassword() { return this.signUpForm.get('password'); }

  get forgotPasswordUsername() { return this.forgotPasswordForm.get('username'); }

  private setToDefault() {
    this.loginForm.reset();
    this.signUpForm.reset();
    this.forgotPasswordForm.reset();
  }

  doFBLogin() {
    this.fb.getLoginStatus()
      .then((success) => {
        console.log("SUCCESS");
        console.log(success);
        if(success.status === "connected") {
          console.log("SUCCESS");
          console.log(success);
        } else {
          this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
          .catch(e => console.log('Error logging into Facebook', e));
        }
      })
  }

  doLogin() {

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    this.user.login(this.loginUsername.value, this.loginPassword.value, (result) => {
      loading.dismiss();

      if(result && result.code == "OK") {
        this.user.setToken(result.data.token);

        this.user.me((result) => {
          this.setupUserClass(result);
          this.user.save();
          setTimeout(() => {
            this.events.publish('setHomePageAsRoot');
          }, 500);
        })
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: result.message,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      }

    });
  }

  doSignup() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    this.user.signup(this.signUpUsername.value, this.signUpPassword.value, this.signUpFirstname.value, (result) => {
 
      loading.dismiss();

      if(result && result.code == "CREATED") {
        this.user.setToken(result.data.token);
        this.user.me((result) => {
          this.setupUserClass(result);
          this.user.save();
          setTimeout(() => {
            this.events.publish('setHomePageAsRoot');
          }, 500);
        })

      } else if(result && result.code == "E_VALIDATION") {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: `A record with that 'email' already exists ('${this.signUpUsername.value}')`,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: result.message,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      }

    });
  }

  doForgotPassword() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.user.forgotPassword(this.forgotPasswordUsername.value, (result) => {
      loading.dismiss();

      console.log("forgot result"); console.log(result);
      
      if(result && result.code === "OK") {
        this.user.username = this.forgotPasswordUsername.value;
        let changePasswordModal = this.modalCtrl.create(ChangePasswordModal);
        changePasswordModal.present();

        changePasswordModal.onDidDismiss((success) => {
          if(success) this.state = 'login';
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: result.message,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      }
    });
  }

  private setupUserClass(result: any) {
    this.user.username = result.data.user.username;
    this.user.userId = result.data.user.id;
    this.user.token = result.data.token;
    this.user.firstName = result.data.user.firstName;
    this.user.active = result.data.user.active;
    this.user.createdAt = result.data.user.createdAt;
    this.user.deviceTokens = result.data.user.deviceTokens;
    this.user.favorites = result.data.user.favorites;
    this.user.paymentMethods = result.data.user.paymentMethods
    this.user.phone = result.data.user.phone;
    this.user.photo = result.data.user.photo;
    this.user.referralCode = result.data.user.referralCode;
    this.user.rewardPoints = result.data.user.rewardPoints;
    this.user.roles = result.data.user.roles;
    this.user.socialProfiles = result.data.user.socialProfiles;
    this.user.transactions = result.data.user.transactions;
    this.user.updateAt = result.data.user.updateAt;
    this.user.validate = result.data.user.validated;
  }

}

export type State = 'forgot' | 'login' | 'sign-up' | 'default';