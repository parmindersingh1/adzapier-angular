import {ColumnBase as Column, Validators} from 'ng-mazdik-lib';

export function getColumnsPlayers(): Column[] {
  // pattern: '^[a-zA-Z ]+$'
  const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const urlRegex = new RegExp(expression);
  const columnsPlayers: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: true,
      filter: true,
      frozen: true,
      width: 100,
      formHidden: true,
      type: 'number',
    },
    {
      title: 'COOKIE NAME',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },
    {
      title: 'HOST',
      name: 'path',
      sortable: true,
      filter: true,
      frozen: false,
      // type: 'tex',
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },
    {
      title: 'Category',
      name: 'category',
      sortable: true,
      filter: true,
      type: 'select',
      options: [
      ],
      validatorFunc: Validators.get({required: true}),
    },

    {
      title: 'PARTY',
      name: 'party',
      sortable: true,
      filter: true,
      type: 'radio',
      options: [
        {id: 'first_party', name: 'First Party'},
        {id: 'third_party', name: 'Third Party'},
      ],
      validatorFunc: Validators.get({required: true}),
    },
    {
      title: 'Description',
      name: 'description',
      sortable: true,
      filter: true,
      type: 'textarea',
      frozen: false,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },
    {
      title: 'Value',
      name: 'value',
      sortable: true,
      filter: true,
      type: 'textarea',
      frozen: false,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },

    {
      title: 'EXPIRES',
      name: 'expiry',
      sortable: true,
      filter: true,
      type: 'radio',
      options: [
        {id: 'seesion', name: 'Seesion'},
        {id: 'presistent', name: 'Presistent'},
      ],
    },


    {
      title: 'DURATION',
      name: 'duration',
      sortable: true,
      filter: true,
      type: 'number',
      frozen: false,
      width: 150,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },

    {
      title: 'DURATION TYPE',
      name: 'duration_type',
      sortable: true,
      filter: true,
      type: 'select',
      options: [
      ],
      frozen: false,
      width: 150,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },

    {
      title: 'Domain',
      name: 'property',
      sortable: true,
      filter: true,
      frozen: false,
      width: 100,
      formHidden: true
    },

    {
      title: 'Http Type',
      name: 'http_only',
      sortable: true,
      filter: true,
      frozen: false,
      width: 100,
      formHidden: true,
    },
  ];
  return columnsPlayers;
}
