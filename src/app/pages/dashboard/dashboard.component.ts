import { DialogComponent } from './../../shared/dialog/dialog.component';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private dialog = inject(MatDialog)
  displayedColumns: string[] = ['atendimento', 'idade', 'patologia', 'internacao', 'actions'];
  private readonly router = inject(Router)
  private readonly _sheets = inject(SheetsService)
  private _snackBar = inject(MatSnackBar)
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

  onDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          const lineId = index + 2;
          this._sheets.deleteRow(lineId).subscribe({
            next: () => {
              this.onSuccess();
              this.getTable();
            },
            error: (error) => {
              const errorMessage = error?.error?.error ?? "Erro ao deletar paciente";
              this.onError(errorMessage);
            }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao fechar o diálogo:', error);
      }
    });
  }

  private onError(message: string) {
    this._snackBar.open(message, "x", { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open("Paciente deletado com sucesso", '', { duration: 2000 });
    this.onCancel()
  }

  onCancel() {
    this.router.navigate([''])
  }

  logout() {
    this._authSvc.logout()
  }

  onAdd() {
    this.router.navigate(['patientform'])
  }

}
