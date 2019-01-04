import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const APIURL = 'https://roverpay-api-dev.herokuapp.com/v1/';

@Injectable()
export class APIProvider {
  
  constructor(public http: HttpClient) {
  
  }

  login(username: string, password: string, callback: (result: any) => void) {
    let data = {
      "username": username,
      "password": password,
      "phone": ""
    }

    this.callAPI('auth/signin', data, (result) => {
      callback(result);
    });
  }

  signup(username:string, password: string, firstName: string, phone: string, callback: (result: any) => void) {
    let data = {
      "email": username,
      "firstName": firstName,
      "password": password,
      "phone": phone,
      "username": username
    }

    this.callAPI('auth/signup', data, (result) => {
      callback(result);
    });
  }

  private callAPI(endpoint: string, data: any, callback: (result: any | null) => void) {
    this.http.post(APIURL + endpoint, data)
      .map(res => res)
      .subscribe(
        dataResponse => { console.log("response"); console.log(dataResponse); callback(dataResponse); },
        errResponse => { callback(errResponse.error); }
      );
  }
}
