import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { PacientsListComponent } from '../../components/pacients-list/pacients-list.component';
import { SheetsService } from '../../shared/services/sheets/sheets.service';
import { DialogComponent } from './../../shared/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatPaginatorModule,
    PacientsListComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit {
  private readonly _sheets = inject(SheetsService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);
  public pacientes = this._sheets.pacientes;

  public pageIndex = 0;
  public pageSize = 10;
  public pageEvent!: PageEvent;
  public totalElements = this._sheets.totalElements;
  public totalPages = this._sheets.totalPages;

  ngOnInit(): void {
    this.getTable();
  }

  public handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTable();
  }

  private getTable(): void {
    this._sheets
      .getRows(this.pageIndex, this.pageSize)
      .subscribe((pacientes) => {
        this._sheets.pacientes.set(pacientes);
        this._sheets.totalElements.set(this.totalElements());
      });
  }

  public onAdd() {
    this.router.navigate(['patientform']);
  }

  public onEdit(lineId: number): void {
    const index = lineId + 2 + this.pageIndex * this.pageSize;
    this.router.navigate(['edit', index]);
  }

  public onDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          const lineId = index + 2 + this.pageIndex * this.pageSize;
          this._sheets.deleteRow(lineId).subscribe({
            next: () => {
              this.onSuccess();
              this.getTable();
            },
            error: (error) => {
              const errorMessage =
                error?.error?.error ?? 'Erro ao deletar paciente';
              this.onError(errorMessage);
            },
          });
        }
      },
      error: (error) => {
        console.error('Erro ao fechar o diálogo:', error);
      },
    });
  }

  private onError(message: string) {
    this._snackBar.open(message, 'x', { duration: 3000 });
  }

  private onSuccess() {
    this._snackBar.open('Paciente deletado com sucesso', '', {
      duration: 2000,
    });
    this.onCancel();
  }

  private onCancel() {
    this.router.navigate(['']);
  }
}
