import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { IFormFieldConfig } from '../../shared/model/formFieldConfig.model';
import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss',
})
export class FormUserComponent {
  _formUtilsSvc = inject(FormUtilsService);
  @Input() title!: string;
  @Input() form!: FormGroup;
  @Input() fields!: IFormFieldConfig[];
  @Input() submitButtonText!: string;
  @Output() formSubmit = new EventEmitter<void>();

  submit = (): any => this.formSubmit.emit();

  getErrorMessage(controlName: string): string {
    return this._formUtilsSvc.getErrorMessage(this.form, controlName);
  }
}
