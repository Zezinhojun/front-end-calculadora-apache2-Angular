import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import PacienteMapper from '../../shared/services/mappers/pacients-mapper';

export interface TabelaAPache {
  pontos: string;
  mortalidade: string;
}

@Component({
  selector: 'app-result-table',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.scss',
})
export class ResultTableComponent {
  tabelaApache: TabelaAPache[] = [
    {
      pontos: '0 - 4 pontos',
      mortalidade: '4% não cirúrgicos, 1% pós-cirúrgico',
    },
    {
      pontos: '5 - 9 pontos',
      mortalidade: '8% não cirúrgico, 3% pós-cirúrgico',
    },
    {
      pontos: '10 - 14 pontos',
      mortalidade: '15% não cirúrgico, 7% pós cirúrgico',
    },
    {
      pontos: '15 - 19 pontos',
      mortalidade: '24% não cirúrgico, 12% pós-cirúrgico',
    },
    {
      pontos: '20 - 24 pontos',
      mortalidade: '40% não cirúrgico, 30% pós-cirúrgico',
    },
    {
      pontos: '25 - 29 pontos',
      mortalidade: ' 55% não cirúrgico, 35% pós-cirúrgico',
    },
    { pontos: '30 - 34 pontos', mortalidade: ' Aprox. 73% ambos' },
    {
      pontos: '35 - 100 pontos',
      mortalidade: '	85% não cirúrgico, 88% pós-cirúrgico',
    },
  ];
  public displayedColumns: string[] = ['pontos', 'mortalidade'];
  @Input() totalApache: number = 0;
  public dataSource = this.tabelaApache;

  public findLineForValue(value: number): number | null {
    return PacienteMapper.findLineForValue(value, this.tabelaApache);
  }
}
