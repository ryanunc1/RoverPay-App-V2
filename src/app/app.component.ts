import { Component } from '@angular/core';
import { Platform, MenuController, ActionSheetController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Walkthrough } from '../pages/walkthrough/walkthrough';
import { HomePage } from '../pages/home/home';

import { User } from '../implementation/roverpay.impl';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private user: User,
    private menuCtrl: MenuController,
    private actionSheetCtrl: ActionSheetController) {

    this.menuCtrl.swipeEnable(false);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.checkToken();
  }

  private checkToken() {
    
    this.user.getToken((data) => {
      console.log("Token");
      console.log(data);

      if(data) {
        console.log("Go to Home");
        this.rootPage = HomePage;
        this.menuCtrl.swipeEnable(true);
      } else {
        console.log("Go to Login");
        this.rootPage = Walkthrough;
        this.menuCtrl.swipeEnable(false);
      }

    })
  }

  navigatePage(menu: SideMenu) {
    
    switch(menu) {
      case 'profile': {
        break;
      }
      case 'logout': {
        this.doLogout();
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
            this.user.removeToken();
            this.rootPage = Walkthrough;
            location.reload();
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
}

export type SideMenu = 'profile' | 'logout';

