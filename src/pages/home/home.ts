import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { User, Venue } from '../../implementation/roverpay.impl';
import { DetailPage } from '../../pages/detail/detail';
import { DomSanitizer } from '@angular/platform-browser';

import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  private isLocationOn: boolean = false;

  private venues: any = [];

  private sortedTrans = [];

  private lat;

  private long;

  private maxDistance = 20;

  private locationError = false;

  private isLoading = false;

  private zipCode = "";

  private searchText = "";

  constructor(public navCtrl: NavController,
              private user: User,
              private venueModel: Venue,
              public loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private sanitizer: DomSanitizer,
              private geolocation: Geolocation) {
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    this.getItems();
  }

  ionViewDidEnter() {


  }

  private getItems(refresher = null) {
    
    this.venues = [];

    let isLocationEnabled = !(this.user.isLocationEnabled()) ? true : false;

    if(isLocationEnabled) {
      this.getVenueByLocation(refresher);
    } else {
      this.getAllVenue(refresher);
    }
  }

  private getVenueByLocation(refresher = null) {
    this.locationError = false;

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });
    this.isLoading = true;
    loading.present();

    this.sortedTrans = _.sortBy(this.user.transactions, function (t) {
      return moment(t.createdAt).unix() * -1;
    });


    this.geolocation.getCurrentPosition({ timeout: 15000, enableHighAccuracy: false }).then((response) => {

      this.lat = response.coords.latitude;
      this.long = response.coords.longitude;
      this.maxDistance = 20;

      let query = `?lat=${this.lat}&lon=${this.long}&maxDistance=${this.maxDistance}`;

      console.log("Query String"); console.log(query);

      this.venueModel.getAllVenue(query, (response) => {
        loading.dismiss();
        this.isLoading = false;
        console.log("LOcation");
        console.log(response);
        if(refresher) refresher.complete();
        if(response && response.code === "OK") {
          this.venues = response.data;
        } else {
          this.venues = [];
        }
      });

    }).catch((error) => {
      if(refresher) refresher.complete();
      this.isLoading = false;
      this.locationError = true;
      loading.dismiss();

      console.log("Location Error"); console.log(error);
      this.getAllVenue();
    });
  }

  private getAllVenue(refresher = null) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.sortedTrans = _.sortBy(this.user.transactions, function (t) {
      return moment(t.createdAt).unix() * -1;
    });

    this.isLoading = true;

    this.zipCode = "";
    this.lat = "";
    this.long = "";
    this.searchText = "";

    this.venueModel.getAllVenue('?getAll=true', (response) => {
      loading.dismiss();
      this.isLoading = false;
      if(refresher) refresher.complete();
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
      } 
    });
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
        let trans = _.find(this.sortedTrans, function (t: any) {
          return t.venue === campaign.venue;
        });

        if (!!trans && !!trans.closed && trans.status === 'completed') {
          // then this might be a winner. we just need to test if it has been less than
          // the configured number of hours found in cam.filterData.returnHours
          if (moment(trans.closed)
            .add(campaign.filterData.returnHours, 'hours')
            .isAfter(moment())) {
            console.log(venue.title + ': Setting active campaign to return_soon at ' + campaign.rewardLevel + '%');
            venue.campaignToDisplay = campaign;
            break;
          }
        }
      } else if(campaign.filter === "try_us_again") {
        let trans = _.find(this.sortedTrans, function (t: any) {
          return t.venue === campaign.venue;
        });

        if (!!trans && !!trans.closed && trans.status === 'completed') {
          // then this might be a winner. we just need to test if it has been more than
          // the configured number of days found in cam.filterData.returnDays
          if (moment(trans.closed)
            .add(campaign.filterData.returnDays, 'days')
            .isBefore(moment())) {
            console.log(venue.title + ': Setting active campaign to try_us_again at ' + campaign.rewardLevel + '%');
            venue.campaignToDisplay = campaign;
            break;
          }
        }

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
    console.log("VENUE USER"); console.log(venue);

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.venueModel.getVenueById(venue.id, (result) => {
      loading.dismiss();
      let resVenue = venue;
      if(result && result.code === "OK") resVenue = result.data.venue;
      this.navCtrl.push(DetailPage, {"venue": resVenue});
    });
    
  }

  keydown(event) {
    if(event.keyCode === 13) {
      console.log("zip code"); console.log(this.zipCode);
      console.log("search text"); console.log(this.searchText);

      this.getVenueBySearch()
    }
  }

  private getVenueBySearch() {
    let query = "";

    if(this.zipCode === '' && (!this.lat || !this.long)) {
      query += "?getAll=true";
    } else if (this.zipCode === '') {
      query += `?lat=${this.lat}&lon=${this.long}&maxDistance=${this.maxDistance}`;
    } else {
      query += `?maxDistance=${this.maxDistance}&zip=${this.zipCode}`;
    }

    if(this.searchText) query += `&title=${this.searchText}`;

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      cssClass: 'rover-loading-class'
    });

    loading.present();

    this.sortedTrans = _.sortBy(this.user.transactions, function (t) {
      return moment(t.createdAt).unix() * -1;
    });

    this.isLoading = true;

    this.venueModel.getAllVenue(query, (response) => {
      loading.dismiss();
      this.isLoading = false;
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
      } 
    });
  }
}

