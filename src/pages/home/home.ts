import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openMenu() {
    if(this.menuCtrl.isOpen())
      this.menuCtrl.close();
    else
      this.menuCtrl.open();
  }

}
