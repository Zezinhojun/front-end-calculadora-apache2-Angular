import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { FormUtilsService } from '../../shared/services/form/form-utils.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  _formUtilsSvc = inject(FormUtilsService)
  private _authSvc = inject(AuthService)
  private _snackBar = inject(MatSnackBar)
  private router = inject(Router)
  form!: FormGroup;


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
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

  //Tratar os erros do backend
  submit() {
    if (this.form.valid) {
      this._authSvc.login(this.form.value).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          const errorMessage = error?.error?.error ?? "Email ou senha inválida";
          this.onError(errorMessage);
        }
      })
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form)
    }
  }

}
