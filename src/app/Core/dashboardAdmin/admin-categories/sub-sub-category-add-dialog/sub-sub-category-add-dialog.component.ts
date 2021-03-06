import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {AdminserviceService} from '../../adminservice.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-sub-sub-category-add-dialog',
  templateUrl: './sub-sub-category-add-dialog.component.html',
  styleUrls: ['./sub-sub-category-add-dialog.component.css'],
  providers: [MessageService]
})
export class SubSubCategoryAddDialogComponent implements OnInit {

  public form: FormGroup;
  errorMessages = {
    title: [
      {type: 'required', message: 'عنوان دسته بندی را وارد کنید.'},
      {type: 'maxlength', message: 'عنوان دسته بندی نمی تواند از 500 کاراکتر بیشتر باشد.'}
    ]
  };

  constructor(private formBuilder: FormBuilder,
              public ref: DynamicDialogRef,
              private service: AdminserviceService,
              public messageService: MessageService,
              public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.createform();
  }

  createform(): void {
    this.form = this.formBuilder.group({
      SubCategoryID: new FormControl(
        this.config.data.subId,
      ),
      title: new FormControl(
        this.config.data.title,
        [
          Validators.required,
          Validators.maxLength(500)
        ]
      )
    });
  }

  submitForm(): void {
    this.service.addSubSubCategory(this.form.value).subscribe((response) => {
      if (response.success === true) {
        this.ref.close(true);
      } else {
        this.messageService.add({severity: 'error', summary: ' ثبت اطلاعات ', detail: response.data});
      }
    });
  }

}
