import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})

export class DetailPage {

    private venue: any;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public menuCtrl: MenuController,
                private sanitizer: DomSanitizer,
                private navParams: NavParams) {
        
        this.venue = this.navParams.get('venue');
    }
    

    ionViewDidLoad() {
        
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
}
