import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({ onlySelf: true })
        this.validateAllFormFields(control)
      }
    })
  }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field)
  }

  getErrorMessageFromField(field: UntypedFormControl) {
    if (field?.hasError('required')) return 'Campo obrigatório'

    if (field?.hasError('minlenght')) {
      const requiredLenght: number = field.errors ? field.errors['minlenght']['requreidLengtjh'] : 5
      return `Tamanho minimo precisa ser de ${requiredLenght} caracteres.`
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors['maxlength']['requiredLength'] : 100
      return `Tamamho máximo precisa ser de ${requiredLength} caracteres`
    }
    return 'Campo invalido'
  }

  getFormArrayFieldErrorMessage(formGroup: UntypedFormGroup, formArrayName: string, fieldName: string, index: number) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray
    const field = formArray.controls[index].get(fieldName) as UntypedFormControl
    return this.getErrorMessageFromField(field)
  }

  isFormArrayRequired(formGroup: UntypedFormGroup, formArrayName: string) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray
    return !formArray.valid && formArray.hasError('required') && formArray.touched
  }
}
