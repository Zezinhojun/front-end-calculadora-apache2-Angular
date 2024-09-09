import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IFormFieldConfig } from '../../shared/model/formFieldConfig.model';
import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [
    MaterialModule,
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
