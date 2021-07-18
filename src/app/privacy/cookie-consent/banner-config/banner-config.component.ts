import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectItemGroup} from 'primeng/api';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';

interface City {
  name: string,
  code: string
}
interface Country {
  name: string,
  code: string
}
@Component({
  selector: 'app-banner-config',
  templateUrl: './banner-config.component.html',
  styleUrls: ['./banner-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BannerConfigComponent implements OnInit, OnDestroy {
  step = 1;
  selectedCountry: any;
  countries: any[];
  selectedCountries1: Country[];
  gdprCountries: Country[];
  selectedValue: string = 'val1';
  bannerContentDropdownStep = 'cookieNotice';
  url: SafeResourceUrl = '';
  form!: FormGroup;
  testColor = '';
  themeType = 'dark';
  languages =  [
    {
      title: 'English (United States)',
      code: 'en-US',
      countryFlag: 'us',
    },
    {
      title: 'Italian (Italy)',
      code: 'it-IT',
      countryFlag: 'it',
    },
    {
      title: 'Chinese (PRC)',
      code: 'zh-CN',
      countryFlag: 'cn',
    },
    {
      title: 'German (Standard)',
      code: 'de-DE',
      countryFlag: 'de',
    },
    {
      title: 'Russian (Russia)',
      code: 'ru-RU',
      countryFlag: 'ru',
    },
    {
      title: 'French (France)',
      code: 'fr-FR',
      countryFlag: 'fr',
    },
    {
      title: 'Portuguese (Portugal)',
      code: 'pt-PT',
      countryFlag: 'pt',
    },
    {
      title: 'Spanish (Spain)',
      code: 'es-ES',
      countryFlag: 'es',
    },
    {
      title: 'Dutch (Standard)',
      code: 'nl-NL',
      countryFlag: 'nl',
    }

  ];
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];

  constructor(private sanitizer: DomSanitizer,
              private formBuilder: FormBuilder,
              ) { }

  ngOnInit() {
    this.onInitForm();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://phonetechtalk.com');

    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
    this.countries = [
      {name: 'United States', code: 'US'},
      {name: 'California', code: 'US'}
    ];

    this.gdprCountries = [
      {name: 'Australia', code: 'AU'},
      {name: 'Brazil', code: 'BR'},
      {name: 'China', code: 'CN'},
      {name: 'Egypt', code: 'EG'},
      {name: 'France', code: 'FR'},
      {name: 'Germany', code: 'DE'},
      {name: 'India', code: 'IN'},
      {name: 'Japan', code: 'JP'},
      {name: 'Spain', code: 'ES'},
      {name: 'United States', code: 'US'}
    ];
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.style.margin = null;
    element.classList.add('container');
    element.classList.add('site-content');
  }
  onInitForm() {
    this.form = this.formBuilder.group({
      title: [''],
    });
   console.log('fasdfas',  this.form.value.title)
  }
  onSelectStep(step) {
    this.step = step;
  }
  onOpenDropDown(step) {
    this.bannerContentDropdownStep =  this.bannerContentDropdownStep === step ? '' : step;
  }
  onSelectThemeType(type) {
    this.themeType = type;
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log('eventData', event)
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    // this.submitted = true;
    //
    // // reset alerts on submit
    // this.alertService.clear();
    //
    // // stop here if form is invalid
    // if (this.form.invalid) {
    //   return;
    // }
    //
    // this.loading = true;
    // if (this.isAddMode) {
    //   this.createUser();
    // } else {
    //   this.updateUser();
    // }
  }

}
