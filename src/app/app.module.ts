import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

import { CreditCardDirectivesModule } from 'angular-cc-library';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { MyApp } from './app.component';
import { Walkthrough } from '../pages/walkthrough/walkthrough';
import { HomePage } from '../pages/home/home';
import { DetailPage } from '../pages/detail/detail';
import { ProfilePage } from '../pages/profile/profile';
import { FavoritePage } from '../pages/favorite/favorite';
import { PromotionPage } from '../pages/promotion/promotion';
import { RewardHistoryPage } from '../pages/rewardhistory/rewardhistory';
import { PayWizardPage } from '../pages/paywizard/paywizard';
import { PermissionPage } from '../pages/permission/permission';

import { CreditCardModal } from '../modal/creditcard/creditcard';
import { PinModal } from '../modal/pin/pin';
import { TransactionDetailsModal } from '../modal/transactiondetails/transactiondetails';
import { ChangePasswordModal } from '../modal/changepassword/changepassword';

import { APIProvider } from '../providers/roverpay.api';
import { User,
        Venue,
        Configs,
        Promocodes,
        PaymentMethods } from '../implementation/roverpay.impl';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

//prod
const config = { url: 'https://roverpay-socket-server.herokuapp.com/', options: {} };

//local
// const config = { url: 'http://192.168.254.100:3000', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Walkthrough,
    DetailPage,
    ProfilePage,
    FavoritePage,
    PromotionPage,
    RewardHistoryPage,
    PayWizardPage,
    PermissionPage,
    CreditCardModal,
    PinModal,
    TransactionDetailsModal,
    ChangePasswordModal
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CreditCardDirectivesModule,
    CurrencyMaskModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Walkthrough,
    DetailPage,
    ProfilePage,
    FavoritePage,
    PromotionPage,
    RewardHistoryPage,
    PayWizardPage,
    PermissionPage,
    CreditCardModal,
    PinModal,
    TransactionDetailsModal,
    ChangePasswordModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    APIProvider,
    User,
    Venue,
    Configs,
    Promocodes,
    PaymentMethods,
    SocialSharing,
    Facebook,
    Geolocation,
    HTTP
  ]
})
export class AppModule {}
