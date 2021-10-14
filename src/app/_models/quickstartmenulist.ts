import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class QuickStartMenuList {
  constructor() { }
  loadQuickstartMenu(): any {
    return [
      {
        "index": 1,
        "indextext": "Getting Start",
        "quicklinks": [
          {
            "linkid": 1,
            "link": "/settings/company",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add Company details",
            "divguidetext": "addcompanydetails",
            "tooltipdescription":"Add/Edit company details"
          },
          {
            "linkid": 2,
            "link": "/settings/organizations",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add Organization",
            "divguidetext": "addorganization",
            "tooltipdescription":"Add a new organization"
          },
          {
            "linkid": 3,
            "link": "/settings/organizations/details",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add Property",
            "divguidetext": "addproperty",
            "tooltipdescription":"Add a new property under organization"
          }
        ]
      },
      {
        "index": 2,
        "indextext": "Subscription",
        "quicklinks": [
          {
            "linkid": 4,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Subscription",
            "divguidetext": "subscription",
            "tooltipdescription":"Subscribe to our plans"
          }
        ]
      },
      {
        "index": 3,
        "indextext": "Cookie Consent Management",
        "quicklinks": [
          {
            "linkid": 5,
            "link": "/settings/billing/pricing",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add Cookie Consent subscription",
            "divguidetext": "addcookieconsentsubscription",
            "tooltipdescription":"Subscribe to a Cookie Consent plan (Compare the features and choose your plan)"
          },
          {
            "linkid": 6,
            "link": "/settings/billing/manage",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Assigning Cookie Consent subscription to property",
            "divguidetext": "addcookieconsentsubscriptiontoproperty",
            "tooltipdescription":"Assign a property to the cookie consent subscription"
          },
          {
            "linkid": 7,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Cookie Scan and Add Cookies",
            "divguidetext": "cookiescan-addcookies",
            "tooltipdescription":"Scan your domain for the cookies"
          },
          {
            "linkid": 8,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Configure Cookie Banner",
            "divguidetext": "configure-cookie-banner",
            "tooltipdescription":"Build and configure a customized cookie banner for your domain"
          },
          {
            "linkid": 9,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Consent Tracking",
            "divguidetext": "consent-tracking",
            "tooltipdescription":"Track the record of each cookie consent from the domain users"
          },
          {
            "linkid": 10,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Consent Dashboard",
            "divguidetext": "consent-dashboard",
            "tooltipdescription":"View cookie consent dashboard"
          }
        ]
      },
      {
        "index": 4,
        "indextext": "Data Subjects Rights Management ",
        "quicklinks": [
          {
            "linkid": 11,
            "link": "/settings/billing/pricing",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add DSAR subscription",
            "divguidetext": "add-dsar-subscription",
            "tooltipdescription":"Subscribe to a DSAR plan (Compare the features and choose your plan)"
          },
          {
            "linkid": 12,
            "link": "/settings/billing/manage",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Assign DSAR subscription to organization",
            "divguidetext": "assign-dsar-subscription-to-organization",
            "tooltipdescription":"Assign an organization to the DSAR subscription"
          },
          {
            "linkid": 13,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Workflows",
            "divguidetext": "workflows",
            "tooltipdescription":"View the predefined workflows or create a customized workflow"
          },
          {
            "linkid": 14,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Web form",
            "divguidetext": "web-form",
            "tooltipdescription":"Create customized web form and embed with your domain to intake the requests"
          },
          {
            "linkid": 15,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "DSAR Requests",
            "divguidetext": "dsar-requests",
            "tooltipdescription":"View the requests received, organize and process to fulfill."
          },
          {
            "linkid": 16,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "DSAR Dashboard",
            "divguidetext": "dsar-dashboard",
            "tooltipdescription":"View DSAR dashboard"
          },
          {
            "linkid": 17,
            "link": "/settings",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Connect to Systems (Coming Soon)",
            "divguidetext": "connect-to-systems",
            "tooltipdescription":"Connect to Systems"
          }
        ]
      },
      {
        "index": 5,
        "indextext": "Consent Preference",
        "quicklinks": [
          {
            "linkid": 18,
            "link": "/settings/billing/pricing",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Add Consent Preference subscription",
            "divguidetext": "add-consent-preference-subscription",
            "tooltipdescription":"Subscribe to a Consent Preference plan (Compare the features and choose your plan)"
          },
          {
            "linkid": 19,
            "link": "/settings/billing/manage",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Assign Consent Preference subscription to property",
            "divguidetext": "assign-consent-preference-subscription-toproperty",
            "tooltipdescription":"Assign a property to the consent preference subscription"
          },
          {
            "linkid": 20,
            "link": "/settings",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "JavaScript and APIs for implementation",
            "divguidetext": "javascript-apisfor-implementation",
            "tooltipdescription":"Find the API to implement the recording of consents"
          },
          {
            "linkid": 21,
            "link": "/settings",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Manage Consent Records",
            "divguidetext": "manage-consent-records",
            "tooltipdescription":"View comprehensive record of consents from the domain users"
          },
          {
            "linkid": 22,
            "link": "/",
            "islinkclicked": false,
            "isactualbtnclicked": false,
            "linkdisplaytext": "Consent Preference Dashboard",
            "divguidetext": "consent-preference-dashboard",
            "tooltipdescription":"View consent preference dashboard"
          }
        ]
      }
    ]
    // return qsMenu;
  }
}