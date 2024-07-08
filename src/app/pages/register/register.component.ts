import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { IFormFieldConfig } from '../../shared/model/formFieldConfig.model';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormUtilsService } from '../../shared/services/form/form-utils.service';
import { FormUserComponent } from './../../components/form-user/form-user.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormUserComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  title = "Cadastro"
  fields: IFormFieldConfig[] = [
    {
      label: 'Nome',
      inputType: 'text',
      formControlName: 'name',
      name: 'name',
      id: 'name',
      autocomplete: 'name',
      required: true
    },
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
  ];

  public form!: FormGroup;
  private _snackBar = inject(MatSnackBar)
  private _formUtilsSvc = inject(FormUtilsService)
  private _authSvc = inject(AuthService)
  readonly router = inject(Router)

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    })
  }

  private onError(message: string) {
    this._snackBar.open(message, "x", { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open("Usuário cadastrado com sucesso", '', { duration: 3000 });
    this.onCancel()
  }

  public onCancel() {
    this.router.navigate(['login'])
  }

  public submit() {
    if (this.form.valid) {
      this._authSvc.register(this.form.value).subscribe({
        next: () => this.onSuccess(),
        error: (errorMessage) => {
          this.onError(errorMessage);
        }
      });
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form);
    }
  }

}
