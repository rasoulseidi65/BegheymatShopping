import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminserviceService } from './../../adminservice.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-slider-dialog',
  templateUrl: './add-slider-dialog.component.html',
  styleUrls: ['./add-slider-dialog.component.css'],
  providers: [MessageService]
})
export class AddSliderDialogComponent implements OnInit {

  public form: FormGroup;
  errorMessages = {
    tag: [
      {type: 'required', message: 'تگ اسلایدر را وارد کنید.'}
    ],
    imageurl: [
      {type: 'required', message: 'تصویر اسلایدر را وارد کنید.'}
    ]
  };

  constructor(private formBuilder: FormBuilder,
              public service: AdminserviceService,
              public messageService: MessageService,
              public dialogRef: DynamicDialogRef) { }

  ngOnInit(): void {
    this.createform();
  }

  createform(): void {
    this.form = this.formBuilder.group({
      link: new FormControl(
        null
      ),
      tag: new FormControl(
        null,
        [
          Validators.required
        ]
      ),
      imageurl: new FormControl(
        null,
        [
          Validators.required
        ]
      )
    });

  }

  submitForm(): void {
    this.service.addSlider(this.form.value).subscribe((response) => {
      if (response.success === true) {
        this.dialogRef.close(true);
      } else {
        this.messageService.add({severity: 'error', summary: ' ثبت اطلاعات ', detail: response.data});
      }
    });
  }

  imageUploader(event): void {
    const formData = new FormData();
    formData.append('image', event.files[0], event.files[0].name);
    this.service.uploadFile(formData).subscribe((response) => {
      if (response['success'] === true) {
        this.form.controls.imageurl.setValue(response['imagePath']);
        this.messageService.add({
          severity: 'success',
          summary: ' آپلود تصویر اسلایدر ',
          detail: 'تصویر با موفقیت آپلود شد.'
        });
      } else {
        this.messageService.add({severity: 'error', summary: ' آپلود تصویر اسلایدر ', detail: response['data']});
      }
    });
  }

}
