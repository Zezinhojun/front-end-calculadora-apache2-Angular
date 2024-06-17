import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';



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
    MatButtonModule],

  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss'
})
export default class PacienteFormComponent implements OnInit {
  form!: FormGroup;
  houses: string[] = [];
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: string[] = ['Cirurgia cardíaca', 'Tumor cerebral', 'HSA', 'IRA'];
  filteredOptions: string[];
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      atendimento: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      patologia: new FormControl('', [Validators.required]),
      internacao: new FormControl('', [Validators.required]),
      glim: new FormControl('', [Validators.required]),
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
    this.filteredOptions = this.options.slice();
  }
  ngOnInit(): void {
    // Escuta as mudanças no intervalo de datas e calcula a diferença
    this.form.get('campaignOne')!.valueChanges.subscribe(value => {
      const start = value.start;
      const end = value.end;
      if (start && end) {
        const diff = this.calculateDateDifference(start, end);
        this.form.get('tempoDeInternacao')!.setValue(diff);
      }
    });
  }

  calculateDateDifference(start: Date, end: Date): number {
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24)); // Convert milliseconds to days
  }


  submit() {
    if (this.form.valid) {
      console.log(this.form.value)
    }
    console.log(this.form.value)
  }
  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  soma: number = 39;
  title = 'calculadora-apache2';
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
}
