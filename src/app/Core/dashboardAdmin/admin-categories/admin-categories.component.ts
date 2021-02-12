import { CategoryEditDialogComponent } from './category-edit-dialog/category-edit-dialog.component';
import { SubCategoryEditDialogComponent } from './sub-category-edit-dialog/sub-category-edit-dialog.component';
import { SubSubCategoryEditDialogComponent } from './sub-sub-category-edit-dialog/sub-sub-category-edit-dialog.component';
import { CategoryAddDialogComponent } from './category-add-dialog/category-add-dialog.component';
import { SubCategoryAddDialogComponent } from './sub-category-add-dialog/sub-category-add-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminserviceService } from './../adminservice.service';
import { Component, OnInit } from '@angular/core';
import { SubSubCategoryAddDialogComponent } from './sub-sub-category-add-dialog/sub-sub-category-add-dialog.component';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css'],
  providers: [
    MessageService, ConfirmationService, DialogService
  ]
})
export class AdminCategoriesComponent implements OnInit {

  categories: any[];

  loading = false;
  constructor(private service: AdminserviceService,
              private messageService: MessageService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): any{
    this.service.getCategories().subscribe((response) => {
      if (response.success === true) {
        this.categories = response.data;

      } else {
        this.messageService.add({severity: 'error', summary: ' دریافت اطلاعات ', detail: response.data});
      }
    });
  }

  showEditCategoryDialog(id: string, title: string): void {
    const ref = this.dialogService.open(CategoryEditDialogComponent, {
      data: {
        id,
        title
      },
      header: 'ویرایش عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  showEditSubCategoryDialog(title: string, catId: string, subId: string): void {
    const ref = this.dialogService.open(SubCategoryEditDialogComponent, {
      data: {
        categories: this.categories,
        title,
        catId,
        subId
      },
      header: 'ویرایش عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  showEditSubSubCategoryDialog(title: string, catId: string, subId: string, subSubId: string): void {
    const ref = this.dialogService.open(SubSubCategoryEditDialogComponent, {
      data: {
        categories: this.categories,
        title,
        catId,
        subId,
        subSubId
      },
      header: 'ویرایش عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  showAddCategoryDialog(): void {
    const ref = this.dialogService.open(CategoryAddDialogComponent, {
      header: 'ثبت عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  showAddSubCategoryDialog(catId: string): void {
    const ref = this.dialogService.open(SubCategoryAddDialogComponent, {
      data: {
        catId,
      },
      header: 'ثبت عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  showAddSubSubCategoryDialog(catId: string, subId: string): void {
    const ref = this.dialogService.open(SubSubCategoryAddDialogComponent, {
      data: {
        catId,
        subId
      },
      header: 'ثبت عنوان دسته بندی',
      width: '70%'
    });

    ref.onClose.subscribe(res => {
      if (res === true){
        this.getCategories();
      }
    });
  }

  deleteCategory(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف رکورد انتخابی مطمین هستید؟',
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        // delete from db
        this.service.deleteCategory(id).subscribe((response) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({severity: 'success', summary: ' حذف اطلاعات ', detail: response.data});
            this.getCategories();
          } else {
            this.messageService.add({severity: 'error', summary: ' حذف اطلاعات ', detail: response.data});
          }
        });
      },
      reject: () => {
        // close
        this.confirmationService.close();
      }
    });
  }

  deleteSubCategory(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف رکورد انتخابی مطمین هستید؟',
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        // delete from db
        this.service.deleteSubCategory(id).subscribe((response) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({severity: 'success', summary: ' حذف اطلاعات ', detail: response.data});
            this.getCategories();
          } else {
            this.messageService.add({severity: 'error', summary: ' حذف اطلاعات ', detail: response.data});
          }
        });
      },
      reject: () => {
        // close
        this.confirmationService.close();
      }
    });
  }

  deleteSubSubCategory(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف رکورد انتخابی مطمین هستید؟',
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        // delete from db
        this.service.deleteSubSubCategory(id).subscribe((response) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({severity: 'success', summary: ' حذف اطلاعات ', detail: response.data});
            this.getCategories();
          } else {
            this.messageService.add({severity: 'error', summary: ' حذف اطلاعات ', detail: response.data});
          }
        });
      },
      reject: () => {
        // close
        this.confirmationService.close();
      }
    });
  }
}
