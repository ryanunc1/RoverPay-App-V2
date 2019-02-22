import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, Events, ModalController } from 'ionic-angular';

import { CreditCardModal } from '../../modal/creditcard/creditcard';

import { User, Promocodes } from '../../implementation/roverpay.impl';

@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})

export class PermissionPage {

  private storage: Storage;

  private data = {
    promoCode: '',
    successMessage: '',
    showMessage: false,
    showImg: false,
    state: '',
    viewLoaded: false,
    progressPercent: 0
  };

  private pawImage: string = "assets/imgs/RP_PawUp.gif";

  private pawInd: number = 0;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              private loadingCtrl: LoadingController,
              private user: User,
              private events: Events,
              private modalCtrl: ModalController,
              private promocodes: Promocodes) {}

  ionViewWillEnter() {
    this.storage = window.localStorage;
    this.storage.setItem("permission", "true");

    console.log("Im here Permission");
  }

  ionViewDidEnter() {
    this.data.state = 'welcome';
  }

  private prog(step) {
    let steps = 6;
    return Math.round((100/steps)*step);
  }

  getBg() {
    let st = this.data.state;

    if(st === 'location') {
      return 'darkorange';
    } else if(st === 'push') {
      return 'darkteal';
    } else if(st === 'rewards' || st === 'howto') {
      return 'white';
    } else {
      return 'orange';
    }
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

  redeem() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    let user = this.user.removeObjectFunc();

    this.promocodes.redeem(this.data.promoCode, user, (result) => {
      loading.dismiss();

      if(result && result.data)
        this.data.successMessage = result.data;

      if(result && result.code === "OK")
        this.data.showImg = true;
      else
        this.data.showImg = false;
      
      this.data.showMessage = true;
    });
  }

  enablePush() {
    this.user.enablePush();
    this.data.state = "location";
    this.data.progressPercent = this.prog(3);
  }

  enableLocation() {
    this.data.state = "rewards";
    this.data.progressPercent = this.prog(4);
  }

  disablePush() {
    this.storage.setItem("pushDisabled", "true");
    this.data.state = "location";
    this.data.progressPercent = this.prog(3);

  }

  disableLocation() {
    this.storage.setItem("locationDisabled", "true");
    this.data.state = "rewards";
    this.data.progressPercent = this.prog(4);
  }

  close() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss();
      this.events.publish('setHomePageAsRoot');
    }, 100)
  }

  goToAddPayment() {
    let paymentModal = this.modalCtrl.create(CreditCardModal);
    paymentModal.present();
    
    setTimeout(() => {
      this.events.publish('setHomePageAsRoot');
    }, 100)
  }
}
