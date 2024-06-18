import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import moment from 'moment';
import { map } from 'rxjs';

import { User } from '../../shared/model/commom.model';
import { AuthService } from '../../shared/services/auth.service';
import { SheetsService } from '../../shared/services/sheets.service';

export interface Paciente {
  atendimento: number;
  idade: number;
  patologia: string;
  internacao: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatToolbarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<Paciente>()
  displayedColumns: string[] = ['atendimento', 'idade', 'patologia', 'internacao', 'actions'];
  private readonly router = inject(Router)
  private readonly _sheets = inject(SheetsService)
  _authSvc = inject(AuthService)
  user!: User

  ngOnInit(): void {
    this.getTable()
  }

  private getTable() {
    this._sheets.getRows().pipe(
      map((data: any): Paciente[] => {
        const paciente = data.values.map((item: any[]): Paciente => {
          const dataInternacao = moment(item[3], 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY');
          return {
            atendimento: parseInt(item[0]),
            idade: parseInt(item[1]),
            patologia: item[2],
            internacao: dataInternacao
          };
        });
        return paciente;
      })
    ).subscribe(paciente => {
      this.dataSource.data = paciente;
    });
  }


  onDelete(index: any): void {
    console.log(index + 2)
    const lineId = index + 2
    this._sheets.deleteRow(lineId).subscribe(response => {
      console.log("Linha deletada com sucesso: ", response);
      this.getTable(); // Atualiza a tabela após excluir a linha
    },
      error => {
        console.error('Erro ao deletar linha:', error);
        // Trate o erro conforme necessário (exibir mensagem de erro, etc.)
      }
    )

  }



  logout() {
    this._authSvc.logout()
  }

  onAdd() {
    this.router.navigate(['patientform'])
  }

}
