import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';

import { User, Venue } from '../../implementation/roverpay.impl';
import { DetailPage } from '../../pages/detail/detail';

@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
})

export class FavoritePage {

    private favorites: any = [];

    constructor(public navCtrl: NavController,
                public menuCtrl: MenuController,
                private navParams: NavParams,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private user: User,
                private venueModel: Venue) {

        this.favorites = [];
        this.user.me((result) => {
            this.setupUserClass(result);
            this.calculateTotal();
            this.favorites = this.user.favorites;
            console.log("USER FAVORITES"); console.log(this.favorites);
        })
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

    ionViewWillEnter() {}

    navigateToDetailPage(favorite) {
        console.log("MY FAVORITE");
        console.log(favorite);

        let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading...',
            cssClass: 'rover-loading-class'
        });
      
        loading.present();

        this.venueModel.getVenueById(favorite.id, (result) => {
            loading.dismiss();
            let resVenue;
            if(result && result.code === "OK") {
                resVenue = result.data.venue;
                this.navCtrl.push(DetailPage, {"venue": resVenue});
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

    close() {
        this.navCtrl.popToRoot();
    }

    private calculateTotal() {
        setTimeout(() => {
            let transactions = this.user.transactions;
            let favorites = this.user.favorites;
            let totals = [];

            for(let i = 0; i < transactions.length; i++) {
                let trans = transactions[i];
                if(!totals[trans.venue])
                    totals[trans.venue] = trans.total
                else
                    totals[trans.venue] += trans.total
            }
    
            for(let i = 0; i < favorites.length; i++) {
                if(totals[favorites[i].id]) {
                    favorites[i].totalSpent = totals[favorites[i].id];
                } else {
                    favorites[i].totalSpent = 0;
                }
            }

            this.user.favorites = favorites;
        }, 25)
    }
}
