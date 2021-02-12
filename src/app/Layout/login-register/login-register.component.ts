import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../Auth/user.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../Auth/localStorageLogin/local-storage.service';
import {response} from 'express';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
  providers: [MessageService]
})
export class LoginRegisterComponent implements OnInit {
  @ViewChild('ngOtpInput', {static: true}) ngOtpInputRef: any;
  loginForm: FormGroup;
  registerForm: FormGroup;
  mobileRegix = /^0?9[123]\d{8}$/;
  passwordRegix = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{9,}$/;
  display: boolean = false;
  displayForgetPassword: boolean = false;
  forgetPasswordMobile: string;
  public getCodeSmS: string;
  otdCode: '';
  loginErrorMessages = {
    mobile: [
      {type: 'required', message: 'شماره موبایل را وارد کنید.'},
      {type: 'minlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'maxlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'pattern', message: 'لطفا شماره موبایل معتبر وارد کنید.'}
    ],
    password: [
      {type: 'required', message: 'کلمه عبور را وارد کنید.'}
    ]
  };
  public invalidSMS: boolean = false;
  public timeLeft: number = 80;
  public interval;
  resendSMS: boolean = false;
  registerErrorMessages = {
    mobile: [
      {type: 'required', message: 'شماره موبایل را وارد کنید.'},
      {type: 'minlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'maxlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'pattern', message: 'لطفا شماره موبایل معتبر وارد کنید.'}
    ],
    password: [
      {type: 'required', message: 'کلمه عبور را وارد کنید.'},
      {type: 'minlength', message: 'کلمه عبور نمی تواند کمتر از 8 کاراکتر باشد.'},
      {type: 'pattern', message: 'کلمه عبور باید شامل حروف کوچک و بزرگ لاتین و اعداد و اشکال باشد..'}
    ],
    confirmPassword: [
      {type: 'required', message: 'تکرار کلمه عبور را وارد کنید.'},
      {type: 'minlength', message: 'تکرار کلمه عبور نمی تواند کمتر از 8 کاراکتر باشد.'}
    ],
  };
  public validationBtnPay: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private authService: UserService,
              private messageService: MessageService,
              private  route: Router,
              private localStorage: LocalStorageService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group(
      {
        mobile: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(this.mobileRegix)
          ])
        ),
        password: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordRegix)
          ])
        ),
        confirmPassword: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8)
          ])
        ),
      }, {
        validators: this.password.bind(this)
      });

    this.loginForm = this.formBuilder.group(
      {
        mobile: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(this.mobileRegix)
          ])
        ),
        password: new FormControl(
          null,
          Validators.compose([
            Validators.required
          ])
        )
      }
    );
  }

  password(formGroup: FormGroup): any {
    const {value: password} = formGroup.get('password');
    const {value: confirmPassword} = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }

  login(): void {
    this.spinner.show();
    this.authService.onLogin(this.loginForm.value).subscribe((response) => {
      if (response['success'] === true) {
        this.spinner.hide();
        this.localStorage.saveCurrentUser(JSON.stringify(response['data']));
        this.route.navigate(['/']);
      } else {
        this.spinner.hide();
        this.messageService.add({severity: 'error', summary: ' ورود ', detail: response['data']});
      }
    });
  }

  sendSMS() {
    this.spinner.show();
    this.authService.onfindUser(this.registerForm.value).subscribe((result) => {
      if (result['success'] === true) {
        this.spinner.hide();
        this.messageService.add({severity: 'error', summary: 'ناموفق ', detail: 'کاربری با این شماره قبلا ثبت نام کرده است'});
      } else {
        this.spinner.hide();
        this.display = true;
        this.authService.getTokenSms().subscribe((res) => {
          if (res['IsSuccessful'] === true) {
            this.getCodeSmS = this.randomNumber();
            let token = res['TokenKey'];
            let data = {
              ParameterArray: [
                {Parameter: 'VerificationCode', ParameterValue: this.getCodeSmS}
              ],
              Mobile: this.registerForm.get('mobile').value,
              TemplateId: '40640'

            };
            this.authService.sendSms(data, token).subscribe((res1) => {
              if (res['IsSuccessful'] === true) {
                this.startTimer();
              }
            });
          }
        });
      }
    });

  }

  register(): void {
    this.authService.onRegister(this.registerForm.value).subscribe((response) => {
      console.log(this.resendSMS);
      if (response['success'] === true) {
        this.display = false;
        this.messageService.add({severity: 'success', summary: 'موفق ', detail: response['data']});
        this.localStorage.saveCurrentUser(JSON.stringify(this.registerForm));
        this.route.navigate(['/']);
      } else {
        this.display = false;
        this.messageService.add({severity: 'error', summary: 'ناموفق ', detail: response['data']});
      }
    });
  }

  onOtpChange(otp) {
    this.otdCode = otp;
    if (this.otdCode.length === 6) {
      if (this.otdCode !== this.getCodeSmS) {
        this.invalidSMS = true;
        this.validationBtnPay = true;
      } else {
        this.invalidSMS = false;
        this.validationBtnPay = false;
      }
    }
  }

  showDialog() {
    this.display = true;
  }

  showDialogForgetPassword() {
    this.displayForgetPassword = true;
  }

  startTimer() {
    this.interval = 70;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.resendSMS = true;
        this.timeLeft = 0;
      }

    }, 1000);
  }

  randomNumber() {
    var text = '';
    var possible = '123456789';
    for (var i = 0; i < 6; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup == i ? '0' : possible.charAt(sup);
    }
    return text;
  }

  forgetPassword() {
    let data = {mobile: this.forgetPasswordMobile};
    this.authService.onfindUser(data).subscribe((result) => {
      if (result['success'] !== true) {
        this.messageService.add({severity: 'error', summary: 'فراموشی رمز ', detail: result['data']});
      } else {
        this.authService.getTokenSms().subscribe((res) => {
          if (res['IsSuccessful'] === true) {
            let token = res['TokenKey'];
            let data = {
              mobile: this.forgetPasswordMobile
            };
            this.authService.resetPassword(data).subscribe((res2) => {

              if (res2['success'] === true) {
                let dataSMS = {
                  ParameterArray: [
                    {Parameter: 'VerificationCode', ParameterValue: res2['newpass']}
                  ],
                  Mobile: this.forgetPasswordMobile,
                  TemplateId: '40830'

                };
                this.authService.sendSms(dataSMS, token).subscribe((res1) => {
                  if (res1['IsSuccessful'] === true) {
                    this.displayForgetPassword = false;
                    this.messageService.add({
                      severity: 'success',
                      summary: 'فراموشی رمز ',
                      detail: 'رمز عبور جدید به شماره همراه پیامک شد'
                    });

                  }
                });

              }
            });
          }
        });
      }
    });

  }

}
