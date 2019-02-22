import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import * as config from '../config/payeezy';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const APIURL = 'https://roverpay-api-dev.herokuapp.com/v1/';

@Injectable()
export class APIProvider {
	
	
	private storage: Storage;

  private token: any = "";
  constructor(public http: HttpClient) {

			this.token = "";
			this.storage = window.localStorage;

	}

	getToken() {
		return this.storage.getItem("auth-token");
	}
	
	me(callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		this.callAPI('users/me', {}, "get", (result: any) => {
			callback(result);
		})
	}

  login(username: string, password: string, callback: (result: any) => void) {
    let data = {
      "username": username,
      "password": password,
      "phone": ""
    }

    this.callAPI('auth/signin', data, "post", (result) => {
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

    this.callAPI('auth/signup', data, "post", (result) => {
      callback(result);
    });
  }

  searchVenue(query: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
    this.callAPI('venues/search' + query, {}, "get", (result) => {
      callback(result);
    });
	}

	getVenueById(id: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		this.callAPI('venues/' + id, {}, "get", (result) => {
			callback(result);
		})
	}

  updateProfile(id: string, email: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"id": id,
			"email": email
		}

		this.callAPI('users/updateProfile', data, "post", (result) => {
			callback(result);
		});
	}

	updateName(id: string, firstName: string, lastName: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"id": id,
			"firstName": firstName,
			"lastName": lastName
		}

		this.callAPI('users/' + id, data, "put", (result) => {
			callback(result);
		})
	}

	updatePassword(password: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"password": password
		}
		this.callAPI('users/changePassword', data, "post", (result) => {
			callback(result);
		})
	}

	addPin(pinCode: string, id: string, callback: (result: any) => void) {
		let data = {
			"id": id,
			"pinCode": pinCode
		}
		this.callAPI(`users/${id}/pin`, data, "put", (result) => {
			callback(result);
		});
	}

	addFavorite(venueId: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"venue_id": venueId
		}
		
		this.callAPI('users/addFavorite', data, "post", (result) => {
			callback(result);
		});
	}

	removeFavorite(venueId: string, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"venue_id": venueId
		}
		
		this.callAPI('users/removeFavorite', data, "post", (result) => {
			callback(result);
		});
	}

	getReferralCode(callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		console.log("TOKEN TOKEN"); console.log(this.token);
		this.callAPI('users/getReferralCode', {}, "get", (result) => {
			callback(result);
		});
	}

	getConfigs(callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		this.callAPI('configs/', {}, "get", (result) => {
			callback(result);
		});
	}
	
	redeem(code: string, user: any, callback: (result: any) => void) {
		if(!this.token) this.token = this.getToken();
		let data = {
			"code": code,
			"user": user
		}

		this.callAPI('promocodes/redeem', data, "post", (result) => {
			callback(result);
		})
	}

	payeezyTokenizeCard(ccData, callback: (result: any) => void) {
		
		let payeezy = config.default;

		console.log("ccdata"); console.log(ccData);
		let exp_date = ("0" + ccData.exp_month).slice(-2) + ccData.exp_year.toString();

		let params = {
			"apikey": payeezy.apiKey,
			"js_security_key": payeezy.securityKey,
			"auth": true,
			"ta_token": payeezy.taToken,
			"type": "FDToken",
			"credit_card.type": ccData.type,
			"credit_card.cardholder_name": ccData.name,
			"credit_card.card_number": ccData.cc,
			"credit_card.exp_date": exp_date,
			"credit_card.cvv": ccData.cvc
		}

		let url = payeezy.apiUrl + "securitytokens?";
		let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

		queryString = queryString.replace(" ", "+");
		url += queryString;

		this.http.jsonp(`${url}`, 'callback')
			.map(res => res)
			.subscribe(
				dataResponse => { console.log("payzeezy response"); console.log(dataResponse); callback(dataResponse); },
				errResponse => { callback(errResponse.error); }
			);
	}

	addPayment(paymentDetails: any, callback: (result: any) => void) {
		this.callAPI('paymentmethods', paymentDetails, "post", (result) => {
			callback(result);
		});
	}

	updatePayment(id: string, params: any, callback: (result: any) => void) {
		this.callAPI('paymentmethods/' + id, params, "put", (result) => {
			callback(result);
		});
	}

	authorizePayment(paymentData: any, callback: (result: any) => void) {
		this.callAPI('transactions/authorize', paymentData, "post", (result) => {
			callback(result);
		});
	}

	forgotPassword(username: string, callback: (result: any) => void) {
		let data = {
			"username": username
		};
		this.callAPI('auth/forgotPassword', data, "post", (result) => {
			callback(result);
		});
	}

	changePassword(changePasswordData: any, callback: (result: any) => void) {
		this.callAPI('auth/changePassword', changePasswordData, "post", (result) => {
			callback(result);
		});
	}

	logout() {
		this.token = "";
	}

  private callAPI(endpoint: string, data: any, callType: any, callback: (result: any | null) => void) {

		const headers = new HttpHeaders()
										.set("Content-Type", "application/json")
										.set("Accepts", "application/json")
										.set("Authorization", "JWT " + this.token)
		
    if(callType === "post") {
      this.http.post(APIURL + endpoint, data, {headers})
      .map(res => res)
      .subscribe(
        dataResponse => { console.log("response"); console.log(dataResponse); callback(dataResponse); },
        errResponse => { callback(errResponse.error); }
			);
		} else if (callType === "put") {
			this.http.put(APIURL + endpoint, data, {headers})
      .map(res => res)
      .subscribe(
        dataResponse => { console.log("response"); console.log(dataResponse); callback(dataResponse); },
        errResponse => { callback(errResponse.error); }
			);
		} else if(callType === "get") {
			this.http.get(APIURL + endpoint, {headers})
      .map(res => res)
      .subscribe(
        dataResponse => { console.log("response"); console.log(dataResponse); callback(dataResponse); },
        errResponse => { callback(errResponse.error); }
      );
    }
  }
}
