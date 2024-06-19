import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SheetsService } from '../../shared/services/sheets.service';
import { map, Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import moment from 'moment';
import { Router } from '@angular/router';



export interface PeriodicElement {
  pontos: string;
  mortalidade: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
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
  providers: [provideNativeDateAdapter()],
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
  _sheetSvc = inject(SheetsService)
  router = inject(Router)
  form!: FormGroup;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: string[] = ['Cirurgia cardíaca', 'Tumor cerebral', 'HSA', 'IRA'];
  filteredOptions: string[];
  isLoading = signal<boolean>(false)
  constructor(private fb: NonNullableFormBuilder) {

    this.form = this.fb.group({
      atendimento: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      patologia: new FormControl('', [Validators.required]),
      internacao: new FormControl('', [Validators.required]),
      glim: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      dignosticoGlim: new FormControl('', [Validators.required]),
      desfecho: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      tempoDeInternacao: new FormControl('', [Validators.required]),
      falenciaOrImuno: new FormControl('', [Validators.required]),
      temperatura: new FormControl('', [Validators.required]),
      pressao: new FormControl('', [Validators.required]),
      freqCardiaca: new FormControl('', [Validators.required]),
      freqRespiratoria: new FormControl('', [Validators.required]),
      pao2: new FormControl('', [Validators.required]),
      phOrHco3: new FormControl('', [Validators.required]),
      sodio: new FormControl('', [Validators.required]),
      potassio: new FormControl('', [Validators.required]),
      creatinina: new FormControl('', [Validators.required]),
      hematocrito: new FormControl('', [Validators.required]),
      leucocitos: new FormControl('', [Validators.required]),
      glasgow: new FormControl('', [Validators.required]),
      ageApache: new FormControl('', [Validators.required]),
      criticalHealth: new FormControl('', [Validators.required]),
      campaignOne: this.fb.group({
        start: [null],
        end: [null]
      })
    })

    this.form.get('campaignOne')!.valueChanges.subscribe(value => {
      const start = value.start;
      const end = value.end;
      if (start && end) {
        const diff = this.calculateDateDifference(start, end);
        this.form.get('tempoDeInternacao')!.setValue(diff);
      }
    });
    this.filteredOptions = this.options.slice();
  }

  calculateDateDifference(start: Date, end: Date): number {
    const startMoment = moment(start);
    const endMoment = moment(end);
    return endMoment.diff(startMoment, 'days'); // Calcula a diferença em dias
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.viewValue;
    const patologiaControl = this.form.get('patologia');
    if (patologiaControl) { // Verifica se patologiaControl não é null
      patologiaControl.patchValue(selectedOption);
    }
  }

  submit() {
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
      ]]
    };

    this._sheetSvc.createRow(requestBody).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
    setTimeout(() => {
      this.isLoading.set(false)
      this.router.navigate(['/dashboard']);
    }, 3000); // 3000 milissegundos = 3 segundos
  }

  formatDate(date: any): string {
    return moment(date).format('DD/MM/YYYY');
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.toLowerCase().includes(filterValue));
  }

  displayedColumns: string[] = ['pontos', 'mortalidade'];
  dataSource = ELEMENT_DATA;

  readonly campaignOne = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  getPatology() {
    this._sheetSvc.getPatology().subscribe((data: any) => {
      // Mapeia os dados para extrair apenas os valores da coluna de patologia
      const patologias = data.values.map((item: any[]) => item[0]); // Supondo que os dados estão na primeira coluna

      // Atualiza o array options com os valores obtidos
      this.options = patologias;

      console.log('Patologias obtidas:', this.options);
    }, error => {
      console.error('Erro ao buscar patologias:', error);
      // Trate o erro conforme necessário (exibir mensagem de erro, etc.)
    });
  }



}
