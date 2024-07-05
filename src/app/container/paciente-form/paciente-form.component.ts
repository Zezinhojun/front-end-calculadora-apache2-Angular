import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

import { FormUtilsService } from '../../shared/services/form/form-utils.service';
import { SheetsService } from '../../shared/services/sheets.service';


export interface TabelaAPache {
  pontos: string;
  mortalidade: string;

}
interface LastValues {
  [key: string]: number;
}

const ELEMENT_DATA: TabelaAPache[] = [
  { pontos: "0 - 4 pontos", mortalidade: "4% não cirúrgicos, 1% pós-cirúrgico" },
  { pontos: "5 - 9 pontos", mortalidade: "8% não cirúrgico, 3% pós-cirúrgico" },
  { pontos: "10 - 14 pontos", mortalidade: "15% não cirúrgico, 7% pós cirúrgico" },
  { pontos: "15 - 19 pontos", mortalidade: "24% não cirúrgico, 12% pós-cirúrgico" },
  { pontos: "20 - 24 pontos", mortalidade: "40% não cirúrgico, 30% pós-cirúrgico" },
  { pontos: "25 - 29 pontos", mortalidade: " 55% não cirúrgico, 35% pós-cirúrgico" },
  { pontos: "30 - 34 pontos", mortalidade: " Aprox. 73% ambos" },
  { pontos: "35 - 100 pontos", mortalidade: "	85% não cirúrgico, 88% pós-cirúrgico" },
];

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },],
  imports: [MatTableModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule],

  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss'
})

export default class PacienteFormComponent {

  constructor(private fb: FormBuilder) {
    this.getPatology();
    this.loadAtendimentos();
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
        end: [null]
      })
    })
    this.filteredOptions = this.patologies.slice();
    this.form.get('campaignOne')!.valueChanges.subscribe(value => {
      const start = value.start;
      const end = value.end;
      if (start && end) {
        const diff = this.calculateDateDifference(start, end);
        this.form.get('tempoDeInternacao')!.setValue(diff);
      }
    });
  }

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  private readonly _sheetSvc = inject(SheetsService)
  private readonly _snackBar = inject(MatSnackBar)
  private readonly router = inject(Router)
  private lastValues: LastValues = {};
  private uniqueFieldValues: Record<string, number> = {};
  private serviceExists: boolean = false;
  private atendimentoList: number[] = [];

  public _formUtilsSvc = inject(FormUtilsService)
  public displayedColumns: string[] = ['pontos', 'mortalidade'];
  public dataSource = ELEMENT_DATA;
  public filteredOptions: string[];
  public patologies: string[] = [];
  public isLoading = this._sheetSvc.isLoading
  public form!: FormGroup;
  public totalApache = new BehaviorSubject(0)


  public findLineForValue(value: number): number | null {
    for (const item of ELEMENT_DATA) {
      const currentRange = item.pontos.split(' - ')
      const minPoints = parseInt(currentRange[0].replace("0 - ", ''));
      const maxPoints = parseInt(currentRange[1].replace(" pontos", ""));

      if (value >= minPoints && value <= maxPoints) {
        return ELEMENT_DATA.indexOf(item);
      }
    }
    return null
  }

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true)
      const glimControl = this.form.get('glim')
      const internacaoControl = this.form.get('internacao')
      if (glimControl && internacaoControl) {
        const formattedDateGlim = this.formatDate(glimControl.value);
        const formattedDateInternacao = this.formatDate(internacaoControl.value);
        this.form.patchValue({
          glim: formattedDateGlim,
          internacao: formattedDateInternacao
        });
      }
      const formData = this.form.value
      const requestBody = {
        values: [[
          formData.atendimento,
          formData.age,
          formData.patologia,
          formData.internacao,
          formData.glim,
          formData.dignosticoGlim,
          formData.desfecho,
          formData.sexo,
          formData.tempoDeInternacao,
          formData.falenciaOrImuno,
          formData.temperatura,
          formData.pressao,
          formData.freqCardiaca,
          formData.freqRespiratoria,
          formData.pao2,
          formData.phOrHco3,
          formData.sodio,
          formData.potassio,
          formData.creatinina,
          formData.hematocrito,
          formData.leucocitos,
          formData.glasgow,
          formData.ageApache,
          formData.criticalHealth,
          formData.totalApache
        ]]
      };

      this._sheetSvc.createRow(requestBody).subscribe({
        next: () => this.onSuccess(),
        error: (error) => {
          const errorMessage = error?.error?.error ?? "Erro ao criar usuário";
          this.onError(errorMessage);
        }
      });
      setTimeout(() => {
        this.isLoading.set(false)
        this.router.navigate(['']);
      }, 3000);
    } else {
      this._formUtilsSvc.validateAllFormFields(this.form)
    }
  }

  public onSelectionChange(event: any, controlName: string) {
    const value = parseInt(event?.value);
    if (!isNaN(value)) {
      this.uniqueFieldValues[controlName] = value;
      this.totalApache.next((Object.values(this.uniqueFieldValues).reduce((acc, val) => acc + val, 0)))
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
      if (this.atendimentoList.includes(Number(fieldValue))) {
        this.form.get('atendimento')?.setErrors({ 'duplicate': true });
        this.onError("Atendimento já cadastrado");
        this.form.get('atendimento')?.reset();
      }
    }
  }

  public filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.patologies.filter(o => o.toLowerCase().includes(filterValue));
  }


  private calculateDateDifference(start: Date, end: Date): number {
    const startMoment = moment(start);
    const endMoment = moment(end);
    return endMoment.diff(startMoment, 'days');
  }

  private readonly campaignOne = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  private updateTotalApacheInForm() {
    this.form.get('totalApache')?.setValue(this.totalApache.value);
  }

  private getPatology() {
    this._sheetSvc.getPatology().subscribe({
      next: (data: any) => {
        const patologias = data.values.map((item: any[]) => item[0]);
        this.patologies = Array.from(new Set(patologias));
        this.filteredOptions = [...this.patologies];
      }
    });
  }

  private checkService(): void {
    const serviceName = this.form.get('serviceName')?.value;
    this._sheetSvc.getTreatments().subscribe({
      next: (data) => {
        const existingServices = data.values.map((item: any[]) => item[0]);
        this.serviceExists = existingServices.includes(serviceName);
        if (this.serviceExists) {
          console.warn('Serviço já existe na lista:', serviceName);
        } else {
          console.log('Serviço não existe, pode prosseguir:', serviceName);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar serviços:', err);
      }
    });
  }

  private getFieldValue(fieldName: string) {
    return this.form.get(fieldName)?.value;
  }

  private loadAtendimentos(): void {
    console.log(this.atendimentoList);
    this._sheetSvc.getTreatments().subscribe({
      next: (data) => {
        console.log(this.atendimentoList);
        this.atendimentoList = data.values.map((item: any[]) => Number(item[0]));

      },
    });
  }

  private onError(message: string) {
    this._snackBar.open(message, "x", { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open("Paciente criado com sucesso", '', { duration: 2000 });
    this.onCancel()
  }

  private onCancel() {
    this.router.navigate([''])
  }

  private formatDate(date: any): string {
    return moment(date).format('DD/MM/YYYY');
  }


}
