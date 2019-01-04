import { Injectable } from '@angular/core';

import * as model from '../models/roverpay.model';
import { APIProvider } from '../providers/roverpay.api';

import { Storage } from '@ionic/storage';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class Profile implements model.Profile {
    userId = "";
    username = "";
    firstName = "";

    updateDetails(callback: () => void) {

    }
}

@Injectable()
export class User extends Profile implements model.User {

    constructor(private storage: Storage, private api: APIProvider) {
        super();
    }

    userId = "";
    username = "";
    token = "";
    firstName = "";

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

    setToken(token: string){
        this.storage.set('auth-token', token);
    }

    getToken(callback: (data: any) => void) {
        this.storage.get('auth-token')
                    .then(data => callback(data));
    }

    removeToken() {
        this.storage.remove('auth-token');
    }

    profile: model.Profile;
}