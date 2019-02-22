import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { User, PaymentMethods } from '../../implementation/roverpay.impl';

import { CreditCardModal } from '../../modal/creditcard/creditcard'

@Component({
  selector: 'modal-pin',
  templateUrl: 'pin.html',
})

export class PinModal {

  private pinMessage: string = "";

  private pinEntry: string = "";

  private firstPin: string = "";

  private state;

  private paymentData;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private nav: NavParams,
              private user: User,
              private payment: PaymentMethods) {
  }
  

  ionViewWillEnter() {
      this.state = this.nav.get("state");
      this.paymentData = this.nav.get("paymentData");
      console.log("STATE"); console.log(this.state);
  }

  close() {
    this.viewCtrl.dismiss({success: false});
  }

  cancelPinEntry() {
    this.viewCtrl.dismiss();
  }

  editPaymentMethod() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(CreditCardModal);
    modal.onDidDismiss((data) => {

    })
    modal.present();
  }

  pinButtonClicked(pin: string) {

    if(this.state === "paywizard") {
      if(pin === "backspace") {
        if(this.pinEntry.length > 0)
          this.pinEntry = this.pinEntry.slice(0, -1);
      } else {
        if(this.pinEntry.length < 4) {
          this.pinEntry += pin;
        }
        
        if(this.pinEntry.length === 4) {
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading...',
            cssClass: 'rover-loading-class'
          });

          loading.present();

          this.paymentData.pinCode = this.pinEntry;

          console.log("PAYMENT DATA");
          console.log(this.paymentData);

          this.payment.authorizePayment(this.paymentData, (result) => {
            loading.dismiss();

            console.log("Payment Wizard Result");
            console.log(result);

            if(result && result.code === "OK") {
              this.viewCtrl.dismiss({result: result});
            } else {
              let alert = this.alertCtrl.create({
                title: 'Failed',
                message: result.data,
                buttons: [{
                  text: "OK",
                  cssClass: 'alert-save-button',
                  handler: () => {}
                }],
                cssClass: 'rover-alert-class'
              });
              alert.present();
              alert.onDidDismiss(() => {
                this.pinEntry = "";
              });
            }
          });
        }
      }    
      return;
    }

    if(pin === "backspace") {
      if(this.pinEntry.length > 0)
        this.pinEntry = this.pinEntry.slice(0, -1);
    } else {
      if(this.pinEntry.length < 4) {
        this.pinEntry += pin;
      }
      
      if(this.pinEntry.length === 4) {
        if(!this.firstPin) {
          setTimeout(() => {
            this.firstPin = this.pinEntry;
            this.pinEntry = "";
            this.pinMessage = "Enter your code again";
          }, 10);
        } else if(this.firstPin !== this.pinEntry) {
          console.log("pin mismatch");

          let alert = this.alertCtrl.create({
            title: 'Code Entry Mismatch',
            message: 'Please try again',
            buttons: ["OK"],
            cssClass: 'rover-alert-class'
          });
          alert.present();

          this.pinEntry = "";
          this.firstPin = "";
          this.pinMessage = "";
        } else {
          //update pin on storage
          console.log("Pin match");

          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading...',
            cssClass: 'rover-loading-class'
          });

          loading.present();

          this.user.addPin(this.firstPin, (result) => {
            loading.dismiss();
            this.viewCtrl.dismiss({"pinCode": this.firstPin});
          })
          
        }
      }
    }
  }
}
