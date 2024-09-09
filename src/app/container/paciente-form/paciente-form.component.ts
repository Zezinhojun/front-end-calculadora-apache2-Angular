import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';

import { ResultTableComponent } from '../../components/result-table/result-table.component';
import { MaterialModule } from '../../shared/material/material.module';
import { IPaciente } from '../../shared/model/commom.model';
import { FormUtilsService } from '../../shared/services/form-utils/form-utils.service';
import PacienteMapper from '../../shared/services/mappers/pacients-mapper';
import { SheetsService } from '../../shared/services/sheets/sheets.service';
import { PacienteService } from './../../shared/services/paciente/paciente.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  imports: [
    ReactiveFormsModule,
    ResultTableComponent,
    MaterialModule
  ],

  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss',
})
export default class PacienteFormComponent implements OnInit {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  public readonly _formUtilsSvc = inject(FormUtilsService);
  private readonly _sheetSvc = inject(SheetsService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _pacienteSvc = inject(PacienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public form!: FormGroup;
  public paciente: IPaciente | undefined;
  private lineId!: number | undefined;
  public filteredOptions = signal<string[]>([])
  public patologies = signal<string[]>([])
  private atendimentoList = signal<number[]>([]);
  public isLoading = this._sheetSvc.isLoading;
  public totalApache = signal<number>(0)

  constructor(private fb: FormBuilder) { }

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
    this.calculateTotal()

    this.form.valueChanges.pipe(
      distinctUntilChanged((prev, curr) => {
        return !Object.keys(curr).some(key => this.fieldsToMonitor.includes(key) && prev[key] !== curr[key])
      })
    ).subscribe(() => {
      this.calculateTotal()
    })
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
      totalApache: [this.totalApache()],
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
      this.calculateTotal()
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

  calculateTotal() {
    const total = this.fieldsToMonitor
      .map(fieldName => Number(this.form.get(fieldName)?.value || 0))
      .reduce((sum, value) => sum + value, 0)
    this.totalApache.set(total);
    this.form.get('totalApache')?.setValue(total, { emitEvent: false })
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
    if (this.atendimentoList().includes(atendimento)) {
      this.form.get('atendimento')?.setErrors({ duplicate: true });
      this.onError('Atendimento já cadastrado');
      this.form.get('atendimento')?.reset();
    }
  }

  public filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions.set(this._pacienteSvc.filterPatologies(
      this.patologies(),
      filterValue,
    ));
  }

  private getPatology() {
    this._pacienteSvc.getPatology().subscribe({
      next: (data: any) => {
        const patologias = data.values.map((item: any[]) => item[0]);
        this.patologies.set(Array.from(new Set(patologias)))
        this.filteredOptions.set([...this.patologies()])
      },
    });
  }

  private getTreatments(): void {
    this._pacienteSvc.getTreatmentList().subscribe({
      next: (atendimentoList) => {
        this.atendimentoList.set(atendimentoList)
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
