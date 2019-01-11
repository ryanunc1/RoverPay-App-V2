import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { User } from '../../implementation/roverpay.impl';
import { Walkthrough } from '../../pages/walkthrough/walkthrough';
import { DetailPage } from '../../pages/detail/detail';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  private isLocationOn: boolean = false;

  private venues: any = [];

  constructor(public navCtrl: NavController,
              private user: User,
              public loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private sanitizer: DomSanitizer) {

    console.log('constructor home page');
  }

  ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.user.getUser((data: string) => {
      loading.dismiss();
      if(!data) { this.navCtrl.setRoot(Walkthrough) };
      let storageUser = JSON.parse(data);

      this.user.userId = storageUser.userId;
      this.user.username = storageUser.username;
      this.user.token = storageUser.token;
      this.user.firstName = storageUser.firstName;

      console.log("Storage");
      console.log(this.user);

      if(this.isLocationOn) {

      } else {
        this.getItems();
      }

    });
    
    // if(this.isLocationOn) {
    //   //load data from geolocation
    // } else {
    //   //load data from show all venue
    // }
  }

  private getItems(refresher = null) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();
    this.venues = [];
    this.user.getAllVenue((response) => {
      loading.dismiss();
      if(refresher) refresher.complete();
      console.log("Venues");
      console.log(response);

      if(response.code == "OK") {
        this.venues = response.data;

        //setup campaign

        if(this.venues.length <= 0) return;

        _.each(this.venues, (venue: any) => {
          venue.campaigns = _.sortBy(venue.campaigns, (campaign: any) => {
            return campaign.rewardLevel * -1;
          });
          this.processCampaign(venue);
        });

      } else {

      }

    })
  }

  private processCampaign(venue) {
    for(let i = 0; i < venue.campaigns.length; i++) {
      let campaign = venue.campaigns[i];

      if(!campaign.active) {
        continue;
      }

      if(!!campaign.startDate && moment(campaign.startDate).isAfter(moment())) {
        continue
      }

      if (!!campaign.endDate && moment(campaign.endDate).isBefore(moment())) {
        continue;
      }

      if(campaign.filter === "always_on") {
        venue.campaignToDisplay = campaign;
        break;
      } else if(campaign.filter === "happy_hour") {
        let day = moment().day();
        let hour = moment().hour();
        let isToday = _.sortBy(campaign.repeatDay, (num) => { return num === day; });

        if (isToday && (campaign.repeatStartHour <= hour) && (campaign.repeatEndHour >= hour)) {
          venue.campaignToDisplay = campaign;
          break;
        }
      } else if(campaign.filter === "return_soon") {

      } else if(campaign.filter === "try_us_again") {

      }
    }
  }

  openMenu() {
    if(this.menuCtrl.isOpen())
      this.menuCtrl.close();
    else
      this.menuCtrl.open();
  }

  getBackgroundImage(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getItems(refresher);
  }

  gotoDetailPage(venue) {
    this.navCtrl.push(DetailPage, {"venue": venue});
  }

}
