import {Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-cookie-category',
  templateUrl: './cookie-category.component.html',
  styleUrls: ['./cookie-category.component.scss']
})
export class CookieCategoryComponent implements OnInit {
  cookieModalRef: BsModalRef;
  categoryModalRef: BsModalRef;
  cookieForm: FormGroup;
  categoryForm: FormGroup;
  cookieFromSubmitted: boolean;
  categoryFromSubmitted: boolean;
  constructor(private modalService: BsModalService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.onInItCookieForm();
    this.onInItCategoryForm();
  }

  onInItCookieForm() {
    const zipRegex = '^[0-9]*$';
    const spaceRegx = '^\S*$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.cookieForm = this.formBuilder.group({
      cookieName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      host: ['' ,  [Validators.required]],
      category: ['', [Validators.required]],
      party: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      value: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      expired: ['', [Validators.required]],
      duration1: ['', [Validators.required]],
      duration2: ['', [Validators.required]],
    });
  }
  onInItCategoryForm() {
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      categoryId: ['' ,  [Validators.required]],
      description: ['', [Validators.required]]
    });
  }
  openModal(template: TemplateRef<any>) {
    this.cookieModalRef = this.modalService.show(template);
  }
  openCategoryModal(template: TemplateRef<any>) {
    this.categoryModalRef = this.modalService.show(template);
  }
  get f() {return this.cookieForm.controls; }
  get c() {return this.categoryForm.controls; }


  onCookieFromSubmit() {
    this.cookieFromSubmitted = true;
    console.log(this.cookieForm.invalid);
  }

  onCategoryFromSubmit() {
    this.categoryFromSubmitted = true;
    console.log(this.cookieForm.invalid);
  }
}
