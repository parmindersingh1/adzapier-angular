export const credForm = {
    mysql: [{
      key: 'host',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'port',
      secret_1: '',
      type: 'number',
      required: true
    }, {
      key: 'database',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'username',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'password',
      secret_1: '',
      type: 'password',
      required: true
    },
    ],
    postgresql: [{
      key: 'host',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'port',
      secret_1: '',
      type: 'number',
      required: true
    }, {
      key: 'database',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'username',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'password',
      secret_1: '',
      type: 'password',
      required: false
    },
    ],
    mailchimp: [{
      key: 'apiKey',
      secret_1: '',
      type: 'text',
      required: true
    },
      {
        key: 'listID',
        secret_1: '',
        type: 'text',
        required: true
      }
    ],
    http: [{
      key: 'url',
      secret_1: '',
      type: 'text',
      required: true
    }, {
      key: 'protocol',
      secret_1: '',
      type: 'select',
      options: ['http', 'https'],
      required: true
    },
      {
        key: 'request_type',
        secret_1: '',
        type: 'select',
        options: ['Authorization'],
        required: true
      },
      {
        key: 'auth_type',
        secret_1: '',
        type: 'select',
        options: ['Bearer'],
        required: true
      }, {
        key: 'token',
        secret_1: '',
        type: 'text',
        required: true
      }
    ],
  activecampaign: [{
      key: 'account_name',
      secret_1: '',
      type: 'text',
      required: true
    },
      {
        key: 'api_token',
        secret_1: '',
        type: 'textarea',
        required: true
      },
    ],
  sendinblue: [{
    key: 'api_key',
    secret_1: '',
    type: 'text',
    required: true
  },
  ],
  sendgrid: [{
    key: 'authorization',
    secret_1: '',
    type: 'textarea',
    required: true
  },
  ]
  }
;
