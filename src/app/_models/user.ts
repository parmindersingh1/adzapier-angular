import {UserRole} from '../_models/UserRole';

export class User {
    firstname: string;
    lastname: string;
    address1: string;
    address2: string;
    city: string;
    state: boolean;
    zipcode: string;
    orgname: string;
    email: string;
    password: string;
    confirmpassword: string;
    token: string;
    uid: number;
    userole: UserRole[];


    //firstName: string;
    // lastName: string;

    // address1: string;
    // address2: string;
    // city: string;
    // state: boolean;
    // zipcode: string;
    // email: string;
    // password: string;
    //confirmpassword: string;
    // orgname: string;
    // roles: string;
}
