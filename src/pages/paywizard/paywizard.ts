

import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController, ModalController, Slides, Alert } from 'ionic-angular';

import { User } from '../../implementation/roverpay.impl';

import * as _ from 'underscore';
import * as moment from 'moment';

import { CreditCardModal } from '../../modal/creditcard/creditcard';
import { PinModal } from '../../modal/pin/pin';

@Component({
  selector: 'page-paywizard',
  templateUrl: 'paywizard.html',
})

export class PayWizardPage {

  @ViewChild(Slides) slides: Slides;

  private transactions: any = [];

  private venues: any = [];

  private venue: any;

  private campaign: any;

  private checkAmount;

  private rewardTier;

  private differenceFromNextTier;

  private nextTierRewardPoints;

  private showNextTierMessage;

  private numRewardPointsFromTransaction = 0;

  private tipPercent = 0;

  private customTipPercent;

  private finalTip;

  private rewardPointsApplying = 0;

  private isApplying = false;

  private tax = 0;

  private successTrans;

  private pawImage: string = "assets/imgs/RP-Smiling Dog.gif";

  private pawInd = 0;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private user: User) {
                
              }

  ionViewWillEnter() {
    this.pawImage = "assets/imgs/RP-Smiling Dog.gif";
    this.pawInd = 0;

    this.slides.lockSwipes(true);
    this.venue = this.navParams.get('venue');

    this.venue.campaigns = _.sortBy(this.venue.campaigns, (cam: any) => {
      return cam.rewardLevel * -1;
    });

    for(let i = 0; i < this.venue.campaigns.length; i++) {
      let cam = this.venue.campaigns[i];

      if(!cam.active) {
        continue;
      }

      if (!!cam.startDate && moment(cam.startDate).isAfter(moment())) {
        continue;
      }
      if (!!cam.endDate && moment(cam.endDate).isBefore(moment())) {
        continue;
      }

      if(cam.filter === "always_on") {
        this.campaign = cam;
        break;
      } else if (cam.filter === "happy_hour") {
        let day = moment().day();
        let hour = moment().hour();
        let isToday = _.find(cam.repeatDay, function (num) { return num === day; });

        if (isToday && cam.repeatStartHour <= hour && cam.repeatEndHour >= hour) {
          this.campaign = cam;
          break;
        }
      } else if (cam.filter === "return_soon") {
        let trans = _.find(this.user.transactions, function (t) {
          return t.venue === cam.venue;
        });

        if (!!trans && !!trans.closed && trans.status === "completed") {
          if (moment(trans.closed)
            .add(cam.filterData.returnHours, "hours")
            .isAfter(moment())) {
            this.campaign = cam;
            break;
          }
        }
      } else if (cam.filter === "try_us_again") {
        let trans = _.find(this.user.transactions, function (t) {
          return t.venue === cam.venue;
        });
        if (!!trans && !!trans.closed && trans.status === 'completed') {
          if (moment(trans.closed)
            .add(cam.filterData.returnDays, 'days')
            .isBefore(moment())) {

            this.campaign = cam;
            break;
          }
        }
      }
    }
  }

  ionViewDidEnter() {
    console.log("My User");
    console.log(this.user);

    if(this.user.paymentMethods && this.user.paymentMethods.length <= 0) {
      let paymentModal = this.modalCtrl.create(CreditCardModal);
      paymentModal.present();
    }
  }

  updateRewardPointsMessage() {
    setTimeout(() => {
      this.tax = Math.round((this.checkAmount - this.checkAmount / (1 + this.venue.tax)) * 100);
      let tier = 0;
      this.rewardTier = -1;

      let subTotal = this.checkAmount * 100 - this.tax;
      _.each(this.campaign.rewardTiers, (value: number, key) => {
        if(subTotal >= value && value > tier) {
          tier = value;
          this.rewardTier = key;
        }
      });

      this.numRewardPointsFromTransaction = (tier / 100) * this.campaign.rewardLevel;

      if (this.campaign.rewardTiers.length > this.rewardTier) {
        let nextTier = this.rewardTier + 1;
        let nextTierValue = this.campaign.rewardTiers[nextTier];
        this.differenceFromNextTier = (nextTierValue - subTotal) / 100;
        this.nextTierRewardPoints = (nextTierValue / 100) * this.campaign.rewardLevel;
        this.showNextTierMessage = true;
        //Only show next message if greater than 10% of bill;
        //$scope.data.showNextTierMessage = (subtotal*0.1 > $scope.data.differenceFromNextTier*100) || $scope.data.differenceFromNextTier < 3 ? true : false;
      } else {
        this.showNextTierMessage = false;
      }
    }, 0)
  }

  openPayModal() {
    
    let paymentModal = this.modalCtrl.create(CreditCardModal);
    paymentModal.present();
    
  }

  toTip() {

    console.log("CHECK AMOUNT"); console.log(this.checkAmount);

    if(this.user.paymentMethods && this.user.paymentMethods.length <= 0) {
      let paymentModal = this.modalCtrl.create(CreditCardModal);
      paymentModal.present();
    } else if(this.checkAmount <= 0 || !this.checkAmount) {
      let alert = this.alertCtrl.create({
        title: 'Please enter your check total to continue',
        buttons: ["OK"],
        cssClass: 'ccpayment-alert-class'
      });
      alert.present();
    } else {
      this.tipPercent = 20;
      this.slides.lockSwipes(false);
      this.slides.slideNext(300);
      this.slides.lockSwipes(true);
    }
  }

  private round(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  toPay() {

    this.finalTip = 0;

    if(this.tipPercent && this.tipPercent > 0) {
      this.finalTip = this.tipPercent * 0.01 * this.checkAmount;
    } else if(this.customTipPercent) {
      this.finalTip = this.customTipPercent;
    }

    this.slides.lockSwipes(false);
    this.slides.slideNext(300);
    this.slides.lockSwipes(true);
  }

  back() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev(300);
    this.slides.lockSwipes(true);
  }

  cancel() {
    this.navCtrl.pop();
  }

  tipAmountClicked(tipPercent) {
    this.customTipPercent = null;
    this.tipPercent = tipPercent;
  }

  updateCustomTipPercent() {
    setTimeout(() => {
      console.log("CUSTOM TIP PERCENT");
      console.log(this.customTipPercent);
      if(this.customTipPercent || this.customTipPercent >= 0) {
        this.tipPercent = null;
      } else {
        this.tipPercent = 20;
      }
    }, 0)
  }

  showApplyRewardsInput() {
    this.isApplying = true;

    // setTimeout(() => {
    //   document.getElementById('rewards-applying-input').focus();
    // }, 30)
  }

  rewardPointsApplyingChanged() {
    setTimeout(() => {
      if (this.rewardPointsApplying / 100 > (this.checkAmount + this.finalTip)) {
        this.rewardPointsApplying = (this.checkAmount + this.finalTip) * 100;
      }
      if (this.rewardPointsApplying > this.user.rewardPoints) {
        this.rewardPointsApplying = this.user.rewardPoints;
      }
    }, 0)
  }

  private addFavorite() {
    this.user.addFavorite(this.venue.id, (result) => {
      if(result && result.code === "OK") {
        this.user.favorites.push(result.data);
      }
    });
  }

  checkout() {
    let paymentData = {
      "venue_id": this.venue.id,
      "campaign_id": this.campaign.id,
      "subtotal": Math.round(this.checkAmount * 100 - this.tax),
      "rewardPointsUsed": this.rewardPointsApplying,
      "tip": Math.round(this.finalTip * 100),
      "tax": this.tax,
      "checkAmount": Math.round(this.checkAmount * 100),
      "total": Math.round(this.checkAmount * 100 + this.finalTip * 100 - this.rewardPointsApplying),
      "verb": "authorize"
    }

    console.log("PAYMENT DATA");
    console.log(paymentData);

    let pinModal = this.modalCtrl.create(PinModal, {state: "paywizard", paymentData: paymentData});
    pinModal.present();

    pinModal.onDidDismiss((response) => {

      if(!response) return;

      if(response.result && response.result.code === "OK") {
        this.successTrans = response.result.data;
        this.slides.lockSwipes(false);
        this.slides.slideNext(300);
        this.slides.lockSwipes(true);

        setTimeout(() => {
          this.getPawImg();
        }, 1250);
        this.addFavorite();
      }
    })
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

  goHome() {
    this.navCtrl.popToRoot();
  }
}
