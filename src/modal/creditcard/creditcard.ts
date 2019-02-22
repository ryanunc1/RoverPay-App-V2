import { Component } from '@angular/core';
import { NavController, LoadingController, ViewController, ModalController, AlertController } from 'ionic-angular';

import { CreditCardValidator, CreditCard } from 'angular-cc-library';

import { PinModal } from '../pin/pin';
import { User, PaymentMethods } from '../../implementation/roverpay.impl';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'modal-creditcard',
  templateUrl: 'creditcard.html',
})

export class CreditCardModal {

    private id: string;
    private pinCode: string = "";

    private paymentForm: FormGroup;

    private cc_fullname: string = "";
    private cc_nickname: string = "";
    private cc_zipcode: any;
    private cc_number: any;
    private cc_expMonth: any;
    private cc_expYear: any;
    private cc_cvc: any;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                private viewCtrl: ViewController,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private user: User,
                private paymentMethods: PaymentMethods) {

        console.log("This USer");
        console.log(this.user);

        this.paymentForm = new FormGroup({
          'name': new FormControl(this.cc_fullname, [<any>Validators.required]), 
          'nickname': new FormControl(this.cc_nickname, [<any>Validators.required]),
          'zipcode': new FormControl(this.cc_zipcode, [<any>Validators.required]),
          'creditCard': new FormControl(this.cc_number, [<any>Validators.required, <any>CreditCardValidator.validateCCNumber]),
          'expirationMonth': new FormControl(this.cc_expMonth, [<any>Validators.required]),
          'expirationYear': new FormControl(this.cc_expYear, [<any>Validators.required, <any>Validators.minLength(2), <any>Validators.maxLength(2)]),
          'cvc': new FormControl(this.cc_cvc, [<any>Validators.required, <any>Validators.minLength(3)])
        });
    }

    get name() { return this.paymentForm.get('name'); }

    get nickname() { return this.paymentForm.get('nickname'); }
  
    get zipcode() { return this.paymentForm.get('zipcode'); }
    
    get creditCard() { return this.paymentForm.get('creditCard'); }
  
    get expirationMonth() { return this.paymentForm.get('expirationMonth'); }

    get expirationYear() { return this.paymentForm.get('expirationYear'); }

    get cvc() { return this.paymentForm.get('cvc'); }
    

    ionViewDidLoad() {}

    ionViewWillEnter() {}

    close() {
      this.viewCtrl.dismiss();
    }

    savePayment() {
      console.log("Credit Card TYpe");
      let ccNumberString: string = this.paymentForm.get('creditCard').value;
      ccNumberString = ccNumberString.replace(/\s+/g,"");

      let ccNumber = parseInt(ccNumberString);

      let ccData = {
        "name": this.name.value,
        "cc": ccNumberString,
        "type": CreditCard.cardType(ccNumber),
        "exp_month": this.expirationMonth.value,
        "exp_year": this.expirationYear.value,
        "cvc": this.cvc.value
      }
      console.log("ccdata");
      console.log(ccData);

      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading...',
        cssClass: 'rover-loading-class'
      });

      loading.present();

      this.user.payeezyTokenizeCard(ccData, (response) => {
        console.log("Payeezy Response");
        console.log(response);
        
        if(response && response.results.Error) {
          let alert = this.alertCtrl.create({
            title: 'Failed to Add a Payment',
            message: response.results.Error.messages[0].description,
            buttons: [{
              text: "OK",
              handler: () => {
                this.viewCtrl.dismiss();
              }
            }],
            cssClass: 'rover-alert-class'
          });
          alert.present();
          loading.dismiss();
        } else {
          let paymentData = {
            "token": response.results.token.value,
            "cardholderName": response.results.token.cardholder_name,
            "expDate": response.results.token.exp_date,
            "cardType": response.results.token.type,
            "owner": this.user.userId,
            "zip": this.zipcode.value,
            "nickName": this.nickname.value
          }

          this.paymentMethods.addPayment(paymentData, (result) => {

            loading.dismiss();
            console.log("payment result");
            console.log(result);

            if(result && result.code === "CREATED") {

              this.user.paymentMethods.push(result.data);

              let alert = this.alertCtrl.create({
                title: 'Success',
                message: 'Successfully add a payment',
                buttons: [{
                  text: "OK",
                  handler: () => {
                    this.viewCtrl.dismiss();
                  }
                }],
                cssClass: 'rover-alert-class'
              });
              alert.present();
            } else {
              let alert = this.alertCtrl.create({
                title: 'Failed to Add a Payment',
                message: 'Please try again',
                buttons: [{
                  text: "OK",
                  handler: () => {
                    this.viewCtrl.dismiss();
                  }
                }],
                cssClass: 'rover-alert-class'
              });
              alert.present();
            }
          });
        }
      });
    }

    showPinModal() {
      let modal = this.modalCtrl.create(PinModal);
      modal.onDidDismiss((data) => {
        console.log("Data");
        console.log(data);

        if(!data) return;
        this.pinCode = data.pinCode;
      })
      modal.present();
    }

    deleteCC() {
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        cssClass: 'ccpayment-alert-class',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
          handler: () => {

          }
        }, {
          text: 'OK',
          cssClass: 'alert-ok-button',
          handler: () => {
            this.deleteCCConfirmed();
          }
        }]
      });
      alert.present();
    }

    resetPin() {
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Resetting your code will remove all payment methods. Are you sure want to continue?',
        cssClass: 'resetpin-alert-class',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
          handler: () => {}
        }, {
          text: 'OK',
          cssClass: 'alert-ok-button',
          handler: () => {
            this.deleteCCConfirmed();
          }
        }]
      });
      alert.present();
    }

    private deleteCCConfirmed() {
      let deleteId = this.user.paymentMethods[0].id;

      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading...',
        cssClass: 'rover-loading-class'
      });

      let data = {
        id: deleteId,
        active: false
      }
      this.paymentMethods.updatePayment(deleteId, data, (result) => {
        loading.dismiss();
        console.log("DELETE CC"); console.log(result);

        if(result && result.code === "OK") {
          for(let i = 0; i < this.user.paymentMethods.length; ++i) {
            if(this.user.paymentMethods[i].id === deleteId) {
              this.user.paymentMethods.splice(i,1);
              --i;
            }
          }
        } else {
          let alert = this.alertCtrl.create({
            title: 'Failed',
            message: 'Error deleting card',
            cssClass: 'ccpayment-alert-class',
            buttons: ["OK"]
          });
          alert.present();
        }
      });
      loading.present();
    }
}
