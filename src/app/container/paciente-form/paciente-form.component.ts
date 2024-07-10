import { PacienteService } from './../../shared/services/paciente/paciente.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
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
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';
import PacienteMapper from '../../shared/services/mappers/pacients-mapper';
import { SheetsService } from '../../shared/services/sheets/sheets.service';
import { ResultTableComponent } from '../../components/result-table/result-table.component';
import { IPaciente } from '../../shared/model/commom.model';

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
  private atendimentoList: number[] = [];
  private readonly _pacienteSvc = inject(PacienteService);
  public _formUtilsSvc = inject(FormUtilsService);
  public filteredOptions!: string[];
  public patologies: string[] = [];
  public isLoading = this._sheetSvc.isLoading;
  public form!: FormGroup;
  public totalApache = new BehaviorSubject(0);
  private readonly route = inject(ActivatedRoute);
  public paciente: IPaciente | undefined;
  private lineId!: number | undefined;
  private soma: number | null = null;

  ngOnInit(): void {
    this.getPatology();
    this.getTreatments();
    this._pacienteSvc.fetchTreatments();
    const pacienteData = this.route.snapshot.data['paciente'].values;
    this.route.params.subscribe((params) => (this.lineId = +params['lineId']));
    const paciente: IPaciente =
      pacienteData && pacienteData.length > 0
        ? {
            atendimento: pacienteData[0][0].toString(),
            idade: pacienteData[0][1],
            patologia: pacienteData[0][2],
            internacao: PacienteMapper.parseDate(pacienteData[0][3]),
            glim: PacienteMapper.parseDate(pacienteData[0][4]),
            dignosticoGlim: pacienteData[0][5].toString(),
            desfecho: pacienteData[0][6].toString(),
            sexo: pacienteData[0][7].toString(),
            falenciaOrImuno: pacienteData[0][9].toString(),
            temperatura: pacienteData[0][10].toString(),
            pressao: pacienteData[0][11].toString(),
            freqCardiaca: pacienteData[0][12].toString(),
            freqRespiratoria: pacienteData[0][13].toString(),
            pao2: pacienteData[0][14].toString(),
            phOrHco3: pacienteData[0][15].toString(),
            sodio: pacienteData[0][16].toString(),
            potassio: pacienteData[0][17].toString(),
            creatinina: pacienteData[0][18].toString(),
            hematocrito: pacienteData[0][19].toString(),
            leucocitos: pacienteData[0][20].toString(),
            glasgow: pacienteData[0][21].toString(),
            ageApache: pacienteData[0][22].toString(),
            criticalHealth: pacienteData[0][23].toString(),
          }
        : {
            atendimento: '',
            idade: '',
            patologia: '',
            internacao: '',
            glim: '',
            dignosticoGlim: '',
            desfecho: '',
            sexo: '',
            falenciaOrImuno: '',
            temperatura: '',
            pressao: '',
            freqCardiaca: '',
            freqRespiratoria: '',
            pao2: '',
            phOrHco3: '',
            sodio: '',
            potassio: '',
            creatinina: '',
            hematocrito: '',
            leucocitos: '',
            glasgow: '',
            ageApache: '',
            criticalHealth: '',
          };
    this.initializeForm(paciente);
    this.lineId = this.route.snapshot.params['lineId']
      ? +this.route.snapshot.params['lineId']
      : undefined;
    this.calcularSoma();

    this.form.valueChanges.subscribe(() => {
      this.calcularSoma();
    });
    this.monitorFieldChanges();
  }

  private initializeForm(paciente: IPaciente): void {
    this.form = this.fb.group({
      atendimento: [paciente.atendimento, [Validators.required]],
      age: [paciente.idade, [Validators.required]],
      patologia: [paciente.patologia, Validators.required],
      internacao: [paciente.internacao, [Validators.required]],
      glim: [paciente.glim, [Validators.required]],
      dignosticoGlim: [paciente.dignosticoGlim],
      desfecho: [paciente.desfecho],
      sexo: [paciente.sexo],
      tempoDeInternacao: [''],
      falenciaOrImuno: [paciente.falenciaOrImuno],
      temperatura: [paciente.temperatura],
      pressao: [paciente.pressao],
      freqCardiaca: [paciente.freqCardiaca],
      freqRespiratoria: [paciente.freqRespiratoria],
      pao2: [paciente.pao2],
      phOrHco3: [paciente.phOrHco3],
      sodio: [paciente.sodio],
      potassio: [paciente.potassio],
      creatinina: [paciente.creatinina],
      hematocrito: [paciente.hematocrito],
      leucocitos: [paciente.leucocitos],
      glasgow: [paciente.glasgow],
      ageApache: [paciente.ageApache],
      criticalHealth: [paciente.criticalHealth],
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
      this.calcularSoma();
      this.updateTotalApacheInForm();
      const formData = this.form.value;
      const values = PacienteMapper.formatFormData(formData).values;
      if (this.lineId !== undefined) {
        const dataToUpdate = {
          lineId: this.lineId,
          values: values,
        };
        this._pacienteSvc.updatePaciente(dataToUpdate).subscribe({
          next: () => {
            this._snackBar.open('Paciente atualizado com sucesso', '', {
              duration: 2000,
            });
            this.router.navigate(['']);
          },
          error: (error) => {
            const errorMessage =
              error?.error?.error ?? 'Erro ao atualizar paciente';
            this._snackBar.open(errorMessage, 'x', { duration: 3000 });
          },
        });
      } else {
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
      }
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form);
    }
  }

  private readonly fieldsToMonitor = [
    'temperatura',
    'pressao',
    'freqCardiaca',
    'freqRespiratoria',
    'pao2',
    'phOrHco3',
    'sodio',
    'potassio',
    'creatinina',
    'hematocrito',
    'leucocitos',
    'glasgow',
    'ageApache',
    'criticalHealth',
  ];

  private monitorFieldChanges(): void {
    this.fieldsToMonitor.forEach((field) => {
      this.form.get(field)?.valueChanges.subscribe(() => {
        this.calcularSoma();
      });
    });
  }

  private calcularSoma() {
    this.soma = this.sumFields();
    this.totalApache.next(this.soma);
  }

  private sumFields(): number {
    return this.fieldsToMonitor.reduce((sum, field) => {
      const valor = +this.form.get(field)?.value || 0;
      return sum + valor;
    }, 0);
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
      this.validateAtendimentoUniquenes(Number(fieldValue));
    }
  }

  private validateAtendimentoUniquenes(atendimento: number): void {
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
