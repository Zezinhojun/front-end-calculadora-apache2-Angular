export interface IFormFieldConfig {
  label: string;
  id: string;
  name: string;
  formControlName: string;
  inputType?: string;
  placeholder?: string;
  required: boolean;
  autocomplete?: string;
  options?: string[]
  color?: string
}
