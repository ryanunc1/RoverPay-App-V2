import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { User } from '../../implementation/roverpay.impl';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'modal-transactiondetails',
  templateUrl: 'transactiondetails.html',
})

export class TransactionDetailsModal {

  private currentVenue: any;

  private currentTransaction: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              private nav: NavParams,
              private user: User,
              private sanitizer: DomSanitizer,) {
  }
  
  ionViewWillEnter() {
    this.currentVenue = this.nav.get('currentVenue');
    this.currentTransaction = this.nav.get('currentTransaction');
    console.log("Current Venue");
    console.log(this.currentVenue);
  }
  
  hideTransactionInfo() {
    this.viewCtrl.dismiss();
  }

  getBackgroundImage(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
