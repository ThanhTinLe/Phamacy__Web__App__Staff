import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router, Routes } from '@angular/router';
import { ACCESSTOKEN } from './../../core/utils/AppConfig';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DOMAIN } from 'src/app/core/utils/AppConfig';

@Component({
  selector: 'app-login-template',
  templateUrl: './login-template.component.html',
  styleUrls: ['./login-template.component.css']
})
export class LoginTemplateComponent implements OnInit {

  username: string = ''
  password: string = ''
  token: string = ''
  check: boolean = true
  currentStep: number = 0
  passwordVisible = false;
  loadingClick: boolean = false

  isVisibleForgotPassword = false;
  // isConfirmLoading = false;
  forgotPasswordInfo: any
  chagePasswordata = this.fb.group({
    tokeRecovery: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  })
  get statusError() {
    return this.chagePasswordata.controls;
  }

  constructor(
    private httpclient: HttpClient,
    private route: Router,
    private notification: NzNotificationService,
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  login() {

    console.log('ok');
    this.check = true
    if (this.username == '') {
      this.check = false
    }
    if (this.password == '') {
      this.check = false
    }
    if (this.check) {
      this.loadingClick = true
      var formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      formData.append('fCMToken', 'fCMToken')
      this.httpclient.post(DOMAIN + 'auth/user/login', formData).subscribe((result: any) => {
        if (result.accessToken) {
          if (result.isAdmin == false) {
            this.token = `Bearer ${result.accessToken}`
            localStorage.setItem(ACCESSTOKEN, this.token)
            console.log(localStorage.getItem(ACCESSTOKEN));

            if (localStorage.getItem(ACCESSTOKEN)) {
              this.notification.create(
                'success',
                '????ng nh???p th??nh c??ng',
                ''
              );
              this.route.navigate(['home'])

            }
          } else {
            this.loadingClick = false
            this.notification.create(
              'error',
              '????ng nh???p th???t b???i',
              'Vui l??ng s??? d???ng t??i kho???n nh??n vi??n ????? ????ng nh???p v??o ???ng d???ng'
            );
          }
        }
      }, err => {
        this.loadingClick = false
        this.notification.create(
          'error',
          '????ng nh???p th???t b???i',
          'Vui l??ng ki???m tra th??ng tin t??i kho???n v?? m???t kh???u'
        );
      })
    }
  }

  showModal() {
    this.isVisibleForgotPassword = true
  }

  nextButton() {


    if (this.currentStep == 0) {
      console.log(this.username);

      this.userService.getTokenVerifyPassword({ userAccount: this.username }).subscribe((result) => {
        if (result) {
          console.log('ok');
          console.log(result);
          this.forgotPasswordInfo = result.data
          this.currentStep += 1
        }
      }, err => {
        this.notification.create(
          'error',
          err.error.message,
          ''
        )
      })
    }

  }
  previousButton() {
    // this.currentStep -= 1
    console.log('ok');
    console.log(this.chagePasswordata.value);

    var formdata = new FormData()
    formdata.append('userId', this.forgotPasswordInfo.userId)
    formdata.append('newPassword', this.chagePasswordata.value.newPassword + '')
    formdata.append('confirmPassword', this.chagePasswordata.value.confirmPassword + '')
    formdata.append('tokenRecovery', this.chagePasswordata.value.tokeRecovery + '')

    this.userService.resetPassword(formdata).subscribe((result) => {
      this.isVisibleForgotPassword = false
      this.notification.create(
        'success',
        result.message,
        ''
      )
    }, err => {
      this.notification.create(
        'error',
        err.error.message,
        ''
      )
    })

  }

  closeForgotPasswordModal() {
    this.isVisibleForgotPassword = false
  }

  chagePassword() {
    console.log('ok22');
  }


}
