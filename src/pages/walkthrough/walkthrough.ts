import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { User } from '../../implementation/roverpay.impl';

import { HomePage } from '../../pages/home/home';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'walkthrough',
  templateUrl: 'walkthrough.html'
})

export class Walkthrough {

  private token;

  private state: string = "default";

  private loginForm: FormGroup;

  private signUpForm: FormGroup;

  private validatedPassword: string;

  constructor(public navCtrl: NavController,
              private user: User,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
  
                
    //this.token = this.user.getToken();

    this.loginForm = new FormGroup({
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.validatedPassword, [Validators.required])
    });

    this.signUpForm = new FormGroup({
      'firstName': new FormControl(this.user.firstName, [Validators.required]),
      'username': new FormControl(this.user.username, [Validators.required, Validators.email]),
      'password': new FormControl(this.validatedPassword, [Validators.minLength(8)])
    });

  }

  ionViewDidLoad() {

  }

  changeState(state: State) {
    this.state = state;
    this.setToDefault();
  }

  get loginUsername() { return this.loginForm.get('username'); }

  get loginPassword() { return this.loginForm.get('password'); }

  get signUpFirstname() { return this.signUpForm.get('firstName'); }
  
  get signUpUsername() { return this.signUpForm.get('username'); }

  get signUpPassword() { return this.signUpForm.get('password'); }

  private setToDefault() {
    this.loginForm.reset();
    this.signUpForm.reset();
  }

  doLogin() {

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    this.user.login(this.loginUsername.value, this.loginPassword.value, (result) => {
      console.log("My Result");
      console.log(result);
      loading.dismiss();

      if(result && result.code == "E_USER_NOT_FOUND") {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: result.message,
          buttons: ["OK"],
          cssClass: 'rover-alert-class'
        });
        alert.present();
      } else {
        this.setupUserClass(result);

        this.user.setToken(this.user.token);
        let storageUser = {
          "username": this.user.username,
          "userId": this.user.userId,
          "token": this.user.token,
          "firstName": this.user.firstName
        }

        this.user.setUser(JSON.stringify(storageUser));

        this.navCtrl.push(HomePage);
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
      console.log("My Result");
      console.log(result);
      loading.dismiss();

      if(result && result.code == "CREATED") {
        this.setupUserClass(result);

        this.user.setToken(this.user.token);
        this.navCtrl.push(HomePage, {user: this.user});
      } else if(result && result.code == "E_VALIDATION") {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: `A record with that 'email' already exists ('${this.signUpUsername.value}')`,
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
    this.user.firstName= result.data.user.firstName;
  }

}

export type State = 'login' | 'sign-up' | 'default';