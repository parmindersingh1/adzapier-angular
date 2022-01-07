export const LanguageListNewsletter = [
  {
    title: 'English (United States)',
    code: 'enUS',
    countryFlag: 'us',
  },
  {
    title: 'Italian (Italy)',
    code: 'itIT',
    countryFlag: 'it',
  },
  {
    title: 'Chinese (PRC)',
    code: 'zhCN',
    countryFlag: 'cn',
  },
  // {
  //   title: 'German (Standard)',
  //   code: 'deDE',
  //   countryFlag: 'de',
  // },
  // {
  //   title: 'Russian (Russia)',
  //   code: 'ruRU',
  //   countryFlag: 'ru',
  // },
  // {
  //   title: 'French (France)',
  //   code: 'frFR',
  //   countryFlag: 'fr',
  // },
  // {
  //   title: 'Portuguese (Portugal)',
  //   code: 'ptPT',
  //   countryFlag: 'pt',
  // },
  // {
  //   title: 'Spanish (Spain)',
  //   code: 'esES',
  //   countryFlag: 'es',
  // },
  // {
  //   title: 'Dutch (Standard)',
  //   code: 'nlNL',
  //   countryFlag: 'nl',
  // }

];

export const newsLetterContent = {
  enUS: {
    title: 'Join Our Newsletter',
    description: 'Stay In The Loop!',
    firstName : 'First name',
    lastName: 'Last name',
    city: 'City',
    country: 'Country',
    zipCode: 'Zip Code',
    email: 'Email address',
    privacyText: 'I agree to the',
    termAndCondition: 'Terms and Conditions ',
    privacyPolicy: ' Privacy Policy',
    poweredByText: 'Powered by',
    subscribeButtonText: 'Subscribe',
  },
  zhCN: {
    title: '加入我们的通讯',
    description: '留在循环中！',
    firstName : '名',
    lastName: '姓',
    city: '城市',
    country: '国家',
    zipCode: '邮政编码',
    email: '电子邮件地址',
    privacyText: '我同意',
    termAndCondition: '条款和条件 ',
    privacyPolicy: ' 隐私政策',
    poweredByText: '供电',
    subscribeButtonText: '订阅',
  },
  itIT: {
    title: 'Iscriviti alla nostra newsletter',
    description: 'Rimani nel giro!',
    firstName : 'Nome di battesimo',
    lastName: 'Cognome',
    city: 'Città',
    country: 'Nazione',
    zipCode: 'Cap',
    email: 'Indirizzo email',
    privacyText: 'sono d\'accordo con',
    termAndCondition: 'Termini e Condizioni',
    privacyPolicy: 'politica sulla riservatezza',
    poweredByText: 'Powered by',
    subscribeButtonText: 'Subscribe',
  },
};

export const newsLetterFormBuilder = [
    {
      key: 'first_Name',
      display: true,
      required: true,
      minLength: 3,
      maxLength: 14,
    },
    {
      key: 'last_Name',
      display: true,
      required: true,
      minLength: 3,
      maxLength: 12,
    },
    {
      key: 'city',
      display: true,
      required: true,
      minLength: 3,
      maxLength: 8,
    },
    {
      key: 'country',
      display: true,
      required: true,
      minLength: 3,
      maxLength: 9,
    },
    {
      key: 'zip_Code',
      display: true,
      required: true,
      minLength: 5,
      maxLength: 6,
    },
    {
      key: 'email',
      display: true,
      required: true,
      emailValidation: true
    },
    {
      key: 'privacy_Policy',
      display: true,
      required: true,
    }
]
export const NewsLetterDisplayFrequency = [
  {name: 'Hour', code: 'hours'},
  {name: 'Day', code: 'days'},
  {name: 'Page View', code: 'pageViews'}
];

export const NewsLetterLightTheme = {
  HeaderBackgroundColor: '#ffffff',
  HeaderTextColor: '#333333',
  BodyBackgroundColor: '#fee2e1',
  BodyTextColor: '#333333',
  BorderColor: '#f87271',
  SubscribeButtonBackgroundColor: '#92c6fd',
  SubscribeButtonTextColor: '#222222',
}

export const NewsLetterDarkTheme = {
  HeaderBackgroundColor: '#010e20',
  HeaderTextColor: '#ffffff',
  BodyBackgroundColor: '#010e20',
  BodyTextColor: '#ffffff',
  BorderColor: '#2196F3',
  SubscribeButtonBackgroundColor: '#92c6fd',
  SubscribeButtonTextColor: '#222222',
}
