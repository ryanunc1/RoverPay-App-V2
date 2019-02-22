export interface User {
  userId: string;
  username: string;
  token: string;
  firstName: string;
  lastName: string;

  active: boolean;
  createdAt: any;
  deviceTokens: any;
  favorites: any;
  paymentMethods: any;
  phone: string;
  photo: string;
  referralCode: string;
  rewardPoints: number;
  roles: any;
  socialProfiles: any;
  transactions: any;
  updateAt: any;
  validate: boolean;

  login(username: string, password: string, callback: () => void);

  signup(username:string, password: string, firstName: string, callback: (result: any) => void);

  getToken();

  setToken(token: string);

  removeStorage();
  
  setUser(user: string);
  
  getUser();

  updateProfile(id: string, email: string, callback: (result: any) => void);

  updateName(id: string, firstName: string, lastName: string, callback: (result: any) => void);

  updatePassword(password: string, callback: (result: any) => void);

  addFavorite(venueId: string, callback: (result: any) => void);

  removeFavorite(venueId, string, callback: (result: any) => void);

  getReferralCode(callback: (result: any) => void);
  
  removeObjectFunc(this);

  addPin(pinCode: string, callback: (result: any) => void);

  payeezyTokenizeCard(ccData: any, callback: (result: any) => void);

  forgotPassword(username: string, callback: (result: any) => void);

  changePassword(changePasswordData: any, callback: (result: any) => void);

  enablePush();
  
  save(this);

  me(callback: (result: any) => void);

  logout();

  isLocationEnabled();

  isPushNotifEnabled();

  enableLocation();
}