import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FormUserComponent } from '../../components/form-user/form-user.component';
import { IFormFieldConfig } from '../../shared/model/formFieldConfig.model';
import { AuthService } from '../../shared/services/auth.service';
import { FormUtilsService } from '../../shared/services/form/form-utils.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormUserComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  title = "Login"
  fields: IFormFieldConfig[] = [
    {

      label: 'Email',
      inputType: 'email',
      formControlName: 'email',
      name: 'email',
      id: 'email',
      autocomplete: 'username',
      required: true
    },
    {
      label: 'Senha',
      inputType: 'password',
      formControlName: 'password',
      name: 'password',
      id: 'password',
      autocomplete: 'current-password',
      required: true
    },
    {
      label: 'Lembre-me',
      formControlName: 'remember',
      name: 'remember',
      id: 'remember',
      required: false
    },
  ];

  _formUtilsSvc = inject(FormUtilsService)
  private _authSvc = inject(AuthService)
  private _snackBar = inject(MatSnackBar)
  router = inject(Router)
  public form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: [false]
    })
  }

  private onError(message: string) {
    this._snackBar.open(message, "x", { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open("Usuário logado com sucesso", '', { duration: 2000 });
    this.onCancel()
  }

  onCancel() {
    this.router.navigate([''])
  }

  submit() {
    if (this.form.valid) {
      this._authSvc.login(this.form.value).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          this.onError(error);
        }
      })
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form)
    }
  }
}
