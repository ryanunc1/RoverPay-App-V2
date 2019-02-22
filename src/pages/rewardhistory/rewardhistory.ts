import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, ModalController, AlertController } from 'ionic-angular';

import { User, Venue } from '../../implementation/roverpay.impl';

import * as _ from 'underscore';
import { TransactionDetailsModal } from '../../modal/transactiondetails/transactiondetails';

@Component({
  selector: 'page-rewardhistory',
  templateUrl: 'rewardhistory.html',
})

export class RewardHistoryPage {

    private transactions: any = [];

    private venues: any = [];

    constructor(public navCtrl: NavController,
                public menuCtrl: MenuController,
                private loadingCtrl: LoadingController,
                private modalCtrl: ModalController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private user: User,
                private venue: Venue) {

    }

    ionViewWillEnter() {
      this.transactions = [];
      this.user.me((result) => {
          this.setupUserClass(result);
          this.transactions = this.user.transactions;
          console.log("My Transactions");
          console.log(this.user.transactions);

          let venueIds = _.pluck(this.transactions, "venue");

          venueIds = _.uniq(venueIds);
          
          venueIds.forEach((venueId) => {
            this.venue.getVenueById(venueId, (result) => {

              if(result && result.code === "OK")
                this.venues[venueId] = result.data.venue;
            });
          });
      });
    }

    private setupUserClass(result: any) {
        this.user.username = result.data.user.username;
        this.user.userId = result.data.user.id;
        this.user.firstName = result.data.user.firstName;
        this.user.active = result.data.user.active;
        this.user.createdAt = result.data.user.createdAt;
        this.user.deviceTokens = result.data.user.deviceTokens;
        this.user.favorites = result.data.user.favorites;
        this.user.paymentMethods = result.data.user.paymentMethods;
        this.user.phone = result.data.user.phone;
        this.user.photo = result.data.user.photo;
        this.user.referralCode = result.data.user.referralCode;
        this.user.rewardPoints = result.data.user.rewardPoints;
        this.user.roles = result.data.user.roles;
        this.user.socialProfiles = result.data.user.socialProfiles;
        this.user.transactions = result.data.user.transactions;
        this.user.updateAt = result.data.user.updatedAt;
        this.user.validate = result.data.user.validated;
    }

    close() {
      this.navCtrl.popToRoot();
    }

    showTransactionInfo(transaction) {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading...',
        cssClass: 'rover-loading-class'
      });
  
      loading.present();

      this.venue.getVenueById(transaction.venue, (result) => {
        //open modal
        loading.dismiss();
        console.log(result);
        if(result && result.code === "OK") {
          let venue = result.data.venue;
          let transactionInfoModal = this.modalCtrl.create(TransactionDetailsModal, {currentTransaction: transaction, currentVenue: venue});
          transactionInfoModal.present();
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
}
