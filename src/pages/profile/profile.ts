import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

    private venue: any;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public menuCtrl: MenuController,
                private sanitizer: DomSanitizer,
                private navParams: NavParams) {
    }
    

    ionViewDidLoad() {
        
    }

    close() {
        this.navCtrl.popToRoot();
    }
}
