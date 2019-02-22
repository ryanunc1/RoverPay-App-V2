import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'
import * as model from '../models/roverpay.model';
import { APIProvider } from '../providers/roverpay.api';

@Injectable()
export class Promocodes {
    constructor(private api: APIProvider) {}

    redeem(code: string, user: any, callback: (result: any) => void) {
        this.api.redeem(code, user, (result) => {
            callback(result);
        });
    }
}

@Injectable()
export class PaymentMethods {
    constructor(private api: APIProvider) {}

    authorizePayment(paymentData: any, callback: (result: any) => void) {
        this.api.authorizePayment(paymentData, (result) => {
            callback(result);
        });
    }

    addPayment(paymentDetails: any, callback: (result: any) => void) {
        this.api.addPayment(paymentDetails, (result) => {
            callback(result);
        });
    }

    updatePayment(id: string, params: any, callback: (result: any) => void) {
        this.api.updatePayment(id, params, (result) => {
            callback(result);
        });
    }
}

@Injectable()
export class Configs {
    constructor(private api: APIProvider) {}

    getConfigs(callback: (result: any) => void) {
        this.api.getConfigs((result) => {
            callback(result);
        });
    }
}

@Injectable()
export class Venue {
    constructor(private api: APIProvider) {}

    getAllVenue(query: string, callback: (result: any) => void) {
        this.api.searchVenue(query, (result) => {
            callback(result);
        });
    }

    getVenueById(id: string, callback: (result: any) => void) {
        this.api.getVenueById(id, (result) => {
            callback(result);
        });
    }
}

@Injectable()
export class User implements model.User {
    private storage: Storage;
    constructor(private api: APIProvider, private platform: Platform) {
        this.storage = window.localStorage;
    }

    userId = "";
    username = "";
    token = "";
    firstName = "";
    lastName = "";

    active = false; 
    createdAt = "";
    deviceTokens = [];
    favorites = [];
    paymentMethods = [];
    phone = "";
    photo = "";
    referralCode = "";
    rewardPoints = 0
    roles = [];
    socialProfiles = [];
    transactions = [];
    updateAt = "";
    validate = false;

    login(username: string, password: string, callback: (result) => void) {
        this.api.login(username, password, (result) => {
            callback(result)
        });
    }

    signup(username:string, password: string, firstName: string, callback: (result: any) => void) {
        this.api.signup(username, password, firstName, "", (result) => {
            callback(result);
        });
    }

    setUser(user: string) {
        this.storage.setItem('user', user);
    }

    getUser() {
        return this.storage.getItem('user');
    }

    setToken(token: string) {
        this.storage.setItem('auth-token', token);
    }

    getToken() {
        return this.storage.getItem('auth-token')
    }

    removeToken() {
        this.storage.clear();
    }

    removeStorage() {
        this.storage.clear();
        this.clear();
    }

    getVenueByLocation() {

    }

    updateProfile(id: string, email: string, callback: (result: any) => void) {
        this.api.updateProfile(id, email, (result) => {
            callback(result);
        });
    }

    me(callback: (result: any) => void) {
        this.api.me((result) => {
            callback(result);
        });
    }

    updateName(id: string, firstName: string, lastName: string, callback: (result: any) => void) {
        this.api.updateName(id, firstName, lastName, (result) => {{
            callback(result);
        }});
    }

    updatePassword(password: string, callback: (result: any) => void) {
        this.api.updatePassword(password, (result) => {
            callback(result);
        });
    }

    addFavorite(venudId: string, callback: (result: any) => void) {
        this.api.addFavorite(venudId, (result) => {
            callback(result);
        });
    }

    removeFavorite(venudId: string, callback: (result: any) => void) {
        this.api.removeFavorite(venudId, (result) => {
            callback(result);
        });
    }

    getReferralCode(callback: (result: any) => void) {
        this.api.getReferralCode((result) => {
            callback(result);
        })
    }

    addPin(pinCode: string, callback: (result: any) => void) {
        this.api.addPin(pinCode, this.userId, (result) => {
            callback(result);
        })
    }

    payeezyTokenizeCard(ccData: any, callback: (result: any) => void) {
        this.api.payeezyTokenizeCard(ccData, (result) => {
            callback(result);
        });
    }

    enablePush() {
        this.storage.removeItem("pushDisabled");
        
    }

    enableLocation() {
        this.storage.removeItem("locationDisabled");
    }

    forgotPassword(username: string, callback: (result: any) => void) {
        this.api.forgotPassword(username, (result) => {
            callback(result);
        });
    }

    changePassword(changePasswordData: any, callback: (result: any) => void) {
        this.api.changePassword(changePasswordData, (result) => {
            callback(result);
        });
    }

    logout() {
        this.api.logout();
    }

    isLocationEnabled() {
        return this.storage.getItem('locationDisabled');
    }

    isPushNotifEnabled() {
        return this.storage.getItem('pushDisabled');
    }

    removeObjectFunc(this) {

        let user: model.User = this;

        let userData = {
            userId: user.userId,
            username: user.username,
            token: user.token,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active,
            createdAt: user.createdAt,
            deviceTokens: user.deviceTokens,
            favorites: user.favorites,
            paymentMethods: user.paymentMethods,
            phone: user.phone,
            photo: user.photo,
            referralCode: user.referralCode,
            rewardPoints: user.rewardPoints,
            roles: user.roles,
            socialProfiles: user.socialProfiles,
            transactions: user.transactions,
            updateAt: user.updateAt,
            validate: user.validate  
        }

        return userData;
    }

    save(this) {
  
        let user: model.User = this;

        let userData = {
            userId: user.userId,
            username: user.username,
            token: user.token,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active,
            createdAt: user.createdAt,
            deviceTokens: user.deviceTokens,
            favorites: user.favorites,
            paymentMethods: user.paymentMethods,
            phone: user.phone,
            photo: user.photo,
            referralCode: user.referralCode,
            rewardPoints: user.rewardPoints,
            roles: user.roles,
            socialProfiles: user.socialProfiles,
            transactions: user.transactions,
            updateAt: user.updateAt,
            validate: user.validate  
        }

        this.storage.setItem('user', JSON.stringify(userData));
    }

    private clear() {
        this.userId = "";
        this.username = "";
        this.token = "";
        this.firstName = "";
        this.lastName = "";
    
        this.active = false; 
        this.createdAt = "";
        this.deviceTokens = [];
        this.favorites = [];
        this.paymentMethods = [];
        this.phone = "";
        this.photo = "";
        this.referralCode = "";
        this.rewardPoints = 0
        this.roles = [];
        this.socialProfiles = [];
        this.transactions = [];
        this.updateAt = "";
        this.validate = false;
    }
}