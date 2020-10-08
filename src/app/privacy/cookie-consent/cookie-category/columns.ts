import {ColumnBase as Column, Validators} from 'ng-mazdik-lib';

export function getColumnsPlayers(): Column[] {
  // pattern: '^[a-zA-Z ]+$'
  const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const urlRegex = new RegExp(expression);
  const columnsPlayers: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: false,
      filter: false,
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
      sortable: false,
      filter: false,
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
      sortable: false,
      filter: false,
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
      sortable: false,
      filter: false,
      type: 'textarea',
      frozen: false,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },
    {
      title: 'Value',
      name: 'value',
      sortable: false,
      filter: false,
      type: 'textarea',
      frozen: false,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2}),
    },

    {
      title: 'EXPIRES',
      name: 'expiry',
      sortable: false,
      filter: false,
      type: 'radio',
      options: [
        {id: 'seesion', name: 'Seesion'},
        {id: 'presistent', name: 'Presistent'},
      ],
    },

    {
      title: 'DURATION TYPE',
      name: 'duration_type',
      sortable: false,
      filter: false,
      type: 'select',
      options: [
      ],
      frozen: false,
      width: 150,
    },
    {
      title: 'DURATION',
      name: 'duration',
      sortable: false,
      filter: false,
      type: 'number',
      frozen: false,
      width: 150,
    },



    {
      title: 'Domain',
      name: 'property',
      sortable: false,
      filter: false,
      frozen: false,
      width: 100,
      formHidden: true
    },

    {
      title: 'Http Type',
      name: 'http_only',
      sortable: false,
      filter: false,
      frozen: false,
      width: 100,
      formHidden: true,
    },
  ];
  return columnsPlayers;
}
