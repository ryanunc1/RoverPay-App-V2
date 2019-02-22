import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ActionSheetController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Walkthrough } from '../pages/walkthrough/walkthrough';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritePage } from '../pages/favorite/favorite';
import { PromotionPage } from '../pages/promotion/promotion';
import { RewardHistoryPage } from '../pages/rewardhistory/rewardhistory';
import { PermissionPage } from '../pages/permission/permission';

import { User } from '../implementation/roverpay.impl';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage: any;

  private storage: Storage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private user: User,
    private menuCtrl: MenuController,
    private actionSheetCtrl: ActionSheetController,
    public events: Events) {

    this.menuCtrl.swipeEnable(false);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.checkToken();

    events.subscribe('setHomePageAsRoot', () => {
      console.log("Set HomePage as Root");

      this.storage = window.localStorage;

      if(!(this.storage.getItem("permission"))) {
        this.nav.push(PermissionPage, {}, { animate: false });
      } else {
        console.log("Hello HomePage");
        this.rootPage = HomePage;
      }
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

  private checkToken() {

    if(this.user.getToken()) {

      this.user.me((data) => {
        console.log("ME");
        console.log(data);

        if(data.code === "OK") {
          this.setupUserClass(data);
          this.user.save();
        }
      });
      console.log("Go to Home");
      this.rootPage = HomePage;
      this.menuCtrl.swipeEnable(true);
    } else {
      console.log("Go to Login");
      this.rootPage = Walkthrough;
      this.menuCtrl.swipeEnable(false);
    }
  }

  navigatePage(menu: SideMenu) {
    switch(menu) {
      case 'profile': {
        this.nav.push(ProfilePage);
        break;
      }
      case 'favorite': {
        this.nav.push(FavoritePage);
        break;
      }
      case 'promotion': {
        this.nav.push(PromotionPage, {}, { animate: false });
        break;
      }
      case 'rewardhistory': {
        this.nav.push(RewardHistoryPage)
        break;
      }
      case 'logout': {
        this.doLogout();
        break;
      }
      case 'home': {
        this.rootPage = HomePage;
        this.nav.popToRoot();
        break;
      }
    }
  }

  private doLogout() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to logout?',
      cssClass: 'roverpay-actionsheet',
      buttons: [
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            this.user.removeStorage();
            this.clearUser();
            this.user.logout();
            this.rootPage = Walkthrough;
            this.nav.popToRoot({animate: false});
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  private clearUser() {
    this.user.userId = "";
    this.user.username = "";
    this.user.token = "";
    this.user.firstName = "";
    this.user.lastName = "";

    this.user.active = false; 
    this.user.createdAt = "";
    this.user.deviceTokens = [];
    this.user.favorites = [];
    this.user.paymentMethods = [];
    this.user.phone = "";
    this.user.photo = "";
    this.user.referralCode = "";
    this.user.rewardPoints = 0
    this.user.roles = [];
    this.user.socialProfiles = [];
    this.user.transactions = [];
    this.user.updateAt = "";
    this.user.validate = false;
  }
}

export type SideMenu = 'home' | 'profile' | 'favorite' | 'rewardhistory' |'promotion' | 'logout';

