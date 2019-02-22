import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { PayWizardPage } from '../paywizard/paywizard';
import { User } from '../../implementation/roverpay.impl';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})

export class DetailPage {

    private venue: any;
    
    private favorites: any = [];

    private showDetails: boolean = false;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public menuCtrl: MenuController,
                private platform: Platform,
                private sanitizer: DomSanitizer,
                private user: User,
                private navParams: NavParams) {

        this.venue = this.navParams.get('venue');
        this.favorites = (this.user.favorites) ? this.user.favorites : [];
        this.showDetails = false;

        this.setFavorite();
    }

    ionViewWillEnter() {
    
        this.venue.campaigns = _.sortBy(this.venue.campaigns, function(cam: any) {
            return cam.rewardLevel * -1;
        });

        let sortedTrans = _.sortBy(this.user.transactions, function (t) {
            return moment(t.createdAt).unix() * -1;
        });

        for(let i = 0; i < this.venue.campaigns.length; i++) {
            let cam = this.venue.campaigns[i];

            if(!cam.active) {
                continue;
            }

            if (!!cam.startDate && moment(cam.startDate).isAfter(moment())) {
                cam.active = false;
            }
            if (!!cam.endDate && moment(cam.endDate).isBefore(moment())) {
                cam.active = false;
            }
            if (cam.filter === 'return_soon') {
                console.log('Checking return_soon');
                cam.active = false;
                // find the most recent transaction from the associated venue
                let trans = _.find(sortedTrans, function(t) {
                  return t.venue === cam.venue;
                });
                // console.log(trans);
                if (!!trans && !!trans.closed && trans.status === 'completed') {
                    // then this might be a winner. we just need to test if it has been less than
                    // the configured number of hours found in cam.filterData.returnHours
                    if (moment(trans.closed)
                        .add(cam.filterData.returnHours, 'hours')
                        .isAfter(moment())) {
                        console.log('Setting return_soon to true');
                        cam.active = true;
                    }
                }
            } else if (cam.filter === 'try_us_again') {
                console.log('Checking try_us_again');
                cam.active = false;
                // find the most recent transaction from the associated venue
                let trans = _.find(sortedTrans, function(t) {
                    return t.venue === cam.venue;
                });
                // console.log(trans);
                if (!!trans && !!trans.closed && trans.status === 'completed') {
                    // then this might be a winner. we just need to test if it has been more than
                    // the configured number of days found in cam.filterData.returnDays
                    if (moment(trans.closed)
                        .add(cam.filterData.returnDays, 'days')
                        .isBefore(moment())) {
                        console.log('Setting try_us_again to true');
                        cam.active = true;
                    }
                }
            }
        }

        console.log("VENUE CAMPAIGNS"); console.log(this.venue);
    }
    

    ionViewDidEnter() {
        this.showDetails = true;
    }

    private setFavorite() {
        console.log(this.venue);
        console.log(this.favorites);
        _.each(this.favorites, (favorite: any) => {
            if(favorite.id === this.venue.id) {
                this.venue.isFavorite = true;
                return true;
            }
        })
    }

    addFavorite() {
        this.venue.isFavorite = true;
        this.user.addFavorite(this.venue.id, (result) => {
            if(result &&  result.code === "OK") {
                this.venue.isFavorite = true;
            } else {
                this.venue.isFavorite = false;
            }
        })
    }

    removeFavorite() {
        this.venue.isFavorite = false;
        this.user.removeFavorite(this.venue.id, (result) => {
            if(result &&  result.code === "OK") {
                this.venue.isFavorite = false;
            } else {
                this.venue.isFavorite = true;
            }
        })
    }

    openMenu() {
        if(this.menuCtrl.isOpen())
            this.menuCtrl.close();
        else
            this.menuCtrl.open();
    }

    popPage() {
        this.navCtrl.pop();
    }

    getBackgroundImage(image) {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }

    gotoPayWizard() {
        this.navCtrl.push(PayWizardPage, {venue: this.venue});
    }

    getDirections(venue) {
        let url = "";

        if(this.platform.is('android')) {
            url = "https://www.google.com/maps/dir//" + venue.address + ", " + venue.city + ", " + venue.state + " " + venue.zip;
        } else {
            url = "http://maps.apple.com/?daddr=" + venue.address + ", " + venue.city + ", " + venue.state + " " + venue.zip;
        }

        window.open(url, "_system");
    }
}
