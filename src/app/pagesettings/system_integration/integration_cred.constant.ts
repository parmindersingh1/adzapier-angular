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
    http: [
      {
        key: 'method_type',
        secret_1: '',
        type: 'select',
        options: ['GET'],
        required: true
      },
      {
      key: 'full_url',
      secret_1: '',
      type: 'text',
      required: true
    },
      {
        key: 'authorization_header',
        secret_1: '',
        type: 'text',
        required: false
      },
       {
        key: 'token',
        secret_1: '',
        type: 'text',
        required: false
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
        type: 'text',
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
    type: 'text',
    required: true
  },
  ],
  moosend: [
    {
      key: 'api_key',
      secret_1: '',
      type: 'text',
      required: true
    },
    {
      key: 'mailing_list_id',
      secret_1: '',
      type: 'text',
      required: true
    }
  ],
  hubspot: [
    {
      key: 'api_key',
      secret_1: '',
      type: 'text',
      required: true
    }
  ]
  }
;
