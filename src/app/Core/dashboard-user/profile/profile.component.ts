import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {UserService} from '../User.service';
import {LocalStorageService} from '../../../Auth/localStorageLogin/local-storage.service';
import {UserModel} from '../User.model';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {

  @ViewChild('ngOtpInput', {static: true}) ngOtpInputRef: any;
  display: boolean = false;
  public getCodeSmS: string;
  otdCode: '';
  public validationBtnPay: boolean = true;
  public invalidSMS: boolean = false;
  public timeLeft: number = 70;
  public interval;
  resendSMS: boolean = false;
  displayBasic: boolean = false;
  states: any[] = [];
  selectedState: any;
  cities: any[] = [];
  selectedCity: any;
  user: UserModel = null;
  mobileRegix = /^0?9[123]\d{8}$/;
  passwordRegix = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{9,}$/;
  public passwordForm: FormGroup;
  passwordErrorMessages = {
    password: [
      {type: 'required', message: 'کلمه عبور را وارد کنید.'},
      {type: 'minlength', message: 'کلمه عبور نمی تواند کمتر از 8 کاراکتر باشد.'},
      {type: 'pattern', message: 'کلمه عبور باید شامل حروف کوچک و بزرگ لاتین و اعداد و اشکال باشد..'}
    ],
    confirmPassword: [
      {type: 'required', message: 'تکرار کلمه عبور را وارد کنید.'},
      {type: 'minlength', message: 'تکرار کلمه عبور نمی تواند کمتر از 8 کاراکتر باشد.'}
    ]
  };
  public form: FormGroup;
  errorMessages = {
    firstName: [
      {type: 'required', message: 'نام را وارد کنید.'}
    ],
    lastName: [
      {type: 'required', message: 'نام خانوادگی را وارد کنید.'}
    ],
    nationalCode: [
      {type: 'required', message: 'کدملی را وارد کنید.'},
      {type: 'minlength', message: 'کدملی باید 10 رقم باشد.'},
      {type: 'maxlength', message: 'کدملی باید 10 رقم باشد.'}
    ],
    phone: [
      {type: 'required', message: 'شماره تلفن را وارد کنید.'},
      {type: 'minlength', message: 'شماره تلفن باید 11 رقم باشد.'},
      {type: 'maxlength', message: 'شماره تلفن باید 11 رقم باشد.'}
    ],
    state: [
      {type: 'required', message: 'استان را انتخاب کنید.'}
    ],
    city: [
      {type: 'required', message: 'شهر را انتخاب کنید.'}
    ],
    postalCode: [
      {type: 'required', message: 'کد پستی را وارد کنید.'},
      {type: 'minlength', message: 'کد پستی باید 10 رقم باشد.'},
      {type: 'maxlength', message: 'کد پستی باید 10 رقم باشد.'}
    ],
    address: [
      {type: 'required', message: 'آدرس را وارد کنید.'}
    ],
    image: [
      {type: 'required', message: 'تصویر را آپلود کنید.'}
    ],
    cardNumber: [
      {type: 'minlength', message: 'شماره کارت حداقل 12 رقم می باشد.'},
      {type: 'maxlength', message: 'شماره کارت حداکثر 16 رقم می باشد.'}
    ],
  };
  public mobileForm: FormGroup;
  mobileErrorMessages = {
    mobile: [
      {type: 'required', message: 'شماره موبایل را وارد کنید.'},
      {type: 'minlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'maxlength', message: 'شماره موبایل باید 11 رقم باشد.'},
      {type: 'pattern', message: 'لطفا شماره موبایل معتبر وارد کنید.'}
    ],
  };

  constructor(private localStorage: LocalStorageService,
              private formBuilder: FormBuilder,
              private messageService: MessageService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private userService: UserService) {

    this.states = [
      {
        code: '1',
        name: 'آذربایجان شرقی'
      },
      {
        code: '2',
        name: 'آذربایجان غربی'
      },
      {
        code: '3',
        name: 'اردبیل'
      },
      {
        code: '4',
        name: 'اصفهان'
      },
      {
        code: '5',
        name: 'ایلام'
      },
      {
        code: '6',
        name: 'بوشهر'
      },
      {
        code: '7',
        name: 'تهران'
      },
      {
        code: '8',
        name: 'چهارمحال و بختیاری'
      },
      {
        code: '9',
        name: 'خراسان جنوبی'
      },
      {
        code: '10',
        name: 'خراسان رضوی'
      },
      {
        code: '11',
        name: 'خراسان شمالی'
      },
      {
        code: '12',
        name: 'خوزستان'
      },
      {
        code: '13',
        name: 'زنجان'
      },
      {
        code: '14',
        name: 'سمنان'
      },
      {
        code: '15',
        name: 'سیستان و بلوچستان'
      },
      {
        code: '16',
        name: 'فارس'
      },
      {
        code: '17',
        name: 'قزوین'
      },
      {
        code: '18',
        name: 'قم'
      },
      {
        code: '19',
        name: 'گلستان'
      },
      {
        code: '20',
        name: 'گیلان'
      },
      {
        code: '21',
        name: 'لرستان'
      },
      {
        code: '22',
        name: 'مازندران'
      },
      {
        code: '23',
        name: 'مرکزی'
      },
      {
        code: '24',
        name: 'هرمزگان'
      },
      {
        code: '25',
        name: 'همدان'
      },
      {
        code: '26',
        name: 'کردستان'
      },
      {
        code: '27',
        name: 'کرمان'
      },
      {
        code: '28',
        name: 'کرمانشاه'
      },
      {
        code: '29',
        name: 'کهگیلویه و بویر احمد'
      },
      {
        code: '30',
        name: 'یزد'
      },
      {
        code: '31',
        name: 'البرز'
      }

    ];
  }

  ngOnInit(): void {

    if (this.localStorage.getCurrentUser() === true) {
      this.user = this.localStorage.userJson;

      if (this.user.hasOwnProperty('state')) {
        if (this.user.state !== null) {
          this.selectedState = this.states.filter(x => x.name === this.user.state)[0];
        }
      }

      if (this.user.hasOwnProperty('city')) {
        if (this.user.city !== null) {
          const selectedState = this.states.filter(x => x.name === this.user.state)[0];

          this.cities = [];
          switch (selectedState.code) {
            case '1': {
              this.cities = [{code: '1', name: 'آذرشهر'}, {code: '2', name: 'اسکو'}, {code: '3', name: 'اهر'}, {
                code: '4',
                name: 'بستان آباد'
              }, {code: '5', name: 'بناب'}, {code: '6', name: 'تبریز'}, {code: '7', name: 'جلفا'}, {
                code: '8',
                name: 'چار اویماق'
              }, {code: '9', name: 'سراب'}, {code: '10', name: 'شبستر'}, {code: '11', name: 'عجب شیر'}, {
                code: '12',
                name: 'مراغه'
              }, {code: '13', name: 'مرند'}, {code: '14', name: 'ملکان'}, {code: '15', name: 'میانه'}, {
                code: '16',
                name: 'هریس'
              }, {code: '17', name: 'هشترود'}, {code: '18', name: 'ورزقان'}, {code: '19', name: 'کلیبر'}, {
                code: '20',
                name: 'خدا آفرین'
              }];
              break;
            }
            case '2': {
              this.cities = [{code: '21', name: 'ارومیه'}, {code: '22', name: 'اشنویه'}, {code: '23', name: 'بوکان'}, {
                code: '24',
                name: 'پیرانشهر'
              }, {code: '25', name: 'تکاب'}, {code: '26', name: 'چالدران'}, {code: '27', name: 'خوی'}, {
                code: '28',
                name: 'سردشت'
              }, {code: '29', name: 'سلماس'}, {code: '30', name: 'شاهین دژ'}, {code: '31', name: 'ماکو'}, {
                code: '32',
                name: 'مهاباد'
              }, {code: '33', name: 'میاندوآب'}, {code: '34', name: 'نقده'}, {code: '35', name: 'شوط'}, {
                code: '36',
                name: 'پلدشت'
              }, {code: '37', name: 'چابیاره'}];
              break;
            }
            case '3': {
              this.cities = [{code: '38', name: 'اردبیل'}, {code: '39', name: 'پیله سوار'}, {code: '40', name: 'پارس آباد'}, {
                code: '41',
                name: 'خلخال'
              }, {code: '42', name: 'گرمی'}, {code: '43', name: 'مشکین شهر'}, {code: '44', name: 'نمین'}, {
                code: '45',
                name: 'نیر'
              }, {code: '46', name: 'کوثر'}, {code: '47', name: 'سرعین'}];
              break;
            }
            case '4': {
              this.cities = [{code: '48', name: 'آران و بیدگل'}, {code: '49', name: 'اردستان'}, {code: '50', name: 'اصفهان'}, {
                code: '51',
                name: 'برخوار'
              }, {code: '52', name: 'تیران و کرون'}, {code: '53', name: 'چادگان'}, {code: '54', name: 'خمینی شهر'}, {
                code: '55',
                name: 'خوانسار'
              }, {code: '56', name: 'سمیرم'}, {code: '57', name: 'دهاقان'}, {code: '58', name: 'شاهین شهر ومیمه'}, {
                code: '59',
                name: 'شهرضا'
              }, {code: '60', name: 'فریدن'}, {code: '61', name: 'فریدون شهر'}, {code: '62', name: 'فلاورجان'}, {
                code: '63',
                name: 'گلپایگان'
              }, {code: '64', name: 'لنجان'}, {code: '65', name: 'مبارکه'}, {code: '66', name: 'نائین'}, {
                code: '67',
                name: 'نجف آباد'
              }, {code: '68', name: 'نطنز'}, {code: '69', name: 'کاشان'}, {code: '70', name: 'خور و بیابانک'}, {
                code: '71',
                name: 'بویین میاندشت'
              }];
              break;
            }
            case '5': {
              this.cities = [{code: '72', name: 'آبدانان'}, {code: '73', name: 'ایلام'}, {code: '74', name: 'ایوان'}, {
                code: '75',
                name: 'دره شهر'
              }, {code: '76', name: 'دهلران'}, {code: '77', name: 'چرداول'}, {code: '78', name: 'مهران'}, {
                code: '79',
                name: 'ملکشاهی'
              }, {code: '80', name: 'بدره'}, {code: '81', name: 'سیروان'}];
              break;
            }
            case '6': {
              this.cities = [{code: '82', name: 'بوشهر'}, {code: '83', name: 'تنگستان'}, {code: '84', name: 'جم'}, {
                code: '85',
                name: 'دشتستان'
              }, {code: '86', name: 'دشتی'}, {code: '87', name: 'دیر'}, {code: '88', name: 'دیلم'}, {
                code: '89',
                name: 'گناوه'
              }, {code: '90', name: 'کنگان'}];
              break;
            }
            case '7': {
              this.cities = [{code: '91', name: 'اسلامشهر'}, {code: '92', name: 'پاکدشت'}, {code: '93', name: 'تهران'}, {
                code: '94',
                name: 'دماوند'
              }, {code: '95', name: 'رباط کریم'}, {code: '96', name: 'شمیرانات'}, {code: '97', name: 'ری'}, {
                code: '98',
                name: 'شهریار'
              }, {code: '99', name: 'فیروزکوه'}, {code: '100', name: 'ورامین'}, {code: '101', name: 'بهارستان'}, {
                code: '102',
                name: 'ملارد'
              }, {code: '103', name: 'قرچک'}, {code: '104', name: 'پیشوا'}, {code: '105', name: 'قدس'}, {code: '106', name: 'پردیس'}];
              break;
            }
            case '8': {
              this.cities = [{code: '107', name: 'اردل'}, {code: '108', name: 'بروجن'}, {code: '109', name: 'شهرکرد'}, {
                code: '110',
                name: 'فارسان'
              }, {code: '111', name: 'لردگان'}, {code: '112', name: 'کوهرنگ'}, {code: '113', name: 'کیار'}, {
                code: '114',
                name: 'سامان'
              }, {code: '116', name: 'فرخ شهر'}, {code: '117', name: 'یلداچی'}, {code: '118', name: 'بن'}];
              break;
            }
            case '9': {
              this.cities = [{code: '119', name: 'بیرجند'}, {code: '120', name: 'درمیان'}, {code: '121', name: 'سرایان'}, {
                code: '122',
                name: 'سرپیشه'
              }, {code: '123', name: 'طبس'}, {code: '124', name: 'فردوس'}, {code: '125', name: 'قائنات'}, {
                code: '126',
                name: 'نهبندان'
              }, {code: '127', name: 'بشرویه'}, {code: '128', name: 'خوسف'}, {code: '129', name: 'زیرکوه'}, {
                code: '430',
                name: 'سربیشه'
              }];
              break;
            }
            case '10': {
              this.cities =
                [{code: '130', name: 'بردسکن'}, {code: '131', name: 'تایباد'}, {code: '132', name: 'تربت جام'}, {
                  code: '133',
                  name: 'تربت حیدریه'
                }, {code: '134', name: 'چناران'}, {code: '135', name: 'خلیل آباد'}, {code: '136', name: 'خواف'}, {
                  code: '137',
                  name: 'درگز'
                }, {code: '138', name: 'رشتخوار'}, {code: '139', name: 'سبزوار'}, {code: '140', name: 'سرخس'}, {
                  code: '141',
                  name: 'فریمان'
                }, {code: '142', name: 'قوچان'}, {code: '143', name: 'گناباد'}, {code: '144', name: 'مشهد مقدس'}, {
                  code: '145',
                  name: 'مه ولات'
                }, {code: '146', name: 'نیشابور'}, {code: '147', name: 'کاشمر'}, {code: '148', name: 'کلات'}, {
                  code: '149',
                  name: 'طرقبه شاندیز'
                }, {code: '150', name: 'چغنای'}, {code: '151', name: 'جوین'}, {code: '152', name: 'بجستان'}, {
                  code: '153',
                  name: 'زاوه'
                }, {code: '154', name: 'فیروزه'}, {code: '155', name: 'باخزر'}, {code: '429', name: 'اشخانه'}];
              break;
            }
            case '11': {
              this.cities = [{code: '156', name: 'اسفراین'}, {code: '157', name: 'بجنورد'}, {code: '158', name: 'جاجرم'}, {
                code: '159',
                name: 'شیروان'
              }, {code: '160', name: 'فاروج'}, {code: '161', name: 'مانه و سملقان'}, {code: '162', name: 'گرمه'}, {
                code: '163',
                name: 'راز و جرگلان'
              }];
              break;
            }
            case '12': {
              this.cities = [{code: '164', name: 'آبادان'}, {code: '165', name: 'امیدیه'}, {code: '166', name: 'اندیمشک'}, {
                code: '167',
                name: 'اهواز'
              }, {code: '168', name: 'ایذه'}, {code: '169', name: 'باغ ملک'}, {code: '170', name: 'بندر ماهشهر'}, {
                code: '171',
                name: 'بهبهان'
              }, {code: '172', name: 'خرمشهر'}, {code: '173', name: 'دزفول'}, {code: '174', name: 'دشت آزادگان(سوسنگرد)'}, {
                code: '175',
                name: 'رامشیر'
              }, {code: '176', name: 'رامهرمز'}, {code: '177', name: 'شادگان'}, {code: '178', name: 'شوش'}, {
                code: '179',
                name: 'شوشتر'
              }, {code: '180', name: 'گتوند'}, {code: '181', name: 'لالی'}, {code: '182', name: 'مسجد سلیمان'}, {
                code: '183',
                name: 'هندیجان'
              }, {code: '184', name: 'بندر امام خمینی'}, {code: '185', name: 'هفتکل'}, {code: '186', name: 'هویزه'}, {
                code: '187',
                name: 'اندیکا'
              }, {code: '188', name: 'باوی'}, {code: '189', name: 'حمیدیه'}, {code: '190', name: 'کارون'}];
              break;
            }
            case '13': {
              this.cities = [{code: '191', name: 'ابهر'}, {code: '192', name: 'ایجرود'}, {
                code: '193',
                name: 'خدابنده(قیدار)'
              }, {code: '194', name: 'خرم دره'}, {code: '195', name: 'زنجان'}, {code: '196', name: 'طارم'}, {
                code: '197',
                name: 'ماهنشان'
              }, {code: '198', name: 'سلطانیه'}];
              break;
            }
            case '14': {
              this.cities = [{code: '199', name: 'دامغان'}, {code: '200', name: 'سمنان'}, {code: '201', name: 'شاهرود'}, {
                code: '202',
                name: 'گرمسار'
              }, {code: '203', name: 'مهدی شهر'}, {code: '204', name: 'میامی'}, {code: '205', name: 'آرادان'}];
              break;
            }
            case '15': {
              this.cities = [{code: '206', name: 'ایرانشهر'}, {code: '207', name: 'چابهار'}, {code: '208', name: 'خاش'}, {
                code: '209',
                name: 'زابل'
              }, {code: '210', name: 'زاهدان'}, {code: '211', name: 'زهک'}, {code: '212', name: 'سراوان'}, {
                code: '213',
                name: 'سرباز'
              }, {code: '214', name: 'نیکشهر'}, {code: '215', name: 'کنارک'}, {code: '216', name: 'هیرمند'}, {
                code: '217',
                name: 'قصرقند'
              }, {code: '218', name: 'مهرستان'}, {code: '219', name: 'سیب و سوران'}, {code: '220', name: 'فنوج'}, {
                code: '221',
                name: 'نیمروز'
              }, {code: '222', name: 'میرجاوه'}, {code: '223', name: 'هامون'}];
              break;
            }
            case '16': {
              this.cities = [{code: '224', name: 'آباده'}, {code: '225', name: 'ارسنجان'}, {code: '226', name: 'استهبان'}, {
                code: '227',
                name: 'اقلید'
              }, {code: '228', name: 'بوانات'}, {code: '229', name: 'پاسارگاد'}, {code: '230', name: 'جهرم'}, {
                code: '231',
                name: 'خرم بید'
              }, {code: '232', name: 'خنج'}, {code: '233', name: 'داراب'}, {code: '234', name: 'زرین دشت'}, {
                code: '235',
                name: 'سپیدان'
              }, {code: '236', name: 'شیراز'}, {code: '237', name: 'فراشبند'}, {code: '238', name: 'فسا'}, {
                code: '239',
                name: 'فیروزآیاد'
              }, {code: '240', name: 'قیر و کارزین'}, {code: '241', name: 'لارستان'}, {code: '242', name: 'لامرد'}, {
                code: '243',
                name: 'مرودشت'
              }, {code: '244', name: 'مهر'}, {code: '245', name: 'ممستی'}, {code: '246', name: 'نی ریز'}, {
                code: '247',
                name: 'کازرون'
              }, {code: '248', name: 'سروستان'}, {code: '249', name: 'رستم'}, {code: '250', name: 'گراش'}, {
                code: '251',
                name: 'خرامه'
              }, {code: '252', name: 'کوار'}];
              break;
            }
            case '17': {
              this.cities = [{code: '255', name: 'آبیک'}, {code: '256', name: 'البرز'}, {code: '257', name: 'بویین زهرا'}, {
                code: '258',
                name: 'تاکستان'
              }, {code: '259', name: 'قزوین'}, {code: '260', name: 'آوج'}];
              break;
            }
            case '18': {
              this.cities = [{code: '261', name: 'قم'}];
              break;
            }
            case '19': {
              this.cities = [{code: '262', name: 'آزادشهر'}, {code: '263', name: 'گلستان - آزادشهر'}, {
                code: '264',
                name: 'آق قلا'
              }, {code: '265', name: 'بندر ترکمن'}, {code: '266', name: 'بندر گز'}, {code: '267', name: 'رامیان'}, {
                code: '268',
                name: 'علی آباد'
              }, {code: '269', name: 'گرگان'}, {code: '270', name: 'گنبد کاووس'}, {code: '271', name: 'مینو دشت'}, {
                code: '272',
                name: 'کرد کوی'
              }, {code: '273', name: 'کلاله'}, {code: '274', name: 'گالیکش'}, {code: '275', name: 'گمیشان'}, {
                code: '276',
                name: 'مراوه تپه'
              }];
              break;
            }
            case '20': {
              this.cities = [{code: '277', name: 'آستارا'}, {code: '278', name: 'آستانه اشرفیه'}, {
                code: '279',
                name: 'املش'
              }, {code: '280', name: 'بندر انزلی'}, {code: '281', name: 'تالش'}, {code: '282', name: 'رشت'}, {
                code: '283',
                name: 'رضوان شهر'
              }, {code: '284', name: 'رودبار'}, {code: '285', name: 'رودسر'}, {code: '286', name: 'سیاهکل'}, {
                code: '287',
                name: 'شفت'
              }, {code: '288', name: 'صومعه سرا'}, {code: '289', name: 'فومن'}, {code: '290', name: 'لاهیجان'}, {
                code: '291',
                name: 'لنگرود'
              }, {code: '292', name: 'ماسال'}];
              break;
            }
            case '21': {
              this.cities = [{code: '293', name: 'ازنا'}, {code: '294', name: 'الیگودرز'}, {code: '295', name: 'بروجرد'}, {
                code: '296',
                name: 'پل دختر'
              }, {code: '297', name: 'خرم آباد'}, {code: '298', name: 'دلقان(نورآباد)'}, {code: '299', name: 'دورود'}, {
                code: '300',
                name: 'سلسله(الشتر)'
              }, {code: '301', name: 'کوهدشت'}];
              break;
            }
            case '22': {
              this.cities = [{code: '302', name: 'آمل'}, {code: '303', name: 'بابل'}, {code: '304', name: 'بابلسر'}, {
                code: '305',
                name: 'بهشهر'
              }, {code: '306', name: 'تنکابن'}, {code: '307', name: 'جویبار'}, {code: '308', name: 'چالوس'}, {
                code: '309',
                name: 'رامسر'
              }, {code: '310', name: 'ساری'}, {code: '311', name: 'سوادکوه'}, {code: '312', name: 'عباس آباد'}, {
                code: '313',
                name: 'قائم شهر'
              }, {code: '314', name: 'گلوگاه'}, {code: '315', name: 'محمود آباد'}, {code: '316', name: 'نور'}, {
                code: '317',
                name: 'نوشهر'
              }, {code: '318', name: 'نکا'}, {code: '319', name: 'فریدونکنار'}, {code: '320', name: 'زیراب'}, {
                code: '321',
                name: 'سوادکوه شمالی'
              }, {code: '322', name: 'میاندرود'}, {code: '323', name: 'کلاردشت'}, {code: '324', name: 'سیمرغ'}];
              break;
            }
            case '23': {
              this.cities = [{code: '325', name: 'آشتیان'}, {code: '326', name: 'اراک'}, {code: '327', name: 'تفرش'}, {
                code: '328',
                name: 'خمین'
              }, {code: '329', name: 'دلیجان'}, {code: '330', name: 'زرندیه'}, {code: '331', name: 'ساوه'}, {
                code: '332',
                name: 'شازند'
              }, {code: '333', name: 'محلات'}, {code: '334', name: 'کمیجان'}, {code: '335', name: 'خنداب'}, {
                code: '336',
                name: 'فراهان'
              }];
              break;
            }
            case '24': {
              this.cities = [{code: '337', name: 'بستک'}, {code: '338', name: 'بندرعباس'}, {code: '339', name: 'بندر لنگه'}, {
                code: '340',
                name: 'پارسیان'
              }, {code: '341', name: 'جاسک'}, {code: '342', name: 'حاجی آباد'}, {code: '343', name: 'خمیر'}, {
                code: '344',
                name: 'رودان(دهبارز)'
              }, {code: '345', name: 'میناب'}, {code: '346', name: 'سیربک'}, {code: '347', name: 'قشم'}, {
                code: '348',
                name: 'ابوموسی'
              }, {code: '349', name: 'بشاگرد'}, {code: '350', name: 'کیش'}];
              break;
            }
            case '25': {
              this.cities = [{code: '351', name: 'اسد آباد'}, {code: '352', name: 'بهار'}, {code: '353', name: 'تویسرکان'}, {
                code: '354',
                name: 'رزن'
              }, {code: '355', name: 'فامتین'}, {code: '356', name: 'ملایر'}, {code: '357', name: 'نهاوند'}, {
                code: '358',
                name: 'همدان'
              }, {code: '359', name: 'کیودرآهنگ'}];
              break;
            }
            case '26': {
              this.cities = [{code: '360', name: 'بانه'}, {code: '361', name: 'بیجار'}, {code: '362', name: 'دیواندره'}, {
                code: '363',
                name: 'سروآباد'
              }, {code: '364', name: 'سقز'}, {code: '365', name: 'سنندج'}, {code: '366', name: 'قروه'}, {
                code: '367',
                name: 'مریوان'
              }, {code: '368', name: 'کامیاران'}, {code: '369', name: 'دهگلان'}];
              break;
            }
            case '27': {
              this.cities = [{code: '370', name: 'بافت'}, {code: '371', name: 'بردسیر(مشیز)'}, {code: '372', name: 'بم'}, {
                code: '373',
                name: 'راور'
              }, {code: '374', name: 'رفسنجان'}, {code: '375', name: 'زرند'}, {code: '376', name: 'سیرجان'}, {
                code: '377',
                name: 'شهر بابک'
              }, {code: '378', name: 'قهرج'}, {code: '379', name: 'کرمان'}, {code: '380', name: 'کوهبنان'}, {
                code: '381',
                name: 'انار'
              }, {code: '382', name: 'ریگان'}, {code: '383', name: 'رابر'}, {code: '420', name: 'جیرفت'}, {
                code: '421',
                name: 'رودبار جنوبی'
              }, {code: '422', name: 'عنبر آباد'}, {code: '423', name: 'منوجان'}, {code: '424', name: 'کهنوج'}, {
                code: '425',
                name: 'قلعه گنج'
              }];
              break;
            }
            case '28': {
              this.cities = [{code: '384', name: 'اسلام آباد غرب'}, {code: '385', name: 'پاوه'}, {
                code: '386',
                name: 'ثلاث باباجانی'
              }, {code: '387', name: 'جوانرود'}, {code: '388', name: 'دالاهو'}, {code: '389', name: 'روانسر'}, {
                code: '390',
                name: 'سرپل ذهاب'
              }, {code: '391', name: 'سنقر'}, {code: '392', name: 'صحنه'}, {code: '393', name: 'قصر شیرین'}, {
                code: '394',
                name: 'گیلانغرب'
              }, {code: '395', name: 'هرسین'}, {code: '396', name: 'کرمانشاه'}, {code: '397', name: 'کنگاور'}];
              break;
            }
            case '29': {
              this.cities = [{code: '398', name: 'بهمئی'}, {code: '399', name: 'دنا'}, {code: '400', name: 'گچساران'}, {
                code: '401',
                name: 'کهگیلویه'
              }, {code: '402', name: 'بویر احمد'}, {code: '403', name: 'باشت'}, {code: '427', name: 'یاسوج'}];
              break;
            }
            case '30': {
              this.cities = [{code: '404', name: 'ابرکوه'}, {code: '405', name: 'اردکان'}, {code: '406', name: 'بافق'}, {
                code: '407',
                name: 'تفت'
              }, {code: '408', name: 'خاتم'}, {code: '409', name: 'اشکذر'}, {code: '410', name: 'مهریز'}, {
                code: '411',
                name: 'میبد'
              }, {code: '412', name: 'یزد'}, {code: '413', name: 'بهاباد'}];
              break;
            }
            case '31': {
              this.cities = [{code: '414', name: 'ساوجبلاغ'}, {code: '415', name: 'کرج'}, {code: '416', name: 'نظرآباد'}, {
                code: '417',
                name: 'فردیس'
              }, {code: '418', name: 'اشتهارد'}, {code: '419', name: 'طالقان'}, {code: '426', name: 'هشتگرد'}];
              break;
            }
            default: {
              this.cities = [];
              break;
            }
          }

          this.selectedCity = this.cities.filter(x => x.name === this.user.city)[0];
        }
      }

      this.form = this.formBuilder.group({
        firstName: new FormControl(
          this.user.firstName,
          [
            Validators.required
          ]
        ),
        lastName: new FormControl(
          this.user.lastName,
          [
            Validators.required
          ]
        ),
        nationalCode: new FormControl(
          this.user.nationalCode,
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10)
          ]
        ),
        mobile: new FormControl(
          this.user.mobile,
          [
            Validators.required
          ]
        ),
        phone: new FormControl(
          this.user.phone,
          [
            Validators.required,
            Validators.maxLength(11),
            Validators.minLength(11)
          ]
        ),
        state: new FormControl(
          this.selectedState,
          [
            Validators.required
          ]
        ),
        city: new FormControl(
          this.selectedCity,
          [
            Validators.required
          ]
        ),
        postalCode: new FormControl(
          this.user.postalCode,
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10)
          ]
        ),
        address: new FormControl(
          this.user.address,
          [
            Validators.required
          ]
        ),
        cardNumber: new FormControl(
          this.user.cardNumber,
          [
            Validators.maxLength(16),
            Validators.minLength(12)
          ]
        ),
        accountNumber: new FormControl(
          this.user.accountNumber
        ),
        image: new FormControl(
          this.user.image,
          [
            Validators.required
          ]
        )
      });

      this.form.controls.city.setValue(this.selectedCity);
      this.form.controls.state.setValue(this.selectedState);

      this.passwordForm = this.formBuilder.group({
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
        )
      }, {
        validators: this.password.bind(this)
      });

      this.mobileForm = this.formBuilder.group({
        mobile: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(this.mobileRegix)
          ])
        ),
      });
    }
  }

  updateUser() {
    const state = this.form.controls.state.value;
    this.form.controls.state.setValue(state.name);

    const city = this.form.controls.city.value;
    this.form.controls.city.setValue(city.name);

    this.userService.updateUser(this.user.id, this.form.value).subscribe((response) => {
      if (response['success'] === true) {
        this.displayBasic = true;
      }
    });
  }

  getSelectedState(): void {
    this.selectedState = null;
    if (this.user.hasOwnProperty('state')) {
      if (this.user.state !== null) {
        this.selectedState = this.states.filter(x => x.name === this.user.state)[0];
      }
    }
    this.form.controls.state.setValue(this.selectedState);
  }

  changePasswordUser() {
    this.userService.changePasswordUser(this.user.id, this.passwordForm.value).subscribe((response) => {
      if (response['success'] === true) {
        this.localStorage.removeCurrentUser();
        this.router.navigateByUrl('/home/account');
      }
    });
  }

  stateOnChange(e: any): void {
    this.cities = [];
    switch (e.value) {
      case '1': {
        this.cities = [{code: '1', name: 'آذرشهر'}, {code: '2', name: 'اسکو'}, {code: '3', name: 'اهر'}, {
          code: '4',
          name: 'بستان آباد'
        }, {code: '5', name: 'بناب'}, {code: '6', name: 'تبریز'}, {code: '7', name: 'جلفا'}, {
          code: '8',
          name: 'چار اویماق'
        }, {code: '9', name: 'سراب'}, {code: '10', name: 'شبستر'}, {code: '11', name: 'عجب شیر'}, {
          code: '12',
          name: 'مراغه'
        }, {code: '13', name: 'مرند'}, {code: '14', name: 'ملکان'}, {code: '15', name: 'میانه'}, {
          code: '16',
          name: 'هریس'
        }, {code: '17', name: 'هشترود'}, {code: '18', name: 'ورزقان'}, {code: '19', name: 'کلیبر'}, {
          code: '20',
          name: 'خدا آفرین'
        }];
        break;
      }
      case '2': {
        this.cities = [{code: '21', name: 'ارومیه'}, {code: '22', name: 'اشنویه'}, {code: '23', name: 'بوکان'}, {
          code: '24',
          name: 'پیرانشهر'
        }, {code: '25', name: 'تکاب'}, {code: '26', name: 'چالدران'}, {code: '27', name: 'خوی'}, {
          code: '28',
          name: 'سردشت'
        }, {code: '29', name: 'سلماس'}, {code: '30', name: 'شاهین دژ'}, {code: '31', name: 'ماکو'}, {
          code: '32',
          name: 'مهاباد'
        }, {code: '33', name: 'میاندوآب'}, {code: '34', name: 'نقده'}, {code: '35', name: 'شوط'}, {
          code: '36',
          name: 'پلدشت'
        }, {code: '37', name: 'چابیاره'}];
        break;
      }
      case '3': {
        this.cities = [{code: '38', name: 'اردبیل'}, {code: '39', name: 'پیله سوار'}, {code: '40', name: 'پارس آباد'}, {
          code: '41',
          name: 'خلخال'
        }, {code: '42', name: 'گرمی'}, {code: '43', name: 'مشکین شهر'}, {code: '44', name: 'نمین'}, {
          code: '45',
          name: 'نیر'
        }, {code: '46', name: 'کوثر'}, {code: '47', name: 'سرعین'}];
        break;
      }
      case '4': {
        this.cities = [{code: '48', name: 'آران و بیدگل'}, {code: '49', name: 'اردستان'}, {code: '50', name: 'اصفهان'}, {
          code: '51',
          name: 'برخوار'
        }, {code: '52', name: 'تیران و کرون'}, {code: '53', name: 'چادگان'}, {code: '54', name: 'خمینی شهر'}, {
          code: '55',
          name: 'خوانسار'
        }, {code: '56', name: 'سمیرم'}, {code: '57', name: 'دهاقان'}, {code: '58', name: 'شاهین شهر ومیمه'}, {
          code: '59',
          name: 'شهرضا'
        }, {code: '60', name: 'فریدن'}, {code: '61', name: 'فریدون شهر'}, {code: '62', name: 'فلاورجان'}, {
          code: '63',
          name: 'گلپایگان'
        }, {code: '64', name: 'لنجان'}, {code: '65', name: 'مبارکه'}, {code: '66', name: 'نائین'}, {
          code: '67',
          name: 'نجف آباد'
        }, {code: '68', name: 'نطنز'}, {code: '69', name: 'کاشان'}, {code: '70', name: 'خور و بیابانک'}, {
          code: '71',
          name: 'بویین میاندشت'
        }];
        break;
      }
      case '5': {
        this.cities = [{code: '72', name: 'آبدانان'}, {code: '73', name: 'ایلام'}, {code: '74', name: 'ایوان'}, {
          code: '75',
          name: 'دره شهر'
        }, {code: '76', name: 'دهلران'}, {code: '77', name: 'چرداول'}, {code: '78', name: 'مهران'}, {
          code: '79',
          name: 'ملکشاهی'
        }, {code: '80', name: 'بدره'}, {code: '81', name: 'سیروان'}];
        break;
      }
      case '6': {
        this.cities = [{code: '82', name: 'بوشهر'}, {code: '83', name: 'تنگستان'}, {code: '84', name: 'جم'}, {
          code: '85',
          name: 'دشتستان'
        }, {code: '86', name: 'دشتی'}, {code: '87', name: 'دیر'}, {code: '88', name: 'دیلم'}, {
          code: '89',
          name: 'گناوه'
        }, {code: '90', name: 'کنگان'}];
        break;
      }
      case '7': {
        this.cities = [{code: '91', name: 'اسلامشهر'}, {code: '92', name: 'پاکدشت'}, {code: '93', name: 'تهران'}, {
          code: '94',
          name: 'دماوند'
        }, {code: '95', name: 'رباط کریم'}, {code: '96', name: 'شمیرانات'}, {code: '97', name: 'ری'}, {
          code: '98',
          name: 'شهریار'
        }, {code: '99', name: 'فیروزکوه'}, {code: '100', name: 'ورامین'}, {code: '101', name: 'بهارستان'}, {
          code: '102',
          name: 'ملارد'
        }, {code: '103', name: 'قرچک'}, {code: '104', name: 'پیشوا'}, {code: '105', name: 'قدس'}, {code: '106', name: 'پردیس'}];
        break;
      }
      case '8': {
        this.cities = [{code: '107', name: 'اردل'}, {code: '108', name: 'بروجن'}, {code: '109', name: 'شهرکرد'}, {
          code: '110',
          name: 'فارسان'
        }, {code: '111', name: 'لردگان'}, {code: '112', name: 'کوهرنگ'}, {code: '113', name: 'کیار'}, {
          code: '114',
          name: 'سامان'
        }, {code: '116', name: 'فرخ شهر'}, {code: '117', name: 'یلداچی'}, {code: '118', name: 'بن'}];
        break;
      }
      case '9': {
        this.cities = [{code: '119', name: 'بیرجند'}, {code: '120', name: 'درمیان'}, {code: '121', name: 'سرایان'}, {
          code: '122',
          name: 'سرپیشه'
        }, {code: '123', name: 'طبس'}, {code: '124', name: 'فردوس'}, {code: '125', name: 'قائنات'}, {
          code: '126',
          name: 'نهبندان'
        }, {code: '127', name: 'بشرویه'}, {code: '128', name: 'خوسف'}, {code: '129', name: 'زیرکوه'}, {
          code: '430',
          name: 'سربیشه'
        }];
        break;
      }
      case '10': {
        this.cities =
          [{code: '130', name: 'بردسکن'}, {code: '131', name: 'تایباد'}, {code: '132', name: 'تربت جام'}, {
            code: '133',
            name: 'تربت حیدریه'
          }, {code: '134', name: 'چناران'}, {code: '135', name: 'خلیل آباد'}, {code: '136', name: 'خواف'}, {
            code: '137',
            name: 'درگز'
          }, {code: '138', name: 'رشتخوار'}, {code: '139', name: 'سبزوار'}, {code: '140', name: 'سرخس'}, {
            code: '141',
            name: 'فریمان'
          }, {code: '142', name: 'قوچان'}, {code: '143', name: 'گناباد'}, {code: '144', name: 'مشهد مقدس'}, {
            code: '145',
            name: 'مه ولات'
          }, {code: '146', name: 'نیشابور'}, {code: '147', name: 'کاشمر'}, {code: '148', name: 'کلات'}, {
            code: '149',
            name: 'طرقبه شاندیز'
          }, {code: '150', name: 'چغنای'}, {code: '151', name: 'جوین'}, {code: '152', name: 'بجستان'}, {
            code: '153',
            name: 'زاوه'
          }, {code: '154', name: 'فیروزه'}, {code: '155', name: 'باخزر'}, {code: '429', name: 'اشخانه'}];
        break;
      }
      case '11': {
        this.cities = [{code: '156', name: 'اسفراین'}, {code: '157', name: 'بجنورد'}, {code: '158', name: 'جاجرم'}, {
          code: '159',
          name: 'شیروان'
        }, {code: '160', name: 'فاروج'}, {code: '161', name: 'مانه و سملقان'}, {code: '162', name: 'گرمه'}, {
          code: '163',
          name: 'راز و جرگلان'
        }];
        break;
      }
      case '12': {
        this.cities = [{code: '164', name: 'آبادان'}, {code: '165', name: 'امیدیه'}, {code: '166', name: 'اندیمشک'}, {
          code: '167',
          name: 'اهواز'
        }, {code: '168', name: 'ایذه'}, {code: '169', name: 'باغ ملک'}, {code: '170', name: 'بندر ماهشهر'}, {
          code: '171',
          name: 'بهبهان'
        }, {code: '172', name: 'خرمشهر'}, {code: '173', name: 'دزفول'}, {code: '174', name: 'دشت آزادگان(سوسنگرد)'}, {
          code: '175',
          name: 'رامشیر'
        }, {code: '176', name: 'رامهرمز'}, {code: '177', name: 'شادگان'}, {code: '178', name: 'شوش'}, {
          code: '179',
          name: 'شوشتر'
        }, {code: '180', name: 'گتوند'}, {code: '181', name: 'لالی'}, {code: '182', name: 'مسجد سلیمان'}, {
          code: '183',
          name: 'هندیجان'
        }, {code: '184', name: 'بندر امام خمینی'}, {code: '185', name: 'هفتکل'}, {code: '186', name: 'هویزه'}, {
          code: '187',
          name: 'اندیکا'
        }, {code: '188', name: 'باوی'}, {code: '189', name: 'حمیدیه'}, {code: '190', name: 'کارون'}];
        break;
      }
      case '13': {
        this.cities = [{code: '191', name: 'ابهر'}, {code: '192', name: 'ایجرود'}, {
          code: '193',
          name: 'خدابنده(قیدار)'
        }, {code: '194', name: 'خرم دره'}, {code: '195', name: 'زنجان'}, {code: '196', name: 'طارم'}, {
          code: '197',
          name: 'ماهنشان'
        }, {code: '198', name: 'سلطانیه'}];
        break;
      }
      case '14': {
        this.cities = [{code: '199', name: 'دامغان'}, {code: '200', name: 'سمنان'}, {code: '201', name: 'شاهرود'}, {
          code: '202',
          name: 'گرمسار'
        }, {code: '203', name: 'مهدی شهر'}, {code: '204', name: 'میامی'}, {code: '205', name: 'آرادان'}];
        break;
      }
      case '15': {
        this.cities = [{code: '206', name: 'ایرانشهر'}, {code: '207', name: 'چابهار'}, {code: '208', name: 'خاش'}, {
          code: '209',
          name: 'زابل'
        }, {code: '210', name: 'زاهدان'}, {code: '211', name: 'زهک'}, {code: '212', name: 'سراوان'}, {
          code: '213',
          name: 'سرباز'
        }, {code: '214', name: 'نیکشهر'}, {code: '215', name: 'کنارک'}, {code: '216', name: 'هیرمند'}, {
          code: '217',
          name: 'قصرقند'
        }, {code: '218', name: 'مهرستان'}, {code: '219', name: 'سیب و سوران'}, {code: '220', name: 'فنوج'}, {
          code: '221',
          name: 'نیمروز'
        }, {code: '222', name: 'میرجاوه'}, {code: '223', name: 'هامون'}];
        break;
      }
      case '16': {
        this.cities = [{code: '224', name: 'آباده'}, {code: '225', name: 'ارسنجان'}, {code: '226', name: 'استهبان'}, {
          code: '227',
          name: 'اقلید'
        }, {code: '228', name: 'بوانات'}, {code: '229', name: 'پاسارگاد'}, {code: '230', name: 'جهرم'}, {
          code: '231',
          name: 'خرم بید'
        }, {code: '232', name: 'خنج'}, {code: '233', name: 'داراب'}, {code: '234', name: 'زرین دشت'}, {
          code: '235',
          name: 'سپیدان'
        }, {code: '236', name: 'شیراز'}, {code: '237', name: 'فراشبند'}, {code: '238', name: 'فسا'}, {
          code: '239',
          name: 'فیروزآیاد'
        }, {code: '240', name: 'قیر و کارزین'}, {code: '241', name: 'لارستان'}, {code: '242', name: 'لامرد'}, {
          code: '243',
          name: 'مرودشت'
        }, {code: '244', name: 'مهر'}, {code: '245', name: 'ممستی'}, {code: '246', name: 'نی ریز'}, {
          code: '247',
          name: 'کازرون'
        }, {code: '248', name: 'سروستان'}, {code: '249', name: 'رستم'}, {code: '250', name: 'گراش'}, {
          code: '251',
          name: 'خرامه'
        }, {code: '252', name: 'کوار'}];
        break;
      }
      case '17': {
        this.cities = [{code: '255', name: 'آبیک'}, {code: '256', name: 'البرز'}, {code: '257', name: 'بویین زهرا'}, {
          code: '258',
          name: 'تاکستان'
        }, {code: '259', name: 'قزوین'}, {code: '260', name: 'آوج'}];
        break;
      }
      case '18': {
        this.cities = [{code: '261', name: 'قم'}];
        break;
      }
      case '19': {
        this.cities = [{code: '262', name: 'آزادشهر'}, {code: '263', name: 'گلستان - آزادشهر'}, {
          code: '264',
          name: 'آق قلا'
        }, {code: '265', name: 'بندر ترکمن'}, {code: '266', name: 'بندر گز'}, {code: '267', name: 'رامیان'}, {
          code: '268',
          name: 'علی آباد'
        }, {code: '269', name: 'گرگان'}, {code: '270', name: 'گنبد کاووس'}, {code: '271', name: 'مینو دشت'}, {
          code: '272',
          name: 'کرد کوی'
        }, {code: '273', name: 'کلاله'}, {code: '274', name: 'گالیکش'}, {code: '275', name: 'گمیشان'}, {
          code: '276',
          name: 'مراوه تپه'
        }];
        break;
      }
      case '20': {
        this.cities = [{code: '277', name: 'آستارا'}, {code: '278', name: 'آستانه اشرفیه'}, {
          code: '279',
          name: 'املش'
        }, {code: '280', name: 'بندر انزلی'}, {code: '281', name: 'تالش'}, {code: '282', name: 'رشت'}, {
          code: '283',
          name: 'رضوان شهر'
        }, {code: '284', name: 'رودبار'}, {code: '285', name: 'رودسر'}, {code: '286', name: 'سیاهکل'}, {
          code: '287',
          name: 'شفت'
        }, {code: '288', name: 'صومعه سرا'}, {code: '289', name: 'فومن'}, {code: '290', name: 'لاهیجان'}, {
          code: '291',
          name: 'لنگرود'
        }, {code: '292', name: 'ماسال'}];
        break;
      }
      case '21': {
        this.cities = [{code: '293', name: 'ازنا'}, {code: '294', name: 'الیگودرز'}, {code: '295', name: 'بروجرد'}, {
          code: '296',
          name: 'پل دختر'
        }, {code: '297', name: 'خرم آباد'}, {code: '298', name: 'دلقان(نورآباد)'}, {code: '299', name: 'دورود'}, {
          code: '300',
          name: 'سلسله(الشتر)'
        }, {code: '301', name: 'کوهدشت'}];
        break;
      }
      case '22': {
        this.cities = [{code: '302', name: 'آمل'}, {code: '303', name: 'بابل'}, {code: '304', name: 'بابلسر'}, {
          code: '305',
          name: 'بهشهر'
        }, {code: '306', name: 'تنکابن'}, {code: '307', name: 'جویبار'}, {code: '308', name: 'چالوس'}, {
          code: '309',
          name: 'رامسر'
        }, {code: '310', name: 'ساری'}, {code: '311', name: 'سوادکوه'}, {code: '312', name: 'عباس آباد'}, {
          code: '313',
          name: 'قائم شهر'
        }, {code: '314', name: 'گلوگاه'}, {code: '315', name: 'محمود آباد'}, {code: '316', name: 'نور'}, {
          code: '317',
          name: 'نوشهر'
        }, {code: '318', name: 'نکا'}, {code: '319', name: 'فریدونکنار'}, {code: '320', name: 'زیراب'}, {
          code: '321',
          name: 'سوادکوه شمالی'
        }, {code: '322', name: 'میاندرود'}, {code: '323', name: 'کلاردشت'}, {code: '324', name: 'سیمرغ'}];
        break;
      }
      case '23': {
        this.cities = [{code: '325', name: 'آشتیان'}, {code: '326', name: 'اراک'}, {code: '327', name: 'تفرش'}, {
          code: '328',
          name: 'خمین'
        }, {code: '329', name: 'دلیجان'}, {code: '330', name: 'زرندیه'}, {code: '331', name: 'ساوه'}, {
          code: '332',
          name: 'شازند'
        }, {code: '333', name: 'محلات'}, {code: '334', name: 'کمیجان'}, {code: '335', name: 'خنداب'}, {
          code: '336',
          name: 'فراهان'
        }];
        break;
      }
      case '24': {
        this.cities = [{code: '337', name: 'بستک'}, {code: '338', name: 'بندرعباس'}, {code: '339', name: 'بندر لنگه'}, {
          code: '340',
          name: 'پارسیان'
        }, {code: '341', name: 'جاسک'}, {code: '342', name: 'حاجی آباد'}, {code: '343', name: 'خمیر'}, {
          code: '344',
          name: 'رودان(دهبارز)'
        }, {code: '345', name: 'میناب'}, {code: '346', name: 'سیربک'}, {code: '347', name: 'قشم'}, {
          code: '348',
          name: 'ابوموسی'
        }, {code: '349', name: 'بشاگرد'}, {code: '350', name: 'کیش'}];
        break;
      }
      case '25': {
        this.cities = [{code: '351', name: 'اسد آباد'}, {code: '352', name: 'بهار'}, {code: '353', name: 'تویسرکان'}, {
          code: '354',
          name: 'رزن'
        }, {code: '355', name: 'فامتین'}, {code: '356', name: 'ملایر'}, {code: '357', name: 'نهاوند'}, {
          code: '358',
          name: 'همدان'
        }, {code: '359', name: 'کیودرآهنگ'}];
        break;
      }
      case '26': {
        this.cities = [{code: '360', name: 'بانه'}, {code: '361', name: 'بیجار'}, {code: '362', name: 'دیواندره'}, {
          code: '363',
          name: 'سروآباد'
        }, {code: '364', name: 'سقز'}, {code: '365', name: 'سنندج'}, {code: '366', name: 'قروه'}, {
          code: '367',
          name: 'مریوان'
        }, {code: '368', name: 'کامیاران'}, {code: '369', name: 'دهگلان'}];
        break;
      }
      case '27': {
        this.cities = [{code: '370', name: 'بافت'}, {code: '371', name: 'بردسیر(مشیز)'}, {code: '372', name: 'بم'}, {
          code: '373',
          name: 'راور'
        }, {code: '374', name: 'رفسنجان'}, {code: '375', name: 'زرند'}, {code: '376', name: 'سیرجان'}, {
          code: '377',
          name: 'شهر بابک'
        }, {code: '378', name: 'قهرج'}, {code: '379', name: 'کرمان'}, {code: '380', name: 'کوهبنان'}, {
          code: '381',
          name: 'انار'
        }, {code: '382', name: 'ریگان'}, {code: '383', name: 'رابر'}, {code: '420', name: 'جیرفت'}, {
          code: '421',
          name: 'رودبار جنوبی'
        }, {code: '422', name: 'عنبر آباد'}, {code: '423', name: 'منوجان'}, {code: '424', name: 'کهنوج'}, {
          code: '425',
          name: 'قلعه گنج'
        }];
        break;
      }
      case '28': {
        this.cities = [{code: '384', name: 'اسلام آباد غرب'}, {code: '385', name: 'پاوه'}, {
          code: '386',
          name: 'ثلاث باباجانی'
        }, {code: '387', name: 'جوانرود'}, {code: '388', name: 'دالاهو'}, {code: '389', name: 'روانسر'}, {
          code: '390',
          name: 'سرپل ذهاب'
        }, {code: '391', name: 'سنقر'}, {code: '392', name: 'صحنه'}, {code: '393', name: 'قصر شیرین'}, {
          code: '394',
          name: 'گیلانغرب'
        }, {code: '395', name: 'هرسین'}, {code: '396', name: 'کرمانشاه'}, {code: '397', name: 'کنگاور'}];
        break;
      }
      case '29': {
        this.cities = [{code: '398', name: 'بهمئی'}, {code: '399', name: 'دنا'}, {code: '400', name: 'گچساران'}, {
          code: '401',
          name: 'کهگیلویه'
        }, {code: '402', name: 'بویر احمد'}, {code: '403', name: 'باشت'}, {code: '427', name: 'یاسوج'}];
        break;
      }
      case '30': {
        this.cities = [{code: '404', name: 'ابرکوه'}, {code: '405', name: 'اردکان'}, {code: '406', name: 'بافق'}, {
          code: '407',
          name: 'تفت'
        }, {code: '408', name: 'خاتم'}, {code: '409', name: 'اشکذر'}, {code: '410', name: 'مهریز'}, {
          code: '411',
          name: 'میبد'
        }, {code: '412', name: 'یزد'}, {code: '413', name: 'بهاباد'}];
        break;
      }
      case '31': {
        this.cities = [{code: '414', name: 'ساوجبلاغ'}, {code: '415', name: 'کرج'}, {code: '416', name: 'نظرآباد'}, {
          code: '417',
          name: 'فردیس'
        }, {code: '418', name: 'اشتهارد'}, {code: '419', name: 'طالقان'}, {code: '426', name: 'هشتگرد'}];
        break;
      }
      default: {
        this.cities = [];
        break;
      }
    }
  }

  imageUploader(event): void {
    const formData = new FormData();
    formData.append('image', event.files[0], event.files[0].name);
    this.userService.uploadFile(formData).subscribe((response) => {
      if (response.success === true) {
        this.form.controls.image.setValue(response.imagePath);
        this.messageService.add({
          severity: 'success',
          summary: ' آپلود تصویر ',
          detail: 'تصویر با موفقیت آپلود شد.'
        });
      } else {
        this.messageService.add({severity: 'error', summary: ' آپلود تصویر محصول ', detail: response.data});
      }
    });
  }

  password(formGroup: FormGroup): any {
    const {value: password} = formGroup.get('password');
    const {value: confirmPassword} = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }


  startTimer() {
    this.timeLeft = 70;
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

  sendSMS() {
    this.spinner.show();
    this.userService.onfindUser(this.mobileForm.value).subscribe((result) => {
      if (result['success'] === true) {
        this.spinner.hide();
        this.messageService.add({severity: 'error', summary: 'ناموفق ', detail: 'کاربری با این شماره قبلا ثبت نام کرده است', sticky: true});

      } else {

        this.display = true;
        this.userService.getTokenSms().subscribe((res) => {
          if (res['IsSuccessful'] === true) {
            this.getCodeSmS = this.randomNumber();
            let token = res['TokenKey'];
            let data = {
              ParameterArray: [
                {Parameter: 'VerificationCode', ParameterValue: this.getCodeSmS}
              ],
              Mobile: this.mobileForm.get('mobile').value,
              TemplateId: '41804'

            };

            this.userService.sendSms(data, token).subscribe((res1) => {
              if (res['IsSuccessful'] === true) {
                this.resendSMS = false;
                this.spinner.hide();
                this.startTimer();
                // this.messageService.add({severity: 'error', summary: 'ثبت نام ', detail: res1['Message']});
              }
            });
          }
        });
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

  changeMobile() {
    this.userService.changeMobile(this.user.id, this.mobileForm.value).subscribe((response) => {
      console.log(response);
      if (response['success'] === true) {
        this.localStorage.removeCurrentUser();
        this.router.navigateByUrl('/home/account');
      }
    });

  }
}
