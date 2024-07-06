import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import moment from 'moment';
import { map } from 'rxjs';

import { IPaciente, User } from '../../shared/model/commom.model';
import { AuthService } from '../../shared/services/auth.service';
import { SheetsService } from '../../shared/services/sheets.service';
import { SpinnerService } from '../../shared/services/spinner/spinner.service';
import { DialogComponent } from './../../shared/dialog/dialog.component';
import { PacientsListComponent } from '../../components/pacients-list/pacients-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Paciente {
  atendimento: number;
  idade: number;
  patologia: string;
  internacao: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatToolbarModule, MatPaginatorModule, PacientsListComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent implements OnInit {

  dataSource = new MatTableDataSource<Paciente>()
  private readonly _sheets = inject(SheetsService)
  private dialog = inject(MatDialog)
  displayedColumns: string[] = ['atendimento', 'idade', 'patologia', 'actions'];
  private readonly router = inject(Router)
  private _snackBar = inject(MatSnackBar)
  pacientes = this._sheets.pacientes
  _authSvc = inject(AuthService)
  user!: User
  _spinnerSvc = inject(SpinnerService)

  pageIndex = 0;
  pageSize = 10;
  pageEvent!: PageEvent;
  public totalElements = this._sheets.totalElements;
  public totalPages = this._sheets.totalPages

  ngOnInit(): void {
    this.getTable()
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTable();
  }

  private getTable() {
    this._spinnerSvc.show()
    this._sheets.getRows(this.pageIndex, this.pageSize).pipe(
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
      }))
      .subscribe(paciente => {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const filteredData = paciente.slice(startIndex, endIndex);
        this.pacientes.set(filteredData);
        this.totalElements.set(this.totalElements());
        this._spinnerSvc.hide()
      });
  }


  onDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          const lineId = index + 2 + (this.pageIndex * this.pageSize);
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

  onEdit(paciente: []) { }

}
