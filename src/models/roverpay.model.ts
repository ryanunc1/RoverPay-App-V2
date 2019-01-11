export interface User extends Profile {
    readonly userId;
    readonly username;
    readonly token;
    firstName: string;

    login(username: string, password: string, callback: () => void);

    signup(username:string, password: string, firstName: string, callback: (result: any) => void);

    getToken(callback: () => {});

    setToken(token: string, callback: () => void);

    getAllVenue(callback: (data: any) => void);

    setUser(user: string);

    getUser(callback: (data: any) => void);

    profile: Profile;
}

export interface Profile {

    readonly userId: string;
    readonly username: string;
    firstName: string;

    updateDetails(callback: () => void);
}