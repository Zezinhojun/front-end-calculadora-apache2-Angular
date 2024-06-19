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
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  form!: FormGroup;
  private _snackBar = inject(MatSnackBar)
  _formUtilsSvc = inject(FormUtilsService)
  _authSvc = inject(AuthService)
  router = inject(Router)
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

  onCancel() {
    this.router.navigate(['login'])
  }

  submit() {
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
