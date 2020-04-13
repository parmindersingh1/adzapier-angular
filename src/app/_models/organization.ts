import { Properties } from './properties';

export class Organization {
    orgName: string;
    orgid: number;
    addressOne: string;
    addressTwo: string;
    city: string;
    state: string;
    zipcode: string;
    property: Properties[];
}
