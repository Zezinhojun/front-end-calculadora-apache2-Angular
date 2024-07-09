import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';
import PacienteMapper from '../../shared/services/mappers/pacients-mapper';
import { PacienteService } from '../../shared/services/paciente/paciente.service';
import { SheetsService } from '../../shared/services/sheets/sheets.service';
import { ResultTableComponent } from '../../components/result-table/result-table.component';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ResultTableComponent,
  ],

  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss',
})
export default class PacienteFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  private readonly _sheetSvc = inject(SheetsService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private uniqueFieldValues: Record<string, number> = {};
  private atendimentoList: number[] = [];
  private readonly _pacienteSvc = inject(PacienteService);
  public _formUtilsSvc = inject(FormUtilsService);

  public filteredOptions!: string[];
  public patologies: string[] = [];
  public isLoading = this._sheetSvc.isLoading;
  public form!: FormGroup;
  public totalApache = new BehaviorSubject(0);

  ngOnInit(): void {
    this.initializeForm();
    this.getPatology();
    this.getTreatments();
    this._pacienteSvc.fetchTreatments();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      atendimento: new FormControl('', [Validators.required]),
      age: ['', [Validators.required]],
      patologia: ['', Validators.required],
      internacao: ['', [Validators.required]],
      glim: ['', [Validators.required]],
      dignosticoGlim: [''],
      desfecho: [''],
      sexo: [''],
      tempoDeInternacao: [''],
      falenciaOrImuno: [''],
      temperatura: [''],
      pressao: [''],
      freqCardiaca: [''],
      freqRespiratoria: [''],
      pao2: [''],
      phOrHco3: [''],
      sodio: [''],
      potassio: [''],
      creatinina: [''],
      hematocrito: [''],
      leucocitos: [''],
      glasgow: [''],
      ageApache: [''],
      criticalHealth: [''],
      totalApache: [this.totalApache.value],
      campaignOne: this.fb.group({
        start: [null],
        end: [null],
      }),
    });

    this.form.get('campaignOne')!.valueChanges.subscribe((value) => {
      const start = value.start;
      const end = value.end;
      if (start && end) {
        const diff = PacienteMapper.calculateDateDifference(start, end);
        this.form.get('tempoDeInternacao')!.setValue(diff);
      }
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const formData = this.form.value;
      this._pacienteSvc.createPaciente(formData).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          const errorMessage = error?.error?.error ?? 'Erro ao criar usuário';
          this.onError(errorMessage);
        },
      });
      setTimeout(() => {
        this.isLoading.set(false);
        this.router.navigate(['']);
      }, 3000);
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form);
    }
  }

  public onSelectionChange(event: any, controlName: string) {
    const value = parseInt(event?.value);
    if (!isNaN(value)) {
      this.uniqueFieldValues[controlName] = value;
      this.totalApache.next(
        Object.values(this.uniqueFieldValues).reduce(
          (acc, val) => acc + val,
          0,
        ),
      );
      this.updateTotalApacheInForm();
    }
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.viewValue;
    const patologiaControl = this.form.get('patologia');
    if (patologiaControl) {
      patologiaControl.patchValue(selectedOption);
    }
  }

  public onBlur(fieldName: string): void {
    const fieldValue = this.form.get(fieldName)?.value;
    if (fieldName === 'atendimento') {
      this.validateAtendimentoUniqueness(Number(fieldValue));
    }
  }

  private validateAtendimentoUniqueness(atendimento: number): void {
    if (this.atendimentoList.includes(atendimento)) {
      this.form.get('atendimento')?.setErrors({ duplicate: true });
      this.onError('Atendimento já cadastrado');
      this.form.get('atendimento')?.reset();
    }
  }

  public filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this._pacienteSvc.filterPatologies(
      this.patologies,
      filterValue,
    );
  }

  private updateTotalApacheInForm() {
    this.form.get('totalApache')?.setValue(this.totalApache.value);
  }

  private getPatology() {
    this._pacienteSvc.getPatology().subscribe({
      next: (data: any) => {
        const patologias = data.values.map((item: any[]) => item[0]);
        this.patologies = Array.from(new Set(patologias));
        this.filteredOptions = [...this.patologies];
      },
    });
  }

  private getTreatments(): void {
    this._pacienteSvc.getTreatmentList().subscribe({
      next: (atendimentoList) => {
        this.atendimentoList = atendimentoList;
      },
    });
  }

  private onError(message: string) {
    this._snackBar.open(message, 'x', { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open('Paciente criado com sucesso', '', { duration: 2000 });
    this.onCancel();
  }

  private onCancel() {
    this.router.navigate(['']);
  }
}
