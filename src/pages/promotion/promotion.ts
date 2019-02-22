import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { SocialSharing } from "@ionic-native/social-sharing"

import { User, Configs, Promocodes } from '../../implementation/roverpay.impl';

@Component({
  selector: 'page-promotion',
  templateUrl: 'promotion.html',
})

export class PromotionPage {

  private state: State;

  private showImage: boolean = false;

  private pawImage: string = "assets/imgs/RP_PawUp.gif";

  private showMessage: boolean = false

  private message: string = "";

  private pawInd: number = 0;

  private referralCode: string = "";

  private redeemCode: string = "";

  private configs: any;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private socialSharing: SocialSharing,
              private user: User,
              private config: Configs,
              private promocodes: Promocodes) {}

  private setToDefault() {
    this.state = "default";
    this.showMessage = false;
    this.showImage = false;
    this.pawImage = "assets/imgs/RP_PawUp.gif";
    this.pawInd = 0;
    this.redeemCode = "";
    this.message = "";
  }

  ionViewWillEnter() {

    this.setToDefault();
    this.config.getConfigs((result) => {
      if(result && result.code === "OK") {
        this.configs = result.data;
        console.log("configs");
        console.log(this.configs);
      }
    });

    this.user.getReferralCode((result) => {
      if(result && result.code === "OK") {
        this.user.referralCode = result.data.referralCode;
        this.referralCode = result.data.referralCode;
        console.log("Refferal Code");
        console.log(this.referralCode);
        this.user.save();
      }
    });
  }

  close() {
    this.navCtrl.popToRoot();
  }

  changeState(state: State) {
    this.setToDefault();
    this.state = state;
  }

  redeem() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    let user = this.user.removeObjectFunc();

    this.promocodes.redeem(this.redeemCode, user, (result) => {
      loading.dismiss();
      console.log("Redeem Code Response");
      console.log(result);

      if(result && result.data)
        this.message = result.data;

      if(result && result.code === "OK")
        this.showImage = true;
      else
        this.showImage = false;
      
      this.showMessage = true;
    });
  }

  getPawImg() {
    if(this.pawImage.indexOf("assets/imgs/RP-Smiling Dog.gif") !== -1
      || this.pawImage.indexOf("assets/imgs/RP_PawDown.gif") !== -1) {
        this.pawImage = "assets/imgs/RP_PawUp.gif";
        this.pawInd = 1;
    } else {
      this.pawImage = "assets/imgs/RP_PawDown.gif";
      this.pawInd = 2;
    }

    let random = (new Date()).toString();
    this.pawImage += "?cb=" + random;
  }

  inviteBuddies() {
    let options = {
      message: 'Hi! If you install the RoverPay app and enter my referral code after signing up, we both get some free Rover bucks! Download the app from roverpayapp.com and enter this code from the Promotions menu: ' + this.referralCode,
      subject: 'Free RoverPay Bucks!', // fi. for email
      url: 'https://www.roverpayapp.com?referralCode='+this.referralCode
    }

    this.socialSharing.shareWithOptions(options)
      .then((result) => {
        console.log("RESULT");
        console.log(result);
      })
      .catch((error) => {
        console.log("ERROR"); console.log(error);
      });
  }
}

export type State = 'promocode' | 'invitebuddy' | 'default';